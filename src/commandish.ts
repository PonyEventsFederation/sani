import { Message } from "discord.js";
import { Sani } from "./bot";
import { Logger } from "./bot";
import { getandapplyroles, RoleData } from "./randorolestuff";
import {
   serversupportchannel,
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


/**
 * The help message. The placeholders should be replaced with (in order) message author username (`msg.member?.nickname || msg.author.username`),
 * sani user id, sani user id, and author user id ({@link authorperson}).
 */
const helpmessage: string = `
Hi ${placeholder}! Seems like you need some help. Here are some things I can do for you.

**"<@${placeholder}> I want musician and 2019 role please"** can get you some roles. It doesn't matter what you put, as long as the word "role" or "roles" is present in your message, I will know you want roles. I have artist, musician, cosplayer, meme, roleplayer, and news available, as well as the years 2012-2019.

**"<@${placeholder}> I was at galacon in 2014 and 2015"** can get you year roles. It doesn't matter what you put, as long as the word "galacon" is present in your message, I will know you want year roles. I have the years 2012-2019 available.

Thats all I do right now. If you need help, you can always ask <@${placeholder}> about it, she knows the most about me.
`;

export const help: Commandish = opts => async msg => {
   if (!opts.sani.bot.user) return;
   if (!(msg.mentions.has(opts.sani.bot.user) && /\bh(e|a)lp\b/im.test(msg.content))) return;

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

export const otherroleassign = (ids: {
   artist: string;
   musician: string;
   cosplayer: string;
   meme: string;
   rp: string;
   news: string;
}) => roleassign({
   test: /\broles?\b/im,
   roles: [
      { name: "artist", regex: /\b(art(s|ists?)?)\b/im, id: ids.artist },
      { name: "musician", regex: /\b(music(ians?)?)\b/im, id: ids.musician },
      { name: "cosplayer", regex: /\b(cosplay(ers?)?)\b/im, id: ids.cosplayer },
      { name: "meme", regex: /\b((me){2,}(ist)?s?)\b/im, id: ids.meme, specialmessage: langen.roleassign.memewarning },
      { name: "rp", regex: /\b(rp|roleplay(er)?s?)\b/im, id: ids.rp },
      { name: "news", regex: /\bnews\b/im, id: ids.news }
   ],
   serversupportchannel,
   hi: langen.roleassign.hi,
   novalidrolesfound: langen.roleassign.novalidrolesfound,
   tryagaininserversupport: langen.roleassign.tryagaininserversupport,
   mlememoji
});

export const yearassign = (ids: {
   y2012: string; y2013: string; y2014: string; y2015: string;
   y2016: string; y2017: string; y2018: string; y2019: string;
}) => roleassign({
   test: /\bgalacon\b/im,
   roles: [
      { name: "2012", regex: /\b2012\b/im, id: ids.y2012 },
      { name: "2013", regex: /\b2013\b/im, id: ids.y2013 },
      { name: "2014", regex: /\b2014\b/im, id: ids.y2014 },
      { name: "2015", regex: /\b2015\b/im, id: ids.y2015 },
      { name: "2016", regex: /\b2016\b/im, id: ids.y2016 },
      { name: "2017", regex: /\b2017\b/im, id: ids.y2017 },
      { name: "2018", regex: /\b2018\b/im, id: ids.y2018 },
      { name: "2019", regex: /\b2019\b/im, id: ids.y2019 }
   ],
   serversupportchannel,
   hi: langen.roleassign.hi,
   novalidrolesfound: langen.roleassign.novalidyearsfound,
   tryagaininserversupport: langen.roleassign.tryagaininserversupport,
   mlememoji
});
