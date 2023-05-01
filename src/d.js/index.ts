// error creation (ie new Error()) is expensive, apparently

import { createsani } from "./bot";
import { envisdev } from "./rando";
import { createreactionrole } from "./reactionrole";
import {
   artistrole,
   musicianrole,
   cosplayerrole,
   memerole,
   rprole,
   nobottagsrole,
   movienightrole,
   newsrole,
   gala_year2012,
   gala_year2013,
   gala_year2014,
   gala_year2015,
   gala_year2016,
   gala_year2017,
   gala_year2018,
   gala_year2019,
   gala_year2022
} from "./ids";
import { killswitch } from "./killswitch";
import { startServer } from "./loyaltyserver";

void (async function() {
   if (envisdev()) (await import("dotenv")).config();
   if (!process.env["TOKEN"]) throw "NO TOKEN IN THE ENV LOL";

   const events = ["exit", "SIGINT", "SIGTERM"];

   const sani = await createsani({
      token: process.env["TOKEN"],
      stdout: console.log,
      stderr: console.error,
      events
   });

   sani.bot.on("messageReactionAdd", await createreactionrole({
      bot: sani.bot,
      roles: [
         artistrole,
         musicianrole,
         cosplayerrole,
         memerole,
         rprole,
         nobottagsrole,
         movienightrole,
         newsrole,
         gala_year2012,
         gala_year2013,
         gala_year2014,
         gala_year2015,
         gala_year2016,
         gala_year2017,
         gala_year2018,
         gala_year2019,
         gala_year2022
      ]
   }));

   let port = process.env["PORT"] && !isNaN(Number(process.env["PORT"])) ? Number(process.env["PORT"]) : 7079;
   const { stop: stopLoyaltyServer } = await startServer(port, sani);
   events.forEach(e => process.on(e, stopLoyaltyServer));
   // kill switch
   sani.bot.on("message", killswitch(sani, process.env["KILL_WHITELIST"]?.split(",") ?? ["379800645571575810"]));

   process.on("unhandledRejection", (r) => {
      console.error("UNHANDLED REJECTION");
      console.error(r);
   });
})().catch(console.error);
