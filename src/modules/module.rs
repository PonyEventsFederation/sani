use std::error::Error;
use std::sync::Arc;
use twilight_gateway::Event as GatewayEvent;
use twilight_gateway::Intents;
use twilight_http::Client;

pub type HandleResult<T = ()> = Result<T, Box<dyn Error + Send + Sync>>;
pub type InitResult<T = ()> = Result<T, Box<dyn Error + Send + Sync>>;

pub struct InitStuff {
	pub http: Arc<Client>
}

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

	async fn init(&mut self, init: &InitStuff) -> InitResult { Ok(()) }
	async fn handle_event(&self, event: Event) -> HandleResult;
}
