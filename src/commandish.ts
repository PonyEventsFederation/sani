import { Message } from "discord.js";
import { Sani } from "./bot";
import { Logger } from "./bot";
import { getandapplyroles, ModifyRolesReturnValue, RoleData } from "./randorolestuff";
import { serversupportchannel, y2012, y2013, y2014, y2015, y2016, y2017, y2018, y2019, artist, cosplayer, meme, musician, rp, mlememoji } from "./ids";
import { langen, stickitin } from "./lang";

export type Commandish = (opts: {
   sani: Sani;
   stdout: Logger;
   stderr: Logger;
}) => (msg: Message) => Promise<void> | Promise<false>;

const yeartest: RegExp = /\bgalacon\b/im;
const yeartest2012: RegExp = /\b2012\b/im;
const yeartest2013: RegExp = /\b2013\b/im;
const yeartest2014: RegExp = /\b2014\b/im;
const yeartest2015: RegExp = /\b2015\b/im;
const yeartest2016: RegExp = /\b2016\b/im;
const yeartest2017: RegExp = /\b2017\b/im;
const yeartest2018: RegExp = /\b2018\b/im;
const yeartest2019: RegExp = /\b2019\b/im;

const yearroles: Array<RoleData> = [
   { name: "2012", regex: yeartest2012, id: y2012 },
   { name: "2013", regex: yeartest2013, id: y2013 },
   { name: "2014", regex: yeartest2014, id: y2014 },
   { name: "2015", regex: yeartest2015, id: y2015 },
   { name: "2016", regex: yeartest2016, id: y2016 },
   { name: "2017", regex: yeartest2017, id: y2017 },
   { name: "2018", regex: yeartest2018, id: y2018 },
   { name: "2019", regex: yeartest2019, id: y2019 }
];

export const yearassign: Commandish = (opts) => async msg => {
   if (!opts.sani.bot.user) return;
   if (!(msg.mentions.has(opts.sani.bot.user) && yeartest.test(msg.content))) return;
   const response: ModifyRolesReturnValue = await getandapplyroles(msg, yearroles, serversupportchannel);
   if (response.delete) {
      if (msg.guild && msg.deletable) {
         void msg.delete();
         (await msg.channel.send(stickitin(langen.roleassign.hi, msg.author.id) + stickitin(langen.roleassign.tryagaininserversupport, [msg.author.id, serversupportchannel, mlememoji]))).delete({ timeout: 15000 }).catch(opts.stderr);
      } else msg.channel.send(stickitin(langen.roleassign.hi, msg.author.id) + stickitin(langen.roleassign.tryagaininserversupport, [msg.author.id, serversupportchannel, mlememoji])).catch(opts.stderr);
   } else msg.channel.send(stickitin(langen.roleassign.hi, msg.author.id) + (response.content || stickitin(langen.roleassign.novalidyearsfound, [msg.author.id]))).catch(opts.stderr);
};

/** tests to see if someone indicated that they want artist role */
const artisttest: RegExp = /\b(art(s|ist)?)\b/im;
/** tests to see if someone indicated that they want artist role */
const musiciantest: RegExp = /\b(music(ians?)?)\b/im;
/** tests to see if someone indicated that they want musician role */
const cosplayertest: RegExp = /\b(cosplay(ers?)?)\b/im;
/** tests to see if someone indicated that they want meme role */
const memetest: RegExp = /\b((me){2,}(ist)?s?)\b/im;
/** tests to see if someone indicated that they want roleplay role */
const rptest: RegExp = /\b(rp|roleplay(er)?s?)\b/im;
/** tests to see if someone indicated that the message contains other role requests */
const roletest: RegExp = /\broles?\b/im;

/** array of all the other roles, for iterating through */
const otherroles: Array<RoleData> = [
   { name: "artist", regex: artisttest, id: artist },
   { name: "musician", regex: musiciantest, id: musician },
   { name: "cosplayer", regex: cosplayertest, id: cosplayer },
   { name: "meme", regex: memetest, id: meme, specialmessage: langen.roleassign.memewarning },
   { name: "rp", regex: rptest, id: rp }
];

export const otherroleassign: Commandish = opts => async msg => {
   if (!opts.sani.bot.user) return;
   if (!(msg.mentions.has(opts.sani.bot.user) && roletest.test(msg.content))) return;

   const response: ModifyRolesReturnValue = await getandapplyroles(msg, otherroles, serversupportchannel);
   if (response.delete) {
      if (msg.guild && msg.deletable) {
         void msg.delete();
         (await msg.channel.send(stickitin(langen.roleassign.tryagaininserversupport, [msg.author.id, serversupportchannel, mlememoji]))).delete({ timeout: 15000 }).catch(opts.stderr);
      } else msg.channel.send(stickitin(langen.roleassign.hi, msg.author.id) + stickitin(langen.roleassign.tryagaininserversupport, [msg.author.id, serversupportchannel, mlememoji])).catch(opts.stderr);
   } else msg.channel.send(stickitin(langen.roleassign.hi, msg.author.id) + (response.content || stickitin(langen.roleassign.novalidrolesfound, [msg.author.id]))).catch(opts.stderr);
};
