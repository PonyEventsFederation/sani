use std::sync::Arc;
use twilight_gateway::Event as GatewayEvent;
use twilight_gateway::Intents;
use twilight_http::Client;

pub struct Event {
	pub shard_id: u64,
	pub event: GatewayEvent,
	pub http: Arc<Client>
}

#[async_trait::async_trait]
pub trait Module: Send + Sync {
	#[inline]
	fn intents(&self) -> Intents {
		Intents::empty()
	}

	// async fn init(&mut self);
	async fn handle_event(&self, event: Event);
}
