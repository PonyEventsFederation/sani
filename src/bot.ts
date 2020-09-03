import { Client } from "discord.js";
import { assertenv } from "./rando";

export class Bot {
   private bot: Client;
   private destroyed: boolean = false;

   public constructor() {
      this.bot = new Client();
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
}
