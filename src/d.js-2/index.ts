import "dotenv/config";
import { getEnv, createbot, SlashCommandBuilder } from "./lib";
console.log("h");

const env = getEnv();
const isProduction = env.env === "production";
const bot = createbot({
	token: env.token,
	isProduction,
	clientid: "741509200328392725",
	guildid: "834297591159980073"
})
	.registerSlashCommand({
		cmd: new SlashCommandBuilder()
			.setName("h")
			.setDescription("respond with h"),
		commandResponder: i => {
			void i.reply("h");
		}
	})
	.start(() => console.log("started"));
