import { Message, GuildMember } from "discord.js";
import { Sani } from "./bot";

export function killswitch(bot: Sani, allowedusers: ReadonlyArray<string>) {
   return async function(msg: Message) {
      if (bot.bot.user && msg.mentions.has(bot.bot.user) && allowedusers.includes(msg.author.id) && msg.content.endsWith("DIEEE")) {
         // const userstr = msg.author instanceof GuildMember
         //    ? (msg.author.nickname === null ? `${msg.author.nickname}`)
         //    : `${msg.author.username}#${msg.author.discriminator}`

         const userstr = (
            msg.member?.nickname
               ? `${msg.member.nickname} (${msg.author.username}#${msg.author.discriminator})`
               : `${msg.author.username}#${msg.author.discriminator}`
         ) + ` (id ${msg.author.id})`;

         console.log(`kill requested by ${userstr}`);
         await msg.react("👌").catch(() => { /* silently ignore reaction error */ });
         bot.stop();
      }
   };
}
