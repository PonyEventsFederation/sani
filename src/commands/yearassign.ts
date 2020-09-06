import { Command } from "./command";
import { ClientUser, Message, MessageMentions } from "discord.js";
import { authorperson, getroleid, serversupportchannel, NOT_FOUND_STRING, TESTBEGYEARS, TESTFORYEARS, TESTENDYEARS } from "./ids";
import { Lang_en, stickitin } from "../lang";

export class YearAssignCommand extends Command {
   public shouldhandle(msg: Message): boolean {
      const botusr: ClientUser | null = this.sani.getbot().user;
      if (botusr) return msg.mentions.has(botusr) && msg.content.toLowerCase().includes("galacon");
      return false;
   }

   public async handle(msg: Message): Promise<void> {
      if (msg.channel.id !== serversupportchannel) {
         let delet: boolean = false;
         if (msg.guild && msg.deletable) {
            delet = true;
            await msg.delete();
         }
         const errmsg: Message = await msg.channel.send(stickitin(Lang_en.yearAssign.tryAgainInServerSupport, serversupportchannel));
         if (delet) errmsg.delete({ timeout: 15000 });
         return;
      }

      const years: Array<string> = this.getyears(msg);
      if (years.length === 0) return void msg.channel.send(Lang_en.yearAssign.noValidYearsFound);

      const yearids: Array<string> = this.getyearroleids(years);

      this.applyroles(msg, years, yearids);
   }

   private getyears(msg: Message): Array<string> {
      // gets the years from a message
      let msgcontent: string = msg.content;
      msgcontent = msgcontent.replace(MessageMentions.CHANNELS_PATTERN, "");
      msgcontent = msgcontent.replace(MessageMentions.EVERYONE_PATTERN, "");
      msgcontent = msgcontent.replace(MessageMentions.ROLES_PATTERN, "");
      msgcontent = msgcontent.replace(MessageMentions.USERS_PATTERN, "");
      // this fixes dinky bug but is clonky lol
      msgcontent = msgcontent.replace(/\D/g, "  ");

      const beg: RegExpMatchArray | null = msgcontent.match(TESTBEGYEARS);
      const res: RegExpMatchArray | null = msgcontent.match(TESTFORYEARS);
      const end: RegExpMatchArray | null = msgcontent.match(TESTENDYEARS);
      let all: Array<string> = [];

      if (beg && beg[0]) all.push(beg[0].substring(0, 4));
      if (res) for (let i = 0; i < res.length; i++) {
         const twenty: number = res[i].indexOf("20");
         if (twenty !== 0 && twenty !== 1) {
            continue;
         }
         all.push(res[i].substring(twenty, twenty + 4));
      }
      if (end && end[0]) all.push(end[0].substring(end[0].length - 4, end[0].length));

      all = Array.from<string>(new Set<string>(all));
      return all;
   }

   private getyearroleids(years: Array<string>): Array<string> {
      // gets the role ids from array of years
      const yearids: Array<string> = [];
      for (let i = 0; i < years.length; i++) {
         const yearid = getroleid(years[i]);
         if (yearid !== NOT_FOUND_STRING) yearids.push(yearid);
      }
      return yearids;
   }

   private async applyroles(msg: Message, years: Array<string>, yearids: Array<string>): Promise<void> {
      if (years.length === 0) return void msg.channel.send(Lang_en.yearAssign.noValidYearsFound);
      if (!msg.member) return void msg.channel.send(stickitin(Lang_en.yearAssign.horriblyWrongAuthorPerson, authorperson));

      const given: Array<string> = [];
      const alreadyhave: Array<string> = [];
      let res: string = "";
      try {
         for (let i = 0; i < years.length; i++) {
            if (msg.member.roles.cache.has(yearids[i])) alreadyhave.push(years[i]);
            else {
               given.push(years[i]);
               msg.member.roles.add(yearids[i]);
            }
         }
      } catch (e) {
         console.warn(e);
         await msg.channel.send(stickitin(Lang_en.yearAssign.stuckOnRole, given[given.length - 1])).catch(console.warn);
         given.pop();
      }


      if (alreadyhave.length > 0) res = res + stickitin(Lang_en.yearAssign.alreadyHaveYears, alreadyhave.join(", "));
      if (given.length > 0) res = res + stickitin(Lang_en.yearAssign.givenYears, given.join(", "));

      if (res !== "") msg.channel.send(res.substring(1)).catch(console.warn);
      else msg.channel.send(Lang_en.yearAssign.somethingWrongTryAgain).catch(console.warn);
   }
}
