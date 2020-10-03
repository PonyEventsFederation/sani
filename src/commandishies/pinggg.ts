import { Message } from "discord.js";
import { langen } from "../lang";
import { randfromarray } from "../rando";
// import { Lang_en } from "../lang";
import { Commandish } from "./commandish";

/** make sani respond to needless pings */
export class Pinggg extends Commandish {
   public shouldhandle(msg: Message): boolean {
      return msg.mentions.has(this.botusr);
   }

   public async handle(msg: Message): Promise<void> {
      // msg.channel.send(Lang_en.ping.response);
      await msg.channel.send(randfromarray(langen.ping.responses)[0]);
   }
}
