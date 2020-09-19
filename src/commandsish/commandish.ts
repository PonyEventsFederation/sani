// because commands are like !say hi
// but these aren't really
// so i needed another name for is but its technically a command too lol
import { ClientUser, Message } from "discord.js";
import { SaniSoda } from "../bot";

export abstract class Commandish {
   protected sani: SaniSoda;
   protected botusr: ClientUser;

   public constructor(sani: SaniSoda) {
      this.sani = sani;
      this.botusr = sani.getuser();
   }

   // test whether or not this handler should handle this message
   public abstract shouldhandle(msg: Message): boolean;

   // actually handle it
   public abstract handle(msg: Message): Promise<void>;
}
