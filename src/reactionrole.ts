// mostly copy/paste from autumnblazey/kiwin-bot for now

import { Client, MessageReaction, PartialUser, User } from "discord.js";

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

export async function createreactionrolehandlers(opts: ReactionRoleOpts) {
   opts.bot.once("ready", async () => {
      for (const r of opts.roles) {
         const channel = await opts.bot.channels.fetch(r.channelid);
         channel.isText() && channel.messages.fetch(r.messageid);
      }
   });

   const internalstore = makeinternal(opts.roles);

   async function preparerole(opts: {
      reaction: MessageReaction;
      user: User | PartialUser;
   }) {
      const reaction = opts.reaction.partial ? await opts.reaction.fetch() : opts.reaction;

      const guildmember = await reaction.message.guild?.members.fetch(opts.user.id);
      if (!guildmember) return false;

      const emoji = reaction.emoji.id !== null ? reaction.emoji.id : reaction.emoji.toString();
      const roletogive = internalstore[rolekey({
         channelid: reaction.message.channel.id,
         messageid: reaction.message.id,
         emoji
      })];
      if (!roletogive) return false;

      const role = await guildmember.guild.roles.fetch(roletogive.roleid);
      if (role === null) return false;

      return { guildmember, role, emoji };
   }

   return {
      add: async function(reaction: MessageReaction, user: User | PartialUser): Promise<void> {
         const stuff = await preparerole({ reaction, user });
         if (!stuff) return;

         const { guildmember, role, emoji } = stuff;
         if (guildmember.roles.cache.has(role.id)) return console.log(`already has (${guildmember.id} ${guildmember.user.username}#${guildmember.user.discriminator} role: id ${role.id}, ${emoji})`);
         await guildmember.roles.add(role);
         console.log(`added role (${guildmember.id} ${guildmember.user.username}#${guildmember.user.discriminator} role: id ${role.id}, ${emoji})`);
      },
      remove: async function(reaction: MessageReaction, user: User | PartialUser): Promise<void> {
         const stuff = await preparerole({ reaction, user });
         if (!stuff) return;

         const { guildmember, role, emoji } = stuff;
         if (!guildmember.roles.cache.has(role.id)) return console.log(`already doesn't have (${guildmember.id} ${guildmember.user.username}#${guildmember.user.discriminator} role: id ${role.id}, ${emoji})`);
         await guildmember.roles.remove(role);
         console.log(`removed role (${guildmember.id} ${guildmember.user.username}#${guildmember.user.discriminator} role: id ${role.id}, ${emoji})`);
      }
   };
}
