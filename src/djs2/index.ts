import "dotenv/config";
import { getEnv, createbot, SlashCommandBuilder, setGlobalLogLevel } from "./lib";

const env = getEnv();
const isProduction = env.env === "production";

setGlobalLogLevel(isProduction ? "info" : "debug");

createbot({
	token: env.token,
	isProduction,
	clientid: "741509200328392725",
	guildid: "834297591159980073",
	shutdownEvents: ["beforeExit", "SIGINT", "SIGTERM"]
})
	.registerSlashCommand({
		cmd: new SlashCommandBuilder()
			.setName("h")
			.setDescription("respond with h"),
		commandResponder: ({ logger }) => async i => {
			logger.debug("got an aitch cmd");
			await i.reply("h");
		}
	})
	.registerSlashCommand({
		cmd: new SlashCommandBuilder()
			.setName("time")
			.setDescription("gets the current time in ISO format"),
		commandResponder: ({ logger }) => async i => {
			logger.debug("got an time cmd");
			await i.reply(new Date().toISOString());
		}
	})
	.start(() => console.log("started"));
