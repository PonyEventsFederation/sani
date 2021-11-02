// todo remove later
#![allow(unused)]

mod env;

use std::{
	error::Error,
	time::Duration,
	sync::Arc
};

use twilight_gateway::{
	cluster::{ Cluster, ShardScheme::Auto },
	Event,
	Intents
};
use twilight_http::client::Client as HttpClient;
use futures::stream::StreamExt;

type MainResult = Result<(), Box<dyn Error + Send + Sync>>;

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
	let env = env::Env::get_env();

	let http = HttpClient::new(env.token().clone());
	let http = Arc::new(http);

	// todo make this better
	let intents = Intents::all();
	let (cluster, mut events) = Cluster::builder(env.token(), intents)
		.shard_scheme(Auto)
		.build().await?;
	let cluster = Arc::new(cluster);

	let cluster_spawn = Arc::clone(&cluster);
	tokio::spawn(async move { cluster_spawn.up().await });

	// asyncronously wait for a signal and then bring cluster down
	let cluster_down = Arc::clone(&cluster);
	tokio::spawn(async move {
		use tokio::signal::unix::{ signal, SignalKind as SK };
		let mut sigint = signal(SK::interrupt()).unwrap();
		let mut sigterm = signal(SK::terminate()).unwrap();

		tokio::select! {
			// without biased, tokio::select! will choose random branches to poll,
			// which incurs a small cpu cost for the random number generator
			// biased polling is fine here
			biased;

			_ = sigint.recv() => {}
			_ = sigterm.recv() => {}
		}

		cluster_down.down();
	});

	while let Some((shard_id, event)) = events.next().await {
		// do something
	}

	Ok(())
}
