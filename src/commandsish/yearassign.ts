import { Commandish } from "./commandish";
import { Collection, GuildMemberRoleManager, Message, MessageMentions } from "discord.js";
import { authorperson, serversupportchannel, yearroles, yeartest } from "../ids";
import { Lang_en, stickitin } from "../lang";

export class YearAssignCommandish extends Commandish {
   public shouldhandle(msg: Message): boolean {
      return msg.mentions.has(this.botusr) && msg.content.toLowerCase().includes("galacon");
   }

   public async handle(msg: Message): Promise<void> {
      if (msg.channel.id !== serversupportchannel) {
         let delet: boolean = false;
         if (msg.guild && msg.deletable) {
            delet = true;
            await msg.delete();
         }
         // const errmsg: Message = await msg.channel.send()
         const errmsg: Message = await msg.channel.send(stickitin(Lang_en.roleassign.tryagaininserversupport, serversupportchannel));
         if (delet) errmsg.delete({ timeout: 15000 });
         return;
      }

      const years: Array<string> = this.getyears(msg);
      if (years.length === 0) return void msg.channel.send(Lang_en.roleassign.novalidrolesfound);

      const yearroleids: Collection<string, string> = this.getyearidcollection(years);
      await this.applyroles(msg, yearroleids);
   }

   private getyears(msg: Message): Array<string> {
      let msgcontent: string = msg.content;
      msgcontent = msgcontent.replace(MessageMentions.CHANNELS_PATTERN, "");
      msgcontent = msgcontent.replace(MessageMentions.EVERYONE_PATTERN, "");
      msgcontent = msgcontent.replace(MessageMentions.ROLES_PATTERN, "");
      msgcontent = msgcontent.replace(MessageMentions.USERS_PATTERN, "");

      let matches: RegExpMatchArray | null = msgcontent.match(yeartest);
      // remove duplicates
      matches = Array.from<string>(new Set<string>(matches));

      return matches;
   }

   private getyearidcollection(years: Array<string>): Collection<string, string> {
      const yearids: Collection<string, string> = new Collection<string, string>();
      for (let i = 0; i < yearroles.length; i++) if (years.includes(yearroles[i].yearnum)) {
         yearids.set(yearroles[i].yearnum, yearroles[i].id);
      }
      return yearids;
   }

   private async applyroles(msg: Message, yearmap: Collection<string, string>): Promise<void> {
      if (!msg.member) return void msg.channel.send(stickitin(Lang_en.roleassign.horriblywrongauthorperson, authorperson));

      const given: Array<string> = [];
      const alreadyhave: Array<string> = [];
      let res: string = "";

      try {
         const yearsandids: Array<yearbits> = [];
         // push them all into an array first so i can use await in a for loop
         yearmap.each((id, year) => {
            yearsandids.push({
               year: year,
               id: id
            });
         });

         const rolemanager: GuildMemberRoleManager = msg.member.roles;
         for (let i = 0; i < yearsandids.length; i++) {
            if (rolemanager.cache.has(yearsandids[i].id)) alreadyhave.push(yearsandids[i].year);
            else {
               given.push(yearsandids[i].year);
               await rolemanager.add(yearsandids[i].id);
            }
         }

         if (alreadyhave.length > 0) res = res + stickitin(Lang_en.roleassign.alreadyhaveroles, alreadyhave.sort().join(", "));
         if (given.length > 0) res = res + stickitin(Lang_en.roleassign.givenroles, given.sort().join(", "));
      } catch (e) {
         console.warn(e);
         res = res + Lang_en.roleassign.somethingwrongtryagain;
      } finally {
         msg.channel.send(res.substring(1) || Lang_en.roleassign.somethingwrongtryagain).catch(console.warn);
      }
   }
}

interface yearbits {
   readonly year: string;
   readonly id: string;
}
