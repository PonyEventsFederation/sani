// because commands are like !say hi
// but these aren't really
// so i needed another name for is but its technically a command too lol
import { ClientUser, Message } from "discord.js";
import { SaniSoda } from "../bot";

/**
 * ok So this name "Commandish", where it comes from and why?
 *
 * Bots commonly have this thing known as commands, like "!help avatar". These are a sort
 * of like "terminal app" type thing, where you have a command (help) and arguments
 * to the command (avatar).
 *
 * Commandishes are like these, but not really. They're commands *ish*.
 * They are commands because they are triggered by certain keywords or phrases or whatever,
 * but they aren't commands in the "traditional" sense of "prefix + command + arguments".
 *
 * so Commandish is the most creative (not really creative) name i can come up with.
 */
export abstract class Commandish {
   /** the {@link SaniSoda} instance that constructed this */
   protected sani: SaniSoda;

   /**
    * the [ClientUser](https://discord.js.org/#/docs/main/v12/class/ClientUser) of the
    * [Client](https://discord.js.org/#/docs/main/v12/class/Client) of the instantiating
    * {@link SaniSoda}
    */
   protected botusr: ClientUser;

   /**
    * constructs a new instance of this Commandish.
    *
    * @param sani the instantiating SaniSoda (this implies multiple... Changelings!)
    */
   public constructor(sani: SaniSoda) {
      this.sani = sani;
      this.botusr = sani.getuser();
   }

   /**
    * test whether or not this handler should handle this message
    *
    * @param msg message to test on
    * @returns whether or not this commandish should handle this message
    */
   public abstract shouldhandle(msg: Message): boolean;

   /**
    * actually handle this message, should only be called if
    * {@link shouldhandle} returns true (in fact, assumes that {@link shouldhandle})
    * returned true
    *
    * @param msg message to handle
    * @returns Promise, the handling method should be async
    */
   public abstract handle(msg: Message): Promise<void>;
}
