import { Client } from "discord.js";
import { assertenv } from "./rando";
import { Command } from "./commands/command";

import { YearAssignCommand } from "./commands/yearassign";

export class SaniSoda {
   private bot: Client;
   private destroyed: boolean = false;
   private busy: boolean = false;
   private commandhandlers: Command[];

   public constructor() {
      this.bot = new Client();
      this.commandhandlers = [];
      this.initcommands();
   }

   public isbusy(): boolean {
      return this.busy;
   }
   public setbusy(busy: boolean): void {
      this.busy = busy;
   }
   public getbot(): Client {
      return this.bot;
   }

   public async start(): Promise<void> {
      assertenv("TOKEN");
      await this.bot.login(process.env.TOKEN);

      const boundstop: () => void = this.stop.bind(this);
      process.on("exit", boundstop);
      process.on("SIGINT", boundstop);
      process.on("SIGTERM", boundstop);
      this.bot.on("message", msg => console.log(msg.content));
   }
   public stop(): void {
      if (this.destroyed) return;
      this.bot.destroy();
      this.destroyed = true;
   }

   private initcommands(): void {
      this.commandhandlers.push(new YearAssignCommand(this));
      // this.commandhandlers.push(new YeeEeET(this));
      // this.commandhandlers.push(new lol(this));

      this.bot.on("message", msg => {
         if (msg.author.bot) return;
         for (let i = 0; i < this.commandhandlers.length; i++) if (this.commandhandlers[i].shouldhandle(msg)) this.commandhandlers[i].handle(msg);
      });
   }
}
