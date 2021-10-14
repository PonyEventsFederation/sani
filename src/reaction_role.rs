use twilight_model::id::{ ChannelId, MessageId, RoleId, EmojiId };
use twilight_gateway::Event;
use twilight_model::channel::{ Reaction, ReactionType };

pub enum ReactionEmoji {
	Custom(EmojiId),
	Unicode(String)
}

pub struct ReactionRole {
	pub channel_id: ChannelId,
	pub message_id: MessageId,
	pub emoji: ReactionEmoji,
	pub role_id: RoleId
}
