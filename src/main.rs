// todo remove later
#![allow(unused)]

mod env;

use env::Env;
use futures::stream::StreamExt;
use std::error::Error;
use std::sync::Arc;
use std::time::Duration;
use tokio::signal::unix::signal;
use tokio::signal::unix::SignalKind;
use tokio::spawn;
use twilight_gateway::cluster::Cluster;
use twilight_gateway::cluster::Events;
use twilight_gateway::cluster::ShardScheme::Auto;
use twilight_gateway::Event;
use twilight_gateway::Intents;
use twilight_http::client::Client as HttpClient;

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

	start_cluster(&cluster);

	watch_for_stop_events(&cluster);

	while let Some((shard_id, event)) = events.next().await {
		// do something
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
