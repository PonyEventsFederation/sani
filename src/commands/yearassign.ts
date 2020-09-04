import { SaniSoda } from "../bot";
import { Command } from "./command";
import { ClientUser, Message, MessageMentions } from "discord.js";


export class YearAssignCommand extends Command {
   private testforyears: RegExp = /20[12][4576890][^0-9]/g;
   private testendyears: RegExp = /20[12][4567890]$/g;

   public constructor(sani: SaniSoda) {
      super(sani);
   }

   public shouldhandle(msg: Message): boolean {
      const botusr: ClientUser | null = this.sani.getbot().user;
      if (botusr) return msg.mentions.has(botusr) && msg.content.toLowerCase().includes("galacon");
      return false;
   }

   public handle(msg: Message): void {
      let msgcontent: string = msg.content;
      msgcontent = msgcontent.replace(MessageMentions.CHANNELS_PATTERN, "");
      msgcontent = msgcontent.replace(MessageMentions.EVERYONE_PATTERN, "");
      msgcontent = msgcontent.replace(MessageMentions.ROLES_PATTERN, "");
      msgcontent = msgcontent.replace(MessageMentions.USERS_PATTERN, "");

      const res: RegExpMatchArray | null = msgcontent.match(this.testforyears);
      const end: RegExpMatchArray | null = msgcontent.match(this.testendyears);

      if (res) {
         for (let i = 0; i < res.length; i++) {
            res[i] = res[i].substring(0, 4);
         }
         if (end && end[0]) res.push(end[0].substring(0, 4));
         return void msg.channel.send(res.join(", "));
      }
      return void msg.channel.send("none found");
   }
}
