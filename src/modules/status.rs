use super::*;

#[derive(Clone)]
pub struct Status();

#[async_trait]
impl Module for Status {
	async fn handle_event(&self, event: Event) {
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
	}
}
