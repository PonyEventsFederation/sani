import { Collection, GuildMemberRoleManager, Message } from "discord.js";
import { authorperson, otherroles, roletest, serversupportchannel, yearroles } from "../ids";
import { Lang_en, stickitin } from "../lang";
import { Commandish } from "./commandish";

export class OtherRoleAssign extends Commandish {
   public shouldhandle(msg: Message): boolean {
      return msg.mentions.has(this.botusr) && roletest.test(msg.content);
   }

   public async handle(msg: Message): Promise<void> {
      if (msg.channel.id !== serversupportchannel) {
         let delet: boolean = false;
         if (msg.guild && msg.deletable) {
            delet = true;
            await msg.delete();
         }
         const errmsg: Message = await msg.channel.send(stickitin(Lang_en.roleassign.tryagaininserversupport, serversupportchannel));
         if (delet) errmsg.delete({ timeout: 15000 });
         return;
      }

      const roles: Collection<string, string> = this.getroleidcollection(msg);
      if (Object.keys(roles).length === 0) return void msg.channel.send(Lang_en.roleassign.novalidrolesfound);
      await this.applyroles(msg, roles);
   }

   private getroleidcollection(msg: Message): Collection<string, string> {
      const roles: Collection<string, string> = new Collection<string, string>();
      otherroles.forEach(yearrole => {
         if (yearrole.regex.test(msg.content)) roles.set(yearrole.name, yearrole.id);
      });

      return roles;
   }

   private async applyroles(msg: Message, roles: Collection<string, string>) {
      if (!msg.member) return void msg.channel.send(stickitin(Lang_en.roleassign.horriblywrongauthorperson, authorperson));

      const given: Array<string> = [];
      const alreadyhave: Array<string> = [];
      let res: string = "";

      try {
         const yearsandids: Array<roleobjectthing> = [];
         // push them all into an array first so i can use await in a for loop
         roles.each((id, rolename) => {
            yearsandids.push({
               rolename: rolename,
               id: id
            });
         });

         const rolemanager: GuildMemberRoleManager = msg.member.roles;
         for (let i = 0; i < yearsandids.length; i++) {
            if (rolemanager.cache.has(yearsandids[i].id)) alreadyhave.push(yearsandids[i].rolename);
            else {
               given.push(yearsandids[i].rolename);
               await rolemanager.add(yearsandids[i].id);
            }
         }

         console.log(alreadyhave);
         console.log(given);
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

interface roleobjectthing {
   readonly rolename: string;
   readonly id: string;
}
