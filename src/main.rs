// todo remove later
#![allow(unused)]

mod env;
mod modules;

use env::Env;
use futures::stream::StreamExt;
use modules::module::Event;
use modules::module::InitStuff;
use modules::status::Status;
use modules::reaction_role::ReactionRole;
use modules::reaction_role::channel_id;
use modules::reaction_role::emoji_id;
use modules::reaction_role::guild_id;
use modules::reaction_role::message_id;
use modules::reaction_role::role_id;
use std::error::Error;
use std::sync::Arc;
use std::time::Duration;
use tokio::signal::unix::signal;
use tokio::signal::unix::SignalKind;
use tokio::spawn;
use twilight_gateway::cluster::Cluster;
use twilight_gateway::cluster::Events;
use twilight_gateway::cluster::ShardScheme::Auto;
use twilight_gateway::Intents;
use twilight_http::client::Client as HttpClient;
use twilight_http::request::channel::reaction::RequestReactionType;
use twilight_model::channel::ReactionType;
use twilight_model::id::ChannelId;
use twilight_model::id::GuildId;
use twilight_model::id::EmojiId;
use twilight_model::id::MessageId;
use twilight_model::id::RoleId;

type MainResult<T = ()> = Result<T, Box<dyn Error + Send + Sync>>;

fn main() -> MainResult {
	let rt = tokio::runtime::Builder::new_multi_thread()
		.enable_all()
		.worker_threads(2)
		.max_blocking_threads(32)
		.thread_keep_alive(Duration::from_secs(60))
		.build()
		.unwrap();

	rt.block_on(async_main())?;
	rt.shutdown_timeout(Duration::from_secs(60));

	Ok(())
}

async fn async_main() -> MainResult {
	let env = Env::get_env();

	let HttpAndCluster { http, cluster, mut events } = setup_http_and_cluster(&env).await?;

	let mut modules: Vec<Box<dyn modules::module::Module>> = vec![
		Box::new(Status()),
		Box::new(ReactionRole {
			role_id: role_id(905_52966_33953_52587),
			guild_id: guild_id(834_29759_11599_80073),
			channel_id: channel_id(834_29852_87413_26869),
			message_id: message_id(905_53005_37717_88360),
			emoji: RequestReactionType::Custom {
				id: emoji_id(897_60539_74504_61215),
				name: None
			}
		})
	];

	let stuff = InitStuff {
		http: Arc::clone(&http)
	};

	for module in modules.iter_mut() {
		module.init(&stuff).await;
	}

	let modules = Arc::new(
		modules.into_iter()
			.map(|m| Arc::new(m))
			.collect::<Vec<_>>()
	);

	start_cluster(&cluster);
	watch_for_stop_events(&cluster);

	while let Some((shard_id, event)) = events.next().await {
		// clone a few values, then send it off into another task
		// so we can quickly wait for and process the next event
		let modules = Arc::clone(&modules);
		let event = event.clone();
		let http = Arc::clone(&http);

		spawn(async move {
			for module in modules.iter() {
				let module = Arc::clone(module);
				let event = event.clone();
				let http = Arc::clone(&http);

				let event = Event { shard_id, event, http };

				spawn(async move {
					module.handle_event(event).await;
				});
			}
		});
	}

	Ok(())
}

struct HttpAndCluster {
	http: Arc<HttpClient>,
	cluster: Arc<Cluster>,
	events: Events
}

async fn setup_http_and_cluster(env: &Env) -> MainResult<HttpAndCluster> {
	let http = HttpClient::new(env.token().to_string().clone());
	let http = Arc::new(http);

	// todo make intents better
	let intents = Intents::all();
	let (cluster, events) = Cluster::builder(env.token(), intents)
		.shard_scheme(Auto)
		.build().await?;
	let cluster = Arc::new(cluster);

	Ok(HttpAndCluster { http, cluster, events })
}

#[inline]
fn start_cluster(cluster: &Arc<Cluster>) {
	let cluster = Arc::clone(&cluster);
	spawn(async move { cluster.up().await });
}

/// asyncronously wait for a signal and then bring cluster down
#[inline]
fn watch_for_stop_events(cluster: &Arc<Cluster>) {
	let cluster = Arc::clone(&cluster);

	spawn(async move {
		let mut sigint = signal(SignalKind::interrupt()).unwrap();
		let mut sigterm = signal(SignalKind::terminate()).unwrap();

		tokio::select! {
			// without biased, tokio::select! will choose random branches to poll,
			// which incurs a small cpu cost for the random number generator
			// biased polling is fine here
			biased;

			_ = sigint.recv() => {}
			_ = sigterm.recv() => {}
		}

		cluster.down();
	});
}
