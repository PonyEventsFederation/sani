// todo remove later
#![allow(unused)]

mod loyalty_server;
mod modules;
use twilight_bot_utils::deps::*;
use futures::stream::StreamExt;
use twilight_bot_utils::modules::*;
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
use twilight_bot_utils::env::Env;

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

	let mut modules: Vec<Box<dyn Module>> = modules();

	let current_user = http.current_user()
		.exec().await?
		.model().await?;
	let stuff = InitStuff {
		current_user,
		http: Arc::clone(&http)
	};

	for module in modules.iter_mut() {
		module.init(&stuff).await;
	}

	let modules = Arc::new(
		modules.into_iter()
			.map(Arc::new)
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

#[inline]
async fn setup_http_and_cluster(env: &Env) -> MainResult<HttpAndCluster> {
	let http = HttpClient::new(env.token().to_string());
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
#[cfg(debug_assertions)]
fn modules() -> Vec<Box<dyn Module>> {
	vec![
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
	]
}

#[inline]
#[cfg(not(debug_assertions))]
fn modules() -> Vec<Box<dyn Module>> {
	let guild_id = guild_id(602434888880095242);
	let channel_id = channel_id(823351439279259648);
	let server_role_message = message_id(839966718071406652);
	let year_role_message = message_id(839966718507221013);

	vec![
		// artist
		Box::new(ReactionRole {
			channel_id,
			guild_id,
			emoji: RequestReactionType::Custom {
				id: emoji_id(823502121487958016),
				name: None
			}, // :Artist:
			message_id: server_role_message,
			role_id: role_id(605726501924765706)
		}),

		// musician
		Box::new(ReactionRole {
			channel_id,
			guild_id,
			emoji: RequestReactionType::Custom {
				id: emoji_id(823503291027161128),
				name: None
			}, // :DJ:
			message_id: server_role_message,
			role_id: role_id(605451090430918752)
		}),

		// cosplayer
		Box::new(ReactionRole {
			channel_id,
			guild_id,
			emoji: RequestReactionType::Custom {
				id: emoji_id(639189237400469517),
				name: None
			}, // :Innkeep:
			message_id: server_role_message,
			role_id: role_id(607227135756599326)
		}),

		// meme
		Box::new(ReactionRole {
			channel_id,
			guild_id,
			emoji: RequestReactionType::Custom {
				id: emoji_id(745824076940968077),
				name: None
			}, // :Dab:
			message_id: server_role_message,
			role_id: role_id(605454893620396060)
		}),

		// rp
		Box::new(ReactionRole {
			channel_id,
			guild_id,
			emoji: RequestReactionType::Custom {
				id: emoji_id(667481831293190174),
				name: None
			}, // :Salute:
			message_id: server_role_message,
			role_id: role_id(755487852720291851)
		}),

		// news
		Box::new(ReactionRole {
			channel_id,
			guild_id,
			emoji: RequestReactionType::Custom {
				id: emoji_id(823482395202158633),
				name: None
			}, // :Scroll
			message_id: server_role_message,
			role_id: role_id(784873956363599912)
		}),

		// movie night
		Box::new(ReactionRole {
			channel_id,
			guild_id,
			emoji: RequestReactionType::Custom {
				id: emoji_id(606565381288493077),
				name: None
			},
			message_id: server_role_message,
			role_id: role_id(839970021803556905)
		}),

		// 2012
		Box::new(ReactionRole {
			channel_id,
			guild_id,
			emoji: RequestReactionType::Custom {
				id: emoji_id(824789163605098516),
				name: None
			},
			message_id: year_role_message,
			role_id: role_id(628136070642401280)
		}),

		// 2013
		Box::new(ReactionRole {
			channel_id,
			guild_id,
			emoji: RequestReactionType::Custom {
				id: emoji_id(824789178448871454),
				name: None
			},
			message_id: year_role_message,
			role_id: role_id(628136127643123732)
		}),

		// 2014
		Box::new(ReactionRole {
			channel_id,
			guild_id,
			emoji: RequestReactionType::Custom {
				id: emoji_id(824789187956965386),
				name: None
			},
			message_id: year_role_message,
			role_id: role_id(628136132701454346)
		}),

		// 2015
		Box::new(ReactionRole {
			channel_id,
			guild_id,
			emoji: RequestReactionType::Custom {
				id: emoji_id(824789203673808936),
				name: None
			},
			message_id: year_role_message,
			role_id: role_id(628136394023370752)
		}),

		// 2016
		Box::new(ReactionRole {
			channel_id,
			guild_id,
			emoji: RequestReactionType::Custom {
				id: emoji_id(824789214251057182),
				name: None
			},
			message_id: year_role_message,
			role_id: role_id(628136665721864202)
		}),

		// 2017
		Box::new(ReactionRole {
			channel_id,
			guild_id,
			emoji: RequestReactionType::Custom {
				id: emoji_id(824789229765656576),
				name: None
			},
			message_id: year_role_message,
			role_id: role_id(628137097244442627)
		}),

		// 2018
		Box::new(ReactionRole {
			channel_id,
			guild_id,
			emoji: RequestReactionType::Custom {
				id: emoji_id(824789240737955880),
				name: None
			},
			message_id: year_role_message,
			role_id: role_id(628136798299750421)
		}),

		// 2019
		Box::new(ReactionRole {
			channel_id,
			guild_id,
			emoji: RequestReactionType::Custom {
				id: emoji_id(824789250582380554),
				name: None
			},
			message_id: year_role_message,
			role_id: role_id(628136797095854100)
		})
	]
}

#[inline]
fn start_cluster(cluster: &Arc<Cluster>) {
	let cluster = Arc::clone(cluster);
	spawn(async move { cluster.up().await });
}

/// asyncronously wait for a signal and then bring cluster down
#[inline]
fn watch_for_stop_events(cluster: &Arc<Cluster>) {
	let cluster = Arc::clone(cluster);

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
