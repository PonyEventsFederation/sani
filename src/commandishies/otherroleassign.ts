import { Message } from "discord.js";
import { Commandish } from "./commandish";
import { getandapplyroles, RoleData } from "./randorolestuff";
import { artist, cosplayer, meme, musician, rp, serversupportchannel, mlemEmoji } from "../ids";
import { Lang_en, stickitin } from "../lang";

/**
 * Responsible for assigning other roles (musician, artist, cosplayer, meme, roleplay)
 * of the [GalaCon Discord server](https://discord.gg/galacon).
 * These roles mark things that you do or allow you access to certain areas of
 * the server (in the case of the roleplay role).
 */
export class OtherRoleAssignCommandish extends Commandish {
   public shouldhandle(msg: Message): boolean {
      return msg.mentions.has(this.botusr) && roletest.test(msg.content);
   }

   public async handle(msg: Message): Promise<void> {
      const response = await getandapplyroles(msg, otherroles, serversupportchannel);
      if (response.delete) {
         if (msg.guild && msg.deletable) {
            msg.delete();

            (await msg.channel.send(stickitin(Lang_en.roleassign.hi, msg.author.id) + stickitin(Lang_en.roleassign.tryagaininserversupport, [msg.author.id, serversupportchannel, mlemEmoji]))).delete({ timeout: 15000 });
         } else msg.channel.send(stickitin(Lang_en.roleassign.hi, msg.author.id) + stickitin(Lang_en.roleassign.tryagaininserversupport, [msg.author.id, serversupportchannel, mlemEmoji]));
      } else msg.channel.send(stickitin(Lang_en.roleassign.hi, msg.author.id) + response.content || stickitin(Lang_en.roleassign.novalidrolesfound, [msg.author.id]));
   }
}

// regex stuff for testing things
/** tests to see if someone indicated that they want artist role */
export const artisttest: RegExp = /\b(art(s|ist)?)\b/im;
/** tests to see if someone indicated that they want artist role */
export const musiciantest: RegExp = /\b(music(ians?)?)\b/im;
/** tests to see if someone indicated that they want musician role */
export const cosplayertest: RegExp = /\b(cosplay(ers?)?)\b/im;
/** tests to see if someone indicated that they want meme role */
export const memetest: RegExp = /\b((me){2,}(ist)?s?)\b/im;
/** tests to see if someone indicated that they want roleplay role */
export const rptest: RegExp = /\b(rp|roleplay(er)?s?)\b/im;
/** tests to see if someone indicated that the message contains other role requests */
export const roletest: RegExp = /\broles?\b/im;

/** array of all the other roles, for iterating through */
export const otherroles: Array<RoleData> = [
   { name: "artist", regex: artisttest, id: artist },
   { name: "musician", regex: musiciantest, id: musician },
   { name: "cosplayer", regex: cosplayertest, id: cosplayer },
   { name: "meme", regex: memetest, id: meme, specialmessage: Lang_en.roleassign.memewarning },
   { name: "rp", regex: rptest, id: rp }
];
