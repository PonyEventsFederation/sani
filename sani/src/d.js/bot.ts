import { Client } from "discord.js";

// poor man's logger
type Logger = (...args: any) => void;

type SaniOpts = Readonly<{
   token: string;
   events: ReadonlyArray<string>;
   stdout?: Logger;
   stderr?: Logger;
}>;

export type Sani = {
   readonly bot: Client;
   stop(): void;
};

/** creates a sani bot, logs in and everything, returns a sani object */
export async function createsani(opts: SaniOpts): Promise<Sani> {
   // create some vars and stuff
   const bot = new Client();

   const sani: Sani = {
      get bot() {
         return bot;
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      stop() {}
   };

   // initialise the commandishes and stuffs
   bot.on("message", async msg => {
      // if no bot user, ignore all bots to prevent endless loop
      if (!bot.user && msg.author.bot) return;
      // else ignore self
      if (bot.user === msg.author) return;
   });

   await bot.login(opts.token);

   // init the stop events

   /** whether or not the bot is logged in, false if destroyed already */
   let up = true;

   // the stop function below checks if up is true, if it is true than its still
   // logged in, so destroy it
   // if its false, then its destroyed already, so it doesnt run destroy()
   // dont run destroy() twice
   const stop = () => up && (void (opts.stdout ?? console.log)("not up!") ?? void bot.destroy() ?? (up = false));
   sani.stop = stop;

   opts.events.forEach(event => process.on(event, stop));

   (opts.stdout ?? console.log)("up!");
   return sani;
}
