// reacts on the message

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
	let env = sani::env::Env::get_env();

	let http = twilight_http::Client::new(env.token().clone());

	http.create_reaction(
		twilight_model::id::ChannelId(83_4298_5287_4132_6869),
		twilight_model::id::MessageId(89_7704_3577_1224_4778),
		&twilight_http::request::channel::reaction::RequestReactionType::Custom {
			id: twilight_model::id::EmojiId(89_7655_9336_8823_8120),
			name: None
		}
	).exec().await?;

	Ok(())
}
