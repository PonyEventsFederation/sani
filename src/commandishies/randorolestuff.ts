import { GuildMemberRoleManager, Message } from "discord.js";
import { Lang_en, stickitin } from "../lang";

export function getroledatafrommsg(msg: Message, allroledata: Array<RoleData>): Array<RoleData> {
   const arrr: Array<RoleData> = [];
   for (let i = 0; i < allroledata.length; i++) if (allroledata[i].regex.test(msg.content)) arrr.push(allroledata[i]);
   return arrr;
}

export async function applyroles(msg: Message, selectedroledata: Array<RoleData>, serversupportid: string): Promise<ModifyRolesReturnValue> {
   if (!msg.member || (msg.channel.id !== serversupportid)) return {
      errored: true,
      content: stickitin(Lang_en.roleassign.tryagaininserversupport, serversupportid)
   };

   const given: Array<string> = [];
   const alreadyhave: Array<string> = [];
   let res: string = "";

   try {
      const rolemanager: GuildMemberRoleManager = msg.member.roles;

      for (let i = 0; i < selectedroledata.length; i++) {
         if (!selectedroledata[i].regex.test(msg.content)) continue;

         if (rolemanager.cache.has(selectedroledata[i].id)) alreadyhave.push(selectedroledata[i].name);
         else {
            await rolemanager.add(selectedroledata[i].id);
            given.push(selectedroledata[i].name);
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

export async function removeroles(msg: Message, selectedroledata: Array<RoleData>, serversupportid: string): Promise<ModifyRolesReturnValue> {
   if (!msg.member || (msg.channel.id !== serversupportid)) return {
      errored: true,
      content: stickitin(Lang_en.roleassign.tryagaininserversupport, serversupportid)
   };

   const removed: Array<string> = [];
   const alreadydonthave: Array<string> = [];
   let res: string = "";

   try {
      const rolemanager: GuildMemberRoleManager = msg.member.roles;

      for (let i = 0; i < selectedroledata.length; i++) {
         if (!selectedroledata[i].regex.test(msg.content)) continue;

         if (rolemanager.cache.has(selectedroledata[i].id)) {
            await rolemanager.remove(selectedroledata[i].id);
            removed.push(selectedroledata[i].name);
         } else alreadydonthave.push(selectedroledata[i].name);
      }

      if (alreadydonthave.length > 0) res = res + stickitin(Lang_en.roleassign.alreadyhaveroles, alreadydonthave.sort().join(", "));
      if (removed.length > 0) res = res + stickitin(Lang_en.roleassign.givenroles, removed.sort().join(", "));
   } catch (e: unknown) {
      console.warn(e);
      res = res + Lang_en.roleassign.somethingwrongtryagain;
   }

   return {
      errored: false,
      content: res
   };
}

export async function getandapplyroles(msg: Message, allroledata: Array<RoleData>, serversupportid: string): Promise<ModifyRolesReturnValue> {
   return await applyroles(msg, getroledatafrommsg(msg, allroledata), serversupportid);
}

export async function getandremoveroles(msg: Message, allroledata: Array<RoleData>, serversupportid: string): Promise<ModifyRolesReturnValue> {
   return await removeroles(msg, getroledatafrommsg(msg, allroledata), serversupportid);
}

export interface RoleData {
   readonly name: string;
   readonly regex: RegExp;
   readonly id: string;
}

interface ModifyRolesReturnValue {
   errored: boolean;
   content: string;
}
