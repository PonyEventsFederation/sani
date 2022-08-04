// mostly copy/paste from autumnblazey/kiwin-bot for now

import { Client, GuildEmoji, GuildMember, MessageReaction, PartialUser, ReactionEmoji, Role, User } from "discord.js";

export type ReactionRole = {
   /** probably not needed, i think can fetch it from the channel */
   serverid?: string;
   channelid: string;
   messageid: string;

   /**
    * if its a default emoji, put the actual emoji here
    * if its a discord custom emoji, put the id
    */
   emoji: string;
   roleid: string;
};

export type ReactionRoleOpts = {
   bot: Client;
   roles: ReadonlyArray<ReactionRole>;
};

type InternalRoleStore = {
   [key: string]: undefined | ReactionRole;
};

function rolekey(opts: {
   channelid: string;
   messageid: string;
   emoji: string;
}) {
   return `${opts.channelid} ${opts.messageid} ${opts.emoji}`;
}

function makeinternal(roles: ReadonlyArray<ReactionRole>): InternalRoleStore {
   const store: InternalRoleStore = {};
   roles.forEach(role => store[rolekey(role)] = role);
   return store;
}

function log(msg: string, { guildmember, role, emoji }: {
   guildmember: GuildMember;
   role: Role;
   emoji: GuildEmoji | ReactionEmoji;
}) {
   console.log(`${msg} (${guildmember.id} ${guildmember.user.username}#${guildmember.user.discriminator}, role: ${role.id} ${role.name}, emoji: ${emoji.id ? `${emoji.id} ` : ""}${emoji.name})`);
}
export async function createreactionrole(opts: ReactionRoleOpts) {
   opts.bot.once("ready", async () => {
      for (const r of opts.roles) {
         const channel = await opts.bot.channels.fetch(r.channelid);
         channel.isText() && await channel.messages.fetch(r.messageid);
      }
      console.log("reaction roles are ready");
   });

   const internalstore = makeinternal(opts.roles);

   return async function(reaction: MessageReaction, user: User | PartialUser) {
      if (user.bot) return;

      reaction = reaction.partial ? await reaction.fetch() : reaction;
      const emoji = reaction.emoji;
      const guildmember = await reaction.message.guild?.members.fetch(user.id);
      if (!guildmember) return;

      const roletogive = internalstore[rolekey({
         channelid: reaction.message.channel.id,
         messageid: reaction.message.id,
         emoji: reaction.emoji.id !== null ? reaction.emoji.id : reaction.emoji.toString()
      })];
      if (!roletogive) return;

      await guildmember.fetch(true);
      const role = await guildmember.guild.roles.fetch(roletogive.roleid);
      if (role === null) return;

      if (!guildmember.roles.cache.has(role.id)) {
         await guildmember.roles.add(role.id).catch(console.error);
         log("added role", { guildmember, role, emoji });
      } else {
         await guildmember.roles.remove(role.id).catch(console.error);
         log("removed role", { guildmember, role, emoji });
      }

      await reaction.users.remove(user.id);
   };
}
