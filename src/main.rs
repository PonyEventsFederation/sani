// todo remove later
#![allow(unused)]

mod env;
mod lib;

use std::{
	error::Error,
	time::Duration
};

use tokio::runtime::Builder as TokioRuntimeBuilder;
use twilight_gateway::{
	cluster::{ Cluster, ShardScheme::Auto },
	Event,
	Intents
};
use twilight_http::client::Client as HttpClient;
use futures::stream::StreamExt;

fn main() {
	let _rt = TokioRuntimeBuilder::new_multi_thread()
		.enable_all()
		.worker_threads(2)
		.max_blocking_threads(32)
		.thread_keep_alive(Duration::from_secs(60))
		.build()
		.unwrap()
		.block_on(async_main());
}

async fn async_main() -> Result<(), Box<dyn Error + Send + Sync>> {
	let env = env::Env::get_env();

	let http = HttpClient::new(env.token().clone());
	let intents = Intents::all();
	let (cluster, mut events) = Cluster::builder(env.token(), intents)
		.shard_scheme(Auto)
		.build().await?;

	let cluster_spawn = cluster.clone();
	tokio::spawn(async move { cluster_spawn.up().await });

	// asyncronously wait for a signal and then bring cluster down
	let cluster_down = cluster.clone();
	tokio::spawn(async move {
		use tokio::signal::unix::{ signal, SignalKind as SK };
		let mut sigint = signal(SK::interrupt()).unwrap();
		let mut sigterm = signal(SK::terminate()).unwrap();

		tokio::select! {
			_ = sigint.recv() => {}
			_ = sigterm.recv() => {}
		}

		cluster_down.down();
	});

	while let Some((shard_id, event)) = events.next().await {
		tokio::spawn(handle_event(shard_id, event, http.clone()));
	}

	Ok(())
}

async fn handle_event(_shard_id: u64, event: Event, http: HttpClient) -> Result<(), Box<dyn Error + Send + Sync>> {
	match event {
		Event::MessageCreate(msg) => {
			println!("got msg: {}", msg.content);

			if msg.content == "h" {
				http.create_message(msg.channel_id)
					.content("weffer")?
					.exec().await?;
			}
		}
		_ => {
			println!("got event {:?}", event);
		}
	}

	Ok(())
}
