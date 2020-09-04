import { SaniSoda } from "../bot";
import { Message } from "discord.js";

export abstract class Command {
   protected sani: SaniSoda;
   constructor(sani: SaniSoda) {
      this.sani = sani;
   }

   // test whether or not this handler should handle this command message
   public abstract shouldhandle(msg: Message): boolean;

   // actually handle it
   public abstract handle(msg: Message): Promise<void> | void;
}
