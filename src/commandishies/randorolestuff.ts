import { GuildMemberRoleManager, Message } from "discord.js";
import { Lang_en, stickitin } from "../lang";

export function getroles(msg: Message, roledata: Array<RoleData>): Array<RoleData> {
   const arrr: Array<RoleData> = [];
   for (let i = 0; i < roledata.length; i++) if (roledata[i].regex.test(msg.content)) arrr.push(roledata[i]);
   return arrr;
}

export async function applyroles(msg: Message, roledata: Array<RoleData>, serversupportid: string): Promise<ApplyRolesReturnValue> {
   if (!msg.member || (msg.channel.id !== serversupportid)) return {
      errored: true,
      content: stickitin(Lang_en.roleassign.tryagaininserversupport, serversupportid)
   };

   const given: Array<string> = [];
   const alreadyhave: Array<string> = [];
   let res: string = "";

   try {
      const rolemanager: GuildMemberRoleManager = msg.member.roles;

      for (let i = 0; i < roledata.length; i++) {
         if (!roledata[i].regex.test(msg.content)) continue;

         if (rolemanager.cache.has(roledata[i].id)) alreadyhave.push(roledata[i].name);
         else {
            await rolemanager.add(roledata[i].id);
            given.push(roledata[i].name);
         }
      }

      if (alreadyhave.length > 0) res = res + stickitin(Lang_en.roleassign.alreadyhaveroles, alreadyhave.sort().join(", "));
      if (given.length > 0) res = res + stickitin(Lang_en.roleassign.givenroles, given.sort().join(", "));
   } catch (e: unknown) {
      console.warn(e);
      res = res + Lang_en.roleassign.somethingwrongtryagain;
   }

   return {
      errored: false,
      content: res
   };
}

export async function getandapplyroles(msg: Message, roledata: Array<RoleData>, serversupportid: string): Promise<ApplyRolesReturnValue> {
   return await applyroles(msg, getroles(msg, roledata), serversupportid);
}

export interface RoleData {
   readonly name: string;
   readonly regex: RegExp;
   readonly id: string;
}

interface ApplyRolesReturnValue {
   errored: boolean;
   content: string;
}
