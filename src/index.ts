// error creation (ie new Error()) is expensive, apparently

import { createsani } from "./bot";
import { envisdev } from "./rando";
import { otherroleassign, yearassign, help } from "./commandish";

function getid(varname: string, errorgenerator?: (name: string) => string): string {
   varname = varname.toUpperCase();
   const envvar = process.env[varname];
   if (!envvar) throw `${varname} not available!${errorgenerator === undefined ? "" : ` ${errorgenerator(varname)}`}`;
   return envvar;
}

function getids() {
   const errgen = (name: string) => envisdev() ? `Set ${name} in your .env file` : `Set the environment variable ${name}`;
   const ids = {
      y2012:     getid("id_y2012",     errgen),
      y2013:     getid("id_y2013",     errgen),
      y2014:     getid("id_y2014",     errgen),
      y2015:     getid("id_y2015",     errgen),
      y2016:     getid("id_y2016",     errgen),
      y2017:     getid("id_y2017",     errgen),
      y2018:     getid("id_y2018",     errgen),
      y2019:     getid("id_y2019",     errgen),
      artist:    getid("id_artist",    errgen),
      musician:  getid("id_musician",  errgen),
      cosplayer: getid("id_cosplayer", errgen),
      meme:      getid("id_meme",      errgen),
      rp:        getid("id_rp",        errgen)
   };
   return ids;
}

void (async function() {
   if (envisdev()) (await import("dotenv")).config();
   if (!process.env.TOKEN) throw "NO TOKEN IN THE ENV LOL";

   const ids = getids();

   await createsani({
      token: process.env.TOKEN,
      stdout: console.log,
      stderr: console.error,
      events: ["exit", "SIGINT", "SIGTERM"],
      commandishes: [otherroleassign(ids), yearassign(ids), help]
   });
})().catch(console.error);
