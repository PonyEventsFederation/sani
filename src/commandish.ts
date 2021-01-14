import { Message } from "discord.js";
import { Sani } from "./bot";
import { Logger } from "./bot";
import { getandapplyroles, RoleData } from "./randorolestuff";
import {
   serversupportchannel,
   y2012, y2013, y2014, y2015,
   y2016, y2017, y2018, y2019,
   artist, cosplayer, meme, musician, rp,
   mlememoji, authorperson
} from "./ids";
import { langen, placeholder, stickitin } from "./lang";
import { wait } from "./rando";

type CommandishOpts = {
   sani: Sani;
   stdout: Logger;
   stderr: Logger;
};

export type Commandish = (opts: CommandishOpts) => (msg: Message) => Promise<void> | Promise<false>;

/**
 * returns true if:
 *
 * - there is no bot user in opts.sani.bot.user
 * - bot isn't mentioned or regex test on the msg content doesn't return true
 *
 * use for commandishes. parameters are the commandish's opts and context and stuff,
 * can just pass them in
 */
const needreturn = (opts: CommandishOpts, msg: Message, test: RegExp): boolean =>
   !opts.sani.bot.user || !(msg.mentions.has(opts.sani.bot.user) && test.test(msg.content));

/** tests for help (or halp) */
const helptest: RegExp = /\bh(e|a)lp\b/im;

/**
 * The help message. The placeholders should be replaced with (in order) message author username (`msg.member?.nickname || msg.author.username`),
 * sani user id, sani user id, and author user id ({@link authorperson}).
 */
const helpmessage: string = `
Hi ${placeholder}! Seems like you need some help. Here are some things I can do for you.

**"<@${placeholder}> I want musician and 2019 role please"** can get you some roles. It doesn't matter what you put, as long as the word "role" or "roles" is present in your message, I will know you want roles. I have artist, musician, cosplayer, meme, and roleplayer available, as well as the years 2012-2019.

**"<@${placeholder}> I was at galacon in 2014 and 2015"** can get you year roles. It doesn't matter what you put, as long as the word "galacon" is present in your message, I will know you want year roles. I have the years 2012-2019 available.

Thats all I do right now. If you need help, you can always ask <@${placeholder}> about it, she knows the most about me.
`;

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

export const help: Commandish = opts => async msg => {
   if (!opts.sani.bot.user) return;
   if (!(msg.mentions.has(opts.sani.bot.user) && helptest.test(msg.content))) return;

   await msg.author.send(stickitin(helpmessage,
      msg.member?.nickname ?? msg.author.username,
      opts.sani.bot.user.id,
      opts.sani.bot.user.id,
      authorperson
   ));

   if (msg.deletable) await msg.delete();
   else if (msg.channel.type !== "dm") {
      // void (await msg.react("\u2705")).users.remove();
      //                                ✅
      const reaction = await msg.react("\u2705");
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      await wait(15000);
      await reaction.users.remove();
   }
};


const roleassign: (roleassignopts: {
   test: RegExp;
   roles: Array<RoleData>;
   serversupportchannel: string;
   hi: string;
   novalidrolesfound: string;
   tryagaininserversupport: string;
   mlememoji: string;
}) => Commandish = roleassignopts => opts => async msg => {
   if (needreturn(opts, msg, roleassignopts.test)) return;

   const response = await getandapplyroles(msg, roleassignopts.roles, roleassignopts.serversupportchannel);

   if (!response.delete) return void msg.channel.send(stickitin(roleassignopts.hi, msg.author.id) + (response.content || stickitin(roleassignopts.novalidrolesfound, msg.author.id))).catch(opts.stderr);
   if (!(msg.guild && msg.deletable)) return void msg.channel.send(stickitin(roleassignopts.hi, msg.author.id) + stickitin(roleassignopts.tryagaininserversupport, msg.author.id, roleassignopts.serversupportchannel, mlememoji)).catch(opts.stderr);

   void msg.delete();
   (await msg.channel.send(stickitin(roleassignopts.tryagaininserversupport, msg.author.id, roleassignopts.serversupportchannel, roleassignopts.mlememoji))).delete({ timeout: 15000 }).catch(opts.stderr);
};

export const otherroleassign: Commandish = roleassign({
   test: roletest,
   roles: otherroles,
   serversupportchannel,
   hi: langen.roleassign.hi,
   novalidrolesfound: langen.roleassign.novalidrolesfound,
   tryagaininserversupport: langen.roleassign.tryagaininserversupport,
   mlememoji
});

export const yearassign: Commandish = roleassign({
   test: yeartest,
   roles: yearroles,
   serversupportchannel,
   hi: langen.roleassign.hi,
   novalidrolesfound: langen.roleassign.novalidyearsfound,
   tryagaininserversupport: langen.roleassign.tryagaininserversupport,
   mlememoji
});
