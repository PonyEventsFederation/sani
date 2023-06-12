import type { Module } from "../app";
import { throttleTime, filter, mergeMap } from "rxjs/operators";

export const greetings: Module = () => ({
   intents: ["GUILD_MESSAGES"],
   onMessageCreate: ({ dispatch, client }) => dispatch.pipe(
      throttleTime(60 * 1000),
      filter(msg => msg.content.toUpperCase().includes("HI")),
      mergeMap(msg => client.createMessage(msg.channel_id, {
         content: "Hello"
      }))
   )
});
