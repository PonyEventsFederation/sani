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
		aitch(self, event).await
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

async fn aitch(s: &ReactionRole, event: Event) -> HandleResult {
	if let ReactionAdd(reaction) = event.event {
		let Reaction { channel_id, message_id, emoji, user_id, .. } = reaction.0;

		if channel_id != s.channel_id
			|| message_id != s.message_id
			|| !emojis_are_eq(&emoji, &s.emoji)
		{ return Ok(()) }

		let member = event.http.guild_member(s.guild_id, user_id)
			.exec().await?.model().await?;
		let update = event.http.update_guild_member(s.guild_id, user_id);

		let new_roles = if let None = member.roles.clone().into_iter().find(|r| r == &s.role_id) {
			let mut roles = member.roles.clone();
			roles.push(s.role_id);
			roles
		} else {
			member.roles.into_iter().filter(|r| r != &s.role_id).collect::<Vec<_>>()
		};
		let update = update.roles(&new_roles[..]);

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

		event.http.delete_reaction(channel_id, message_id, &emoji, user_id).exec().await?;
	}

	Ok(())
}
