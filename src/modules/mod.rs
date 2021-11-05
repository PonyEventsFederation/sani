// useful imports for modules
// import all of this in a module with `use super::*;`
use async_trait::async_trait;
use twilight_gateway::Event::*;

pub mod status;
pub mod reaction_role;

pub use modules_stuff::*;

mod modules_stuff {
	use std::error::Error;
	use std::sync::Arc;
	use twilight_gateway::Event as GatewayEvent;
	use twilight_gateway::Intents;
	use twilight_http::Client;
	use twilight_model::user::CurrentUser;

	pub type HandleResult<T = ()> = Result<T, Box<dyn Error + Send + Sync>>;
	pub type InitResult<T = ()> = Result<T, Box<dyn Error + Send + Sync>>;

	pub struct InitStuff {
		pub current_user: CurrentUser,
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
}
