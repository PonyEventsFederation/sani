import { Message } from "discord.js";
import { Lang_en } from "../lang";
import { Commandish } from "./commandish";

export class Ping extends Commandish {
   public shouldhandle(msg: Message): boolean {
      return msg.mentions.has(this.botusr);
   }

   public async handle(msg: Message): Promise<void> {
      msg.channel.send(Lang_en.ping.response);
   }
}
