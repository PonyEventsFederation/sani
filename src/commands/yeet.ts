import { SaniSoda } from "../bot";
import { Command } from "./command";
import { Message } from "discord.js";

export class YeeEeET extends Command {
   constructor(sani: SaniSoda) {
      super(sani);
   }

   public shouldhandle(msg: Message): boolean {
      if (msg.content.toLowerCase().includes("yeet")) return true;
      return false;
   }
   public handle(msg: Message): void {
      msg.channel.send("YYEYyyeyetttt");
   }
}
