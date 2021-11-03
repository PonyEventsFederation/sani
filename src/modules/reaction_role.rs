use super::*;
use twilight_model::channel::Reaction;
use twilight_model::channel::ReactionType;
use twilight_model::guild::Member;
use twilight_model::id::ChannelId;
use twilight_model::id::GuildId;
use twilight_model::id::MessageId;
use twilight_model::id::RoleId;
use twilight_cache_inmemory::InMemoryCacheBuilder;

pub struct ReactionRole {
	guild_id: GuildId,
	channel_id: ChannelId,
	message_id: MessageId,
	emoji: ReactionType,
	role_id: RoleId
}

#[async_trait]
impl Module for ReactionRole {
	async fn handle_event(&self, event: Event) -> HandleResult {
		Ok(())
	}
}

async fn aitch(s: &ReactionRole, event: Event) -> HandleResult {
	if let ReactionAdd(reaction) = event.event {
		let Reaction { channel_id, message_id, emoji, user_id, member, .. } = reaction.0;

		if channel_id != s.channel_id
			|| message_id != s.message_id
			|| emoji != s.emoji
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
	}

	Ok(())
}
