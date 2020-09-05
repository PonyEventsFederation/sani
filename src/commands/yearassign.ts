import { Command } from "./command";
import { ClientUser, Message, MessageMentions } from "discord.js";
import { authorperson, getroleid, serversupportchannel, NOT_FOUND_STRING } from "./ids";


export class YearAssignCommand extends Command {
   private static readonly testbegyears: RegExp = /^20(12|13|14|15|16|17|18|19|20)[^0-9]/
   private static readonly testforyears: RegExp = /[^0-9]20(12|13|14|15|16|17|18|19|20)[^0-9]/g;
   private static readonly testendyears: RegExp = /[^0-9]20(12|13|14|15|16|17|18|19|20)$/g;

   public shouldhandle(msg: Message): boolean {
      const botusr: ClientUser | null = this.sani.getbot().user;
      if (botusr) return msg.mentions.has(botusr) && msg.content.toLowerCase().includes("galacon");
      return false;
   }

   public handle(msg: Message): void {
      const years: Array<string> = this.getyears(msg);
      if (years.length === 0) return void msg.channel.send("sorry! I couldn't find any valid years.");

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

      const beg: RegExpMatchArray | null = msgcontent.match(YearAssignCommand.testbegyears);
      const res: RegExpMatchArray | null = msgcontent.match(YearAssignCommand.testforyears);
      const end: RegExpMatchArray | null = msgcontent.match(YearAssignCommand.testendyears);
      let all: Array<string> = [];

      if (beg && beg[0]) all.push(beg[0].substring(0, 4));
      if (res) for (let i = 0; i < res.length; i++) {
         const twenty: number = res[i].indexOf("20");
         if (twenty !== 0 && twenty !== 1) {
            console.log(twenty);
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
      /*
      const given: Array<string> = [];
      try {
         for (let i = 0; i < yearids.length; i++) {
            if (yearids[i] === NOT_FOUND_STRING) continue;
            given.push(years[i]);
            msg.member.roles.set(yearids);
         }
         msg.channel.send(`Gave you the years ${years.join(", ")}~`);
      } catch(e) {
         console.warn(e);
         msg.channel.send(`I got stuck on ${given[given.length - 1]}`);
      }
      */

      if (years.length === 0) return void msg.channel.send("sorry! I couldn't find any valid years.");
      if (msg.channel.type !== "text") return void msg.channel.send(`hi! can you try again in <#${serversupportchannel}>? thank you! ^^`);
      if (!msg.member) return void msg.channel.send(`hello! sorry, something went horribly wrong. can you send a message to <@${authorperson}>? thank you! ^^`);

      const given: Array<string> = [];
      const alreadyhave: Array<string> = [];
      try {
         for (let i = 0; i < years.length; i++) {
            console.log(years[i]);
            if (msg.member.roles.cache.has(yearids[i])) alreadyhave.push(years[i]);
            else {
               given.push(years[i]);
               msg.member.roles.add(yearids[i]);
            }
         }

         let res: string = "";
         if (alreadyhave.length > 0) res = res + `\nYou already have ${alreadyhave.join(", ")}`;
         if (given.length > 0) res = res + `\nGave you ${given.join(", ")}`;

         if (res !== "") msg.channel.send(res.substring(1));
         else msg.channel.send("sorry, something went wrong. Can you try again?");
      } catch (e) {
         console.warn(e);
         await msg.channel.send(`sorry! I got stuck on ${given[given.length - 1]}`).catch(console.warn);
         given.pop();
         if (given.length !== 0) await msg.channel.send(`I finished giving you the roles ${given.join(", ")}`).catch(console.warn);
      }
   }
}
