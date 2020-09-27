import { Commandish } from "./commandish";
import { getandapplyroles, RoleData } from "./randorolestuff";
import { serversupportchannel, y2012, y2013, y2014, y2015, y2016, y2017, y2018, y2019, mlemEmoji } from "../ids";
import { Message } from "discord.js";
import { Lang_en, stickitin } from "../lang";

/**
 * Responsible for assigning year roles (2012-2019) of the
 * [GalaCon Discord server](https://discord.gg/galacon).
 * These roles indicate your attendance to (physical) GalaCon conventions.
 */
export class YearAssignCommandish extends Commandish {
   public shouldhandle(msg: Message): boolean {
      return msg.mentions.has(this.botusr) && yeartest.test(msg.content);
   }

   public async handle(msg: Message): Promise<void> {
      const response = await getandapplyroles(msg, yearroles, serversupportchannel);
      if (response.delete) {
         if (msg.guild && msg.deletable) {
            msg.delete();
            (await msg.channel.send(stickitin(Lang_en.roleassign.hi, msg.author.id) + stickitin(Lang_en.roleassign.tryagaininserversupport, [msg.author.id, serversupportchannel, mlemEmoji]))).delete({ timeout: 15000 });
         } else msg.channel.send(stickitin(Lang_en.roleassign.hi, msg.author.id) + stickitin(Lang_en.roleassign.tryagaininserversupport, [msg.author.id, serversupportchannel, mlemEmoji]));
      } else msg.channel.send(stickitin(Lang_en.roleassign.hi, msg.author.id) + response.content || stickitin(Lang_en.roleassign.novalidyearsfound, [msg.author.id]));
   }
}

export const yeartest: RegExp = /\bgalacon\b/im;
export const yeartest2012: RegExp = /\b2012\b/im;
export const yeartest2013: RegExp = /\b2013\b/im;
export const yeartest2014: RegExp = /\b2014\b/im;
export const yeartest2015: RegExp = /\b2015\b/im;
export const yeartest2016: RegExp = /\b2016\b/im;
export const yeartest2017: RegExp = /\b2017\b/im;
export const yeartest2018: RegExp = /\b2018\b/im;
export const yeartest2019: RegExp = /\b2019\b/im;


export const yearroles: Array<RoleData> = [
   { name: "2012", regex: yeartest2012, id: y2012 },
   { name: "2013", regex: yeartest2013, id: y2013 },
   { name: "2014", regex: yeartest2014, id: y2014 },
   { name: "2015", regex: yeartest2015, id: y2015 },
   { name: "2016", regex: yeartest2016, id: y2016 },
   { name: "2017", regex: yeartest2017, id: y2017 },
   { name: "2018", regex: yeartest2018, id: y2018 },
   { name: "2019", regex: yeartest2019, id: y2019 }
];
