import { createsani } from "./bot";
import { envisdev } from "./rando";
import { otherroleassign, yearassign, help } from "./commandish";

void (async function() {
   if (envisdev()) (await import("dotenv")).config();
   if (!process.env.TOKEN) throw new Error("NO TOKEN IN THE ENV LOL");

   await createsani({
      token: process.env.TOKEN,
      stdout: console.log,
      stderr: console.error,
      events: ["exit", "SIGINT", "SIGTERM"],
      commandishes: [otherroleassign, yearassign, help]
   });
})();
