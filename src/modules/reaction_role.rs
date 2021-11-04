use super::*;

use tokio::time::Duration;
use tokio::time::sleep;
use twilight_model::channel::Reaction;
use twilight_model::channel::ReactionType;
use twilight_http::request::channel::reaction::RequestReactionType;
use twilight_model::guild::Member;
use twilight_model::id::ChannelId;
use twilight_model::id::EmojiId;
use twilight_model::id::GuildId;
use twilight_model::id::MessageId;
use twilight_model::id::RoleId;
use twilight_cache_inmemory::InMemoryCacheBuilder;

pub fn role_id(id: u64) -> RoleId {
	RoleId::new(id).unwrap()
}
pub fn guild_id(id: u64) -> GuildId {
	GuildId::new(id).unwrap()
}
pub fn channel_id(id: u64) -> ChannelId {
	ChannelId::new(id).unwrap()
}
pub fn message_id(id: u64) -> MessageId {
	MessageId::new(id).unwrap()
}
pub fn emoji_id(id: u64) -> EmojiId {
	EmojiId::new(id).unwrap()
}

pub struct ReactionRole<'h> {
	pub guild_id: GuildId,
	pub channel_id: ChannelId,
	pub message_id: MessageId,
	pub emoji: RequestReactionType<'h>,
	pub role_id: RoleId
}

#[async_trait]
impl<'h> Module for ReactionRole<'h> {
	async fn init(&mut self, init: &InitStuff) -> InitResult {
		let current_user = init.http.current_user()
			.exec().await?
			.model().await?;

		let reactions = init.http.reactions(self.channel_id, self.message_id, &self.emoji)
			.limit(100)?
			.exec().await?
			.model().await?;

		let reaction = reactions.iter().any(|u| u.id == current_user.id);
		if !reaction {
			init.http.create_reaction(self.channel_id, self.message_id, &self.emoji)
				.exec().await?;
		}

		Ok(())
	}

	async fn handle_event(&self, event: Event) -> HandleResult {
		if let ReactionAdd(reaction) = event.event {
			let Reaction { channel_id, message_id, emoji, user_id, .. } = reaction.0;
			let emoji = reaction_to_request_reaction_emoji(&emoji);

			// check if the reaction is in the correct channel and message
			if channel_id != self.channel_id
				|| message_id != self.message_id
				|| !emojis_are_eq(&emoji, &self.emoji)
			{ return Ok(()) }

			let member = event.http.guild_member(self.guild_id, user_id)
				.exec().await?.model().await?;

			// check if user has the role, and create new list of roles accordingly
			let new_roles = if !member.roles.clone().into_iter().any(|r| r == self.role_id) {
				let mut roles = member.roles.clone();
				roles.push(self.role_id);
				roles
			} else {
				member.roles.into_iter().filter(|r| r != &self.role_id).collect::<Vec<_>>()
			};

			// perform the role update
			let update = event.http.update_guild_member(self.guild_id, user_id)
				.roles(&new_roles[..]);
				update.exec().await?;

			// delete the reaction after 1s delay
			sleep(Duration::from_secs(1)).await;
			event.http.delete_reaction(channel_id, message_id, &emoji, user_id).exec().await?;
		}

		Ok(())
	}
}

fn reaction_to_request_reaction_emoji(reaction: &ReactionType) -> RequestReactionType<'_> {
	match reaction {
		ReactionType::Unicode { ref name } => {
			RequestReactionType::Unicode { name }
		}
		ReactionType::Custom { ref name, id, .. } => {
			RequestReactionType::Custom { name: name.as_ref().map(|s| &s[..]), id: *id }
		}
	}
}

fn emojis_are_eq(a: &RequestReactionType<'_>, b: &RequestReactionType<'_>) -> bool {
	if let RequestReactionType::Custom { id: a_id, .. } = a {
		if let RequestReactionType::Custom { id: b_id, .. } = b {
			return a_id == b_id
		}
	}

	if let RequestReactionType::Unicode { name: a_name } = a {
		if let RequestReactionType::Unicode { name: b_name } = b {
			return a_name == b_name
		}
	}

	false
}
