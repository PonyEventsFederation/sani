import { Client, ClientUser } from "discord.js";
import { assertenv } from "./rando";
import { Commandish } from "./commandsish/commandish";
import { Pinggg } from "./commandsish/pinggg";
import { OtherRoleAssignCommandish } from "./commandsish/otherroleassign";
import { YearAssignCommandish } from "./commandsish/yearassign";

export class SaniSoda {
   private bot: Client;
   private destroyed: boolean = false;
   // private busy: boolean = false;
   private token: string;
   private commandishes: Array<Commandish>;

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

   public getbot(): Client {
      return this.bot;
   }
   public getuser(): ClientUser {
      const botusr: ClientUser | null = this.bot.user;
      if (botusr) return botusr;
      throw new Error("this should never happen... ever ever ever ever ever.");
   }

   public async start(): Promise<void> {
      await this.bot.login(this.token);

      const boundstop: () => void = this.stop.bind(this);
      process.on("exit", boundstop);
      process.on("SIGINT", boundstop);
      process.on("SIGTERM", boundstop);

      this.initcommandishes();
   }
   public stop(): void {
      if (this.destroyed) return;
      this.bot.destroy();
      // other shutdown tasks here
      this.destroyed = true;
   }

   public initcommandishes(): void {
      const pinger: Pinggg = new Pinggg(this);
      this.commandishes.push(new OtherRoleAssignCommandish(this));
      // this.commandishes.push(new OtherRoleAssign(this));
      this.commandishes.push(new YearAssignCommandish(this));

      this.bot.on("message", msg => {
         let done: boolean = false;

         this.commandishes.forEach(commandishthing => {
            if (commandishthing.shouldhandle(msg)) {
               done = true;
               commandishthing.handle(msg);
            }
         });
         if (!done) if (pinger.shouldhandle(msg)) return void pinger.handle(msg);
      });
   }
}
