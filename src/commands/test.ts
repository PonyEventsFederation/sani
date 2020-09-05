import { Command } from "./command";
import { y2012, y2013, y2014, y2015, y2016, y2017, y2018, y2019, y2020 } from "./ids";
import { Message } from "discord.js";


export class Test extends Command {
   public shouldhandle(msg: Message): boolean {
      return msg.content.toLowerCase().includes("testest");
   }
   public handle(msg: Message): void {
      const arrr: Array<string> = [y2012, y2013, y2014, y2015, y2016, y2017, y2018, y2019, y2020];
      msg.channel.send("<@&" + arrr.join("> <@&") + ">");
   }
}
