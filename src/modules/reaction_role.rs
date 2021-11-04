use super::*;
use twilight_model::channel::Reaction;
use twilight_model::channel::ReactionType;
use twilight_http::request::channel::reaction::RequestReactionType;
use twilight_model::guild::Member;
use twilight_model::id::ChannelId;
use twilight_model::id::GuildId;
use twilight_model::id::MessageId;
use twilight_model::id::RoleId;
use twilight_cache_inmemory::InMemoryCacheBuilder;

pub struct ReactionRole {
	pub guild_id: GuildId,
	pub channel_id: ChannelId,
	pub message_id: MessageId,
	// todo investigate this, this might be better as RequestReactionType
	pub emoji: ReactionType,
	pub role_id: RoleId
}

#[async_trait]
impl Module for ReactionRole {
	async fn handle_event(&self, event: Event) -> HandleResult {
		if let ReactionAdd(reaction) = event.event {
			let Reaction { channel_id, message_id, emoji, user_id, .. } = reaction.0;

			// check if the reaction is in the correct channel and message
			if channel_id != self.channel_id
				|| message_id != self.message_id
				|| !emojis_are_eq(&emoji, &self.emoji)
			{ return Ok(()) }

			let member = event.http.guild_member(self.guild_id, user_id)
				.exec().await?.model().await?;

			// check if user has the role, and create new list of roles accordingly
			let new_roles = if let None = member.roles.clone().into_iter().find(|r| r == &self.role_id) {
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

			// wot
			// i think this could be cleaner, 100%
			let emoji = match emoji {
				ReactionType::Unicode{ ref name } => {
					RequestReactionType::Unicode { name: &name }
				}
				ReactionType::Custom{ ref name, id, .. } => {
					RequestReactionType::Custom { name: name.as_ref().map(|s| &s[..]), id }
				}
			};

			// delete the reaction after 1s delay
			tokio::time::sleep(std::time::Duration::from_secs(1)).await;
			event.http.delete_reaction(channel_id, message_id, &emoji, user_id).exec().await?;
		}

		Ok(())
	}
}

fn emojis_are_eq(a: &ReactionType, b: &ReactionType) -> bool {
	if let ReactionType::Unicode { name: a_unicode } = a {
		if let ReactionType::Unicode { name: b_unicode } = b {
			return a_unicode == b_unicode
		}
	}

	if let ReactionType::Custom { id: a_id, .. } = a {
		if let ReactionType::Custom { id: b_id, .. } = b {
			return a_id == b_id
		}
	}

	false
}
