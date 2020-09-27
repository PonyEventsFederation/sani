import { Client, ClientUser } from "discord.js";
import { assertenv } from "./rando";
import { Commandish } from "./commandishies/commandish";
import { Pinggg } from "./commandishies/pinggg";
import { OtherRoleAssignCommandish } from "./commandishies/otherroleassign";
import { YearAssignCommandish } from "./commandishies/yearassign";
import { HelpCommandish } from "./commandishies/help";

/**
 * The main SaniSoda Client thing
 *
 * not much i have to say here... lol
 *
 * i guess [go follow me on github lol](https://github.com/pcelestia/)
 *
 * oh and join the [GalaCon discord server](https://discord.gg/galacon)! I'm there
 * and so are a lot of awesome friends. there will be lots of hugs... I
 * [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
 *
 * oh that promise joke was so stupid... lol
 */
export class SaniSoda {
   /**
    * The Discord client that is used to communicate with the Discord API. The library
    * used is [discord.js](https://discord.js.org).
    *
    * see [Client (discord.js)](https://discord.js.org/#/docs/main/v12/class/Client)
    */
   private bot: Client;

   /**
    * whether or not this instance of SaniSoda has started. Used because
    * the start function might be called multiple times, and this is used to avoid side effects of calling
    * start more than once.
    */
   private loggedin: boolean = false;

   /**
    * whether or not this instance of SaniSoda has been destoyed. Used because the stop function
    * might be called multiple times, and this is used to avoid side effects of calling stop more
    * than once.
    *
    * see {@link stop}
    */
   private destroyed: boolean = false;

   // /**
   //  * used to indicate whether or not Sani is currently busy. Not used currently,
   //  * was carried over initially from the previous version of Sani bot.
   //  */
   // private busy: boolean = false;

   /** the Discord token. Used to login the discord client */
   private token: string;

   /** array containing the {@link Commandish}es */
   private commandishes: Array<Commandish>;

   /**
    * constructs a new Sani instance (duh)
    *
    * @param token the Discord login token to be used
    */
   public constructor(token?: string) {
      this.bot = new Client();
      if (token) this.token = token;
      else {
         assertenv("TOKEN");
         // h is to satisfy tsc
         this.token = process.env.TOKEN || "h";
      }

      this.commandishes = [];
   }

   /**
    * returns the discord.js [Client](https://discord.js.org/#/docs/main/v12/class/Client) instance
    *
    * see [Client (discord.js)](https://discord.js.org/#/docs/main/v12/class/Client)
    *
    * @returns the discord.js [Client](https://discord.js.org/#/docs/main/v12/class/Client) instance
    */
   public getbot(): Client {
      return this.bot;
   }

   /**
    * gets the discord.js [CLientUser](https://discord.js.org/#/docs/main/v12/class/ClientUser)
    * instance of the underlying [Client](https://discord.js.org/#/docs/main/v12/class/Client)
    *
    * see [CLientUser (discord.js)](https://discord.js.org/#/docs/main/v12/class/ClientUser)
    *
    * @returns the discord.js [CLientUser](https://discord.js.org/#/docs/main/v12/class/ClientUser)
    *          instance of the underlying [Client](https://discord.js.org/#/docs/main/v12/class/Client)
    */
   public getuser(): ClientUser {
      const botusr: ClientUser | null = this.bot.user;
      if (botusr) return botusr;
      throw new Error("this should never happen... ever ever ever ever ever.");
   }

   /**
    * starts the bot, and anything else that needs to be kicked into action.
    * Sani will register her stop function as a listener of process
    * `exit`, `SIGINT`, and `SIGTERM` events, so that she can shut down gracefully
    *
    * @returns Proimse... because async lol
    */
   public async start(): Promise<void> {
      if (this.loggedin) return;
      await this.bot.login(this.token);

      const boundstop: () => void = this.stop.bind(this);
      process.on("exit", boundstop);
      process.on("SIGINT", boundstop);
      process.on("SIGTERM", boundstop);

      this.initcommandishes();

      this.loggedin = true;
   }

   /**
    * stops the bot, and anything else that needs to be stopped and cleaned up
    */
   public stop(): void {
      if (this.destroyed) return;
      this.bot.destroy();
      // other shutdown tasks here
      this.destroyed = true;
   }

   /**
    * initialises the commandishes and things and registers a listener to the underlying
    * [CLient's](https://discord.js.org/#/docs/main/v12/class/Client) `message` event.
    * should not be called more than once (well you can't lol)
    */
   private initcommandishes(): void {
      const pinger: Pinggg = new Pinggg(this);
      // this.commandishes.push(new OtherRoleAssignCommandish(this));
      // this.commandishes.push(new YearAssignCommandish(this));
      this.commandishes.push(new HelpCommandish(this));
      // special ones that have special handling
      const otherrole: OtherRoleAssignCommandish = new OtherRoleAssignCommandish(this);
      const yearrole: YearAssignCommandish = new YearAssignCommandish(this);

      this.bot.on("message", msg => {
         // let done: boolean = false;

         if (msg.author.bot) return;

         // special handling
         if (yearrole.shouldhandle(msg)) yearrole.handle(msg);
         else if (otherrole.shouldhandle(msg)) otherrole.handle(msg);

         // not used for now
         // this.commandishes.forEach(commandishthing => {
         //    if (commandishthing.shouldhandle(msg)) {
         //       done = true;
         //       commandishthing.handle(msg);
         //    }
         // });
         // if (!done) if (pinger.shouldhandle(msg)) return void pinger.handle(msg);

         else if (pinger.shouldhandle(msg)) pinger.handle(msg);
      });
   }
}
