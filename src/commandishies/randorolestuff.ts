import { GuildMemberRoleManager, Message } from "discord.js";
import { Lang_en, stickitin } from "../lang";
import { mlemEmoji } from "../ids";

/**
 * takes a message and an array of {@link RoleData} and checks to see if the message
 * content indicates a request for the roles present in the array of {@link RoleData}.
 * I hope this makes sense lol
 *
 * @param msg message to get role data from
 * @param allroledata array of all roles to check
 * @returns an array of {@link RoleData} containing the roles that the message author wants
 */
export function getroledatafrommsg(msg: Message, allroledata: Array<RoleData>): Array<RoleData> {
   const arrr: Array<RoleData> = [];
   for (let i = 0; i < allroledata.length; i++) if (allroledata[i].regex.test(msg.content)) arrr.push(allroledata[i]);
   return arrr;
}

/**
 * applys roles specified by an array of {@link RoleData} to a message author
 *
 * @param msg apply roles to this message's author
 * @param selectedroledata array of {@link roledata} to apply to user
 * @param serversupportid #server-support id to send them there if they do the requesting
 *                        anywhere else
 * @returns a string of response, with an indication of whether or not to delete
 *          the original message and the response message
 */
export async function applyroles(msg: Message, selectedroledata: Array<RoleData>, serversupportid: string): Promise<ModifyRolesReturnValue> {
   if (!msg.member || (msg.channel.id !== serversupportid)) return {
      delete: true,
      content: stickitin(Lang_en.roleassign.tryagaininserversupport, [msg.author.id, serversupportid, mlemEmoji])
   };

   msg.channel.startTyping();
   const given: Array<string> = [];
   const alreadyhave: Array<string> = [];
   let res: string = "";

   try {
      const rolemanager: GuildMemberRoleManager = msg.member.roles;

      for (let i = 0; i < selectedroledata.length; i++) {
         if (!selectedroledata[i].regex.test(msg.content)) continue;

         if (rolemanager.cache.has(selectedroledata[i].id)) alreadyhave.push(selectedroledata[i].name);
         else {
            if (selectedroledata[i].specialmessage) await msg.channel.send(selectedroledata[i].specialmessage);
            await rolemanager.add(selectedroledata[i].id);
            given.push(selectedroledata[i].name);
         }
      }

      if (alreadyhave.length == 1) {
         res = res + stickitin(Lang_en.roleassign.alreadyhaveroles, [msg.author.id, alreadyhave.sort().join(", ")]);
      }

      if (alreadyhave.length > 1) {
         res = res + parseMultipleRolesReply(Lang_en.roleassign.alreadyhaverolesmultiple, alreadyhave, msg.author.id);
      }

      if (given.length == 1) {
         res = res + stickitin(Lang_en.roleassign.givenroles, [msg.author.id, given.sort().join(", ")]);
      }

      if (given.length > 1) {
         res = res + parseMultipleRolesReply(Lang_en.roleassign.givenrolesmultiple, given, msg.author.id);
      }

   } catch (e: unknown) {
      console.warn(e);
      res = res + stickitin(Lang_en.roleassign.somethingwrongtryagain, msg.author.id);
   }
   msg.channel.stopTyping();
   return {
      delete: false,
      content: res
   };
}

/**
 * removes roles specified by an array of {@link RoleData} from a message author
 *
 * @param msg remove roles from this message's author
 * @param selectedroledata array of roledata to remove
 * @param serversupportid #server-support id to send them there if they do
 * the requesting anywhere else
 * @returns a string of response, with an indication of whether or not to delete
 *          the original message and the response message
 */
export async function removeroles(msg: Message, selectedroledata: Array<RoleData>, serversupportid: string): Promise<ModifyRolesReturnValue> {
   if (!msg.member || (msg.channel.id !== serversupportid)) return {
      delete: true,
      content: stickitin(Lang_en.roleassign.tryagaininserversupport, [msg.author.id, serversupportid])
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
      delete: false,
      content: res
   };
}

/**
 * gets {@link RoleData} from a message, tests them, and applys them to the message's author
 *
 * see {@link getroledatafrommsg} and {@link applyroles}
 *
 * @param msg message to get roledata from
 * @param allroledata all roles to look for and maybe apply
 * @param serversupportid #server-support id to send them there if they do
 * the requesting anywhere else
 * @returns a string of response, with an indication of whether or not to delete
 *          the original message and the response message
 */
export async function getandapplyroles(msg: Message, allroledata: Array<RoleData>, serversupportid: string): Promise<ModifyRolesReturnValue> {
   return await applyroles(msg, getroledatafrommsg(msg, allroledata), serversupportid);
}

/**
 * gets {@link RoleData} from a message, tests them, and removes them from the message's author
 *
 * see {@link getroledatafrommsg} and {@link removeroles}
 *
 * @param msg message to operate on
 * @param allroledata all roles to look for and maybe remove
 * @param serversupportid #server-support id to send them there if they do
 * the requesting anywhere else
 * @returns a string of response, with an indication of whether or not to delete
 *          the original message and the response message
 */
export async function getandremoveroles(msg: Message, allroledata: Array<RoleData>, serversupportid: string): Promise<ModifyRolesReturnValue> {
   return await removeroles(msg, getroledatafrommsg(msg, allroledata), serversupportid);
}

/**
 * Placeholder function to parse a string for the multiple role reply.
 *
 * @param placeholder the placeholder string we'll be using
 * @param roleData all of the role data that was requested by the user
 * @param target the target of the message
 */
export function parseMultipleRolesReply(placeholder: string, roleData: Array<string>, target: string): string {
   const final_role = roleData[roleData.length - 1];
   roleData.pop();
   const roles = roleData.sort().join(", ");

   return stickitin(placeholder, [target, roles, final_role]);
}

/**
 * Data for a Discord role, including a user-friendly name, regex to test for the
 * presence of a request in a message, and an id so it can be applied or removed
 * from a user.
 */
export interface RoleData {
   /** user-friendly name of the role, can be different from the actual role name */
   readonly name: string;
   /** regex to test for the presence of the role request inside a message */
   readonly regex: RegExp;
   /** discord id (snowflake) of the role */
   readonly id: string;
   /** special message to send when someone requests this role */
   readonly specialmessage?: string;
}

interface ModifyRolesReturnValue {
   /** whether or not to delete the original message and the result message */
   delete: boolean;
   /** content of the result (the actual result) */
   content: string;
}
