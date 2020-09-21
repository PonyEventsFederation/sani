import { Message } from "discord.js";
import { Commandish } from "./commandish";
import { getandapplyroles, RoleData } from "./randorolestuff";
import { artist, cosplayer, meme, musician, rp, serversupportchannel } from "../ids";
import { Lang_en, stickitin } from "../lang";

export class OtherRoleAssignCommandish extends Commandish {
   public shouldhandle(msg: Message): boolean {
      return msg.mentions.has(this.botusr) && roletest.test(msg.content);
   }

   public async handle(msg: Message): Promise<void> {
      const response = await getandapplyroles(msg, otherroles, serversupportchannel);
      if (response.errored) {
         if (msg.guild && msg.deletable) {
            msg.delete();
            (await msg.channel.send(stickitin(Lang_en.roleassign.tryagaininserversupport, serversupportchannel))).delete({ timeout: 15000 });
         } else msg.channel.send(stickitin(Lang_en.roleassign.tryagaininserversupport, serversupportchannel));
      } else msg.channel.send(response.content || Lang_en.roleassign.novalidrolesfound);
   }
}

// regex stuff for testing things
export const artisttest: RegExp = /\b(art(s|ist)?)\b/im;
export const musiciantest: RegExp = /\b(music(ians?)?)\b/im;
export const cosplayertest: RegExp = /\b(cosplay(ers?)?)\b/im;
export const memetest: RegExp = /\b((me){2,}(ist)?s?)\b/im;
export const rptest: RegExp = /\b(rp|roleplay(er)?s?)\b/im;
export const roletest: RegExp = /\broles?\b/im;

export const otherroles: Array<RoleData> = [
   { name: "artist", regex: artisttest, id: artist },
   { name: "musician", regex: musiciantest, id: musician },
   { name: "cosplayer", regex: cosplayertest, id: cosplayer },
   { name: "meme", regex: memetest, id: meme },
   { name: "rp", regex: rptest, id: rp }
];
