// error creation (ie new Error()) is expensive, apparently

import { createsani } from "./bot";
import { envisdev } from "./rando";
import { otherroleassign, yearassign, help } from "./commandish";

const errgen = (name: string) => `${name} not available! ` + (envisdev() ? `Set ${name} in your .env file` : `Set the environment variable ${name}`);
function getid(varname: string): string {
   varname = varname.toUpperCase();
   const envvar = process.env[varname];
   if (!envvar) throw errgen(varname);
   return envvar;
}

type IDTYPE = {
   y2012: string;
   y2013: string;
   y2014: string;
   y2015: string;
   y2016: string;
   y2017: string;
   y2018: string;
   y2019: string;
   artist: string;
   musician: string;
   cosplayer: string;
   meme: string;
   rp: string;
};

function getids(): IDTYPE {
   const ids = {
      y2012:     getid("id_y2012"),
      y2013:     getid("id_y2013"),
      y2014:     getid("id_y2014"),
      y2015:     getid("id_y2015"),
      y2016:     getid("id_y2016"),
      y2017:     getid("id_y2017"),
      y2018:     getid("id_y2018"),
      y2019:     getid("id_y2019"),
      artist:    getid("id_artist"),
      musician:  getid("id_musician"),
      cosplayer: getid("id_cosplayer"),
      meme:      getid("id_meme"),
      rp:        getid("id_rp")
   };
   return ids;
}

function getidsmethod2(): IDTYPE {
   const ids = process.env.SANI_IDS;
   const order = "2012,2013,2014,2015,2016,2017,2018,2019,artist,musician,cosplayer,meme,rp";
   if (!ids) throw `SANI_IDS not available! set SANI_IDS to a comma seperated list of ids, in this order: ${order}`;
   const arrayofids = ids.split(",");
   const trimmedids: Array<string> = [];
   arrayofids.forEach((val) => trimmedids.push(val.trim()));
   if (trimmedids.length !== order.split(",").length) throw "something went wrong, couldn't extract the right amount of ids...";
   return {
      y2012:     trimmedids[0],
      y2013:     trimmedids[1],
      y2014:     trimmedids[2],
      y2015:     trimmedids[3],
      y2016:     trimmedids[4],
      y2017:     trimmedids[5],
      y2018:     trimmedids[6],
      y2019:     trimmedids[7],
      artist:    trimmedids[8],
      musician:  trimmedids[9],
      cosplayer: trimmedids[10],
      meme:      trimmedids[11],
      rp:        trimmedids[12]
   };
}

void (async function() {
   if (envisdev()) (await import("dotenv")).config();
   if (!process.env.TOKEN) throw "NO TOKEN IN THE ENV LOL";

   let ids: IDTYPE;
   try {
      ids = getids();
   } catch (error1: unknown) {
      console.error("PROBLEM, FALLING BACK TO THE METHOD 2 OF EXTRACTING IDS");
      console.error("PLEASE DONT USE THIS");
      console.error("ITS HORRIBLE");
      console.error("WE CAN TOTALLY TELL WHAT THAT ALL MEANS WHEN YOU HAVE LIKE 13 NUMBERS ALL THE SAME LENGTH STRUNG TOGETHER LIKE THAT");
      console.error("DONT USE THIS LOL");
      try {
         ids = getidsmethod2();
      } catch (error2: unknown) {
         throw {
            message: "both methods of acquiring ids from environment variables failed, you can choose to fix one or the other",
            error1, error2
         };
      }
   }

   await createsani({
      token: process.env.TOKEN,
      stdout: console.log,
      stderr: console.error,
      events: ["exit", "SIGINT", "SIGTERM"],
      commandishes: [otherroleassign(ids), yearassign(ids), help]
   });
})().catch(console.error);
