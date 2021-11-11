use twilight_bot_utils::modules::*;

#[derive(Clone)]
pub struct Status();

#[async_trait]
impl Module for Status {
	async fn handle_event(&self, event: Event) -> HandleResult {
		match event.event {
			GatewayReconnect => {
				eprintln!("reconnecting...");
			}
			GatewayHello(_) => {
				eprintln!("connected!");
			}
			GatewayInvalidateSession(_) => {
				eprintln!("invalidated session");
			}
			_ => {}
		}

		Ok(())
	}
}
