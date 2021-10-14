use std::error::Error;
use twilight_gateway::{
	cluster::{ Cluster, ShardScheme::Auto },
	Event, Intents
};
use twilight_http::Client as HttpClient;
use futures::stream::StreamExt;

struct Bot {
	gateway_cluster: Cluster,
	http: HttpClient
}

impl Bot {
	pub async fn new(token: String) -> Result<Bot, dyn Error + Send + Sync> {
		let intents = Intents::all();

		// gateway

		let (cluster, mut events) = Cluster::builder(token.clone(), intents)
			.shard_scheme(Auto)
			.build().await?;

		let cluster_spawn = cluster.clone();
		tokio::spawn(async move { cluster_spawn.up().await });

		// http

		let http = HttpClient::new(token);

		let loop_cluster = cluster.clone();
		tokio::spawn(async move {
			while let Some((shard_id, event)) = loop_cluster.next().await {
				// h
			}
		});

		Ok(Bot { gateway_cluster: cluster, http })
	}
}
