import { Client } from "discord.js";
import { Commandish } from "./commandish";

export type Logger = (...args: any) => void;

type SaniOpts = {
   readonly token: string;
   readonly events: ReadonlyArray<string>;
   readonly stdout?: Logger;
   readonly stderr?: Logger;
   readonly commandishes: ReadonlyArray<Commandish>;
};

export type Sani = {
   readonly bot: Client;
   stop(): void;
};

/** creates a sani bot, logs in and everything, returns a sani object */
export async function createsani(opts: SaniOpts): Promise<Sani> {
   // create some vars and stuff
   const bot = new Client();
   const commandishes: Array<ReturnType<Commandish>> = [];

   const sani: Sani = {
      get bot() {
         return bot;
      },
      stop() {
         bot.destroy();
      }
   };

   opts.commandishes.forEach(cmdish => commandishes.push(cmdish({
      sani,
      stdout: opts.stdout ?? console.log,
      stderr: opts.stderr ?? console.error
   })));

   // initialise the commandishes and stuffs
   bot.on("message", async msg => {
      // if no bot user, ignore all bots to prevent endless loop
      if (!bot.user && msg.author.bot) return;
      // else ignore self
      if (bot.user === msg.author) return;

      for (const cmd of commandishes) {
         const res = await cmd(msg);
         if (res === false) break;
      }
   });

   // login and init the stop events
   await bot.login(opts.token);

   let up = true;
   // const stop = () => void (opts.stdout ?? console.log)("not up!") ?? void bot.destroy();
   const stop = () => up && (void (opts.stdout ?? console.log)("not up!") ?? void bot.destroy() ?? (up = false));
   opts.events.forEach(event => process.on(event, stop));

   (opts.stdout ?? console.log)("up!");
   return sani;
}
