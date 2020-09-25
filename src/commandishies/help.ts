import { Message } from "discord.js";
import { authorperson } from "../ids";
import { placeholder, stickitin } from "../lang";
import { Commandish } from "./commandish";

export class HelpCommandish extends Commandish {
   public shouldhandle(msg: Message): boolean {
      return msg.mentions.has(this.botusr) && helptest.test(msg.content);
   }

   public async handle(msg: Message): Promise<void> {
      await msg.author.send(stickitin(helpmessage, [
         msg.member?.nickname || msg.author.username,
         this.botusr.id,
         this.botusr.id,
         authorperson
      ]));
      if (msg.deletable) await msg.delete();
      else if (msg.channel.type !== "dm") msg.react("✅");
   }
}

/** tests for help (or halp) */
export const helptest: RegExp = /\bh(e|a)lp\b/im;

/**
 * The help message. The placeholders should be replaced with (in order) message author username (`msg.member?.nickname || msg.author.username`),
 * sani user id, sani user id, and author user id ({@link authorperson}).
 */
export const helpmessage = `
Hi ${placeholder}! Seems like you need some help. Here are some things I can do for you.

**"<@${placeholder}> I want musician and 2019 role please"** can get you some roles. It doesn't matter what you put, as long as the word "role" or "roles" is present in your message, I will know you want roles. I have artist, musician, cosplayer, meme, and roleplayer available, as well as the years 2012-2019.

**"<@${placeholder}> I was at galacon in 2014 and 2015"** can get you year roles. It doesn't matter what you put, as long as the word "galacon" is present in your message, I will know you want year roles. I have the years 2012-2019 available.

Thats all I do right now. If you need help, you can always ask <@${placeholder}> about it, she knows the most about me.
`;
