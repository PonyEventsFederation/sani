// error creation (ie new Error()) is expensive, apparently

import { createsani } from "./bot";
import { envisdev } from "./rando";
import { otherroleassign, yearassign, help } from "./commandish";
import { createreactionrole } from "./reactionrole";
import { reactionroles, artistrole, musicianrole, cosplayerrole, memerole, rprole, newsrole, year2012, year2013, year2014, year2015, year2016, year2017, year2018, year2019 } from "./ids";
import { killswitch } from "./killswitch";
import { startServer } from "./loyaltyserver";

void (async function() {
   if (envisdev()) (await import("dotenv")).config();
   if (!process.env.TOKEN) throw "NO TOKEN IN THE ENV LOL";

   const events = ["exit", "SIGINT", "SIGTERM"];

   const sani = await createsani({
      token: process.env.TOKEN,
      stdout: console.log,
      stderr: console.error,
      events,
      commandishes: [otherroleassign({
         // TODO MAKE THIS BETTERERRER LUL
         artist: artistrole.roleid,
         musician: musicianrole.roleid,
         cosplayer: cosplayerrole.roleid,
         meme: memerole.roleid,
         rp: rprole.roleid,
         news: newsrole.roleid,
         y2012: year2012.roleid,
         y2013: year2013.roleid,
         y2014: year2014.roleid,
         y2015: year2015.roleid,
         y2016: year2016.roleid,
         y2017: year2017.roleid,
         y2018: year2018.roleid,
         y2019: year2019.roleid

      }), yearassign({
         // TODO ALSO MAKE THIS BETTERERRERIERRER LULULUL
         y2012: year2012.roleid,
         y2013: year2013.roleid,
         y2014: year2014.roleid,
         y2015: year2015.roleid,
         y2016: year2016.roleid,
         y2017: year2017.roleid,
         y2018: year2018.roleid,
         y2019: year2019.roleid
      }), help]
   });

   sani.bot.on("messageReactionAdd", await createreactionrole({
      bot: sani.bot,
      roles: reactionroles
   }));

   let port = process.env.PORT && !isNaN(Number(process.env.PORT)) ? Number(process.env.PORT) : 7079;
   const { stop: stopLoyaltyServer } = await startServer(port, sani);
   events.forEach(e => process.on(e, stopLoyaltyServer));
   // kill switch
   sani.bot.on("message", killswitch(sani, process.env.KILL_WHITELIST?.split(",") ?? ["379800645571575810"]));

   process.on("unhandledRejection", (r) => {
      console.error("UNHANDLED REJECTION");
      console.error(r);
   });
})().catch(console.error);
