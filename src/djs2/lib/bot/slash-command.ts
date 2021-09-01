import type { CommandInteraction, Client } from "discord.js";
import type { SlashCommandBuilder } from "@discordjs/builders";
import type { Logger } from "../logger";
import { createLogger } from "../logger";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

export type SlashCommand = {
	cmd: SlashCommandBuilder;
	commandResponder(o: {
		logger: Logger;
	}): (i: CommandInteraction) => unknown;
};
export type SlashCommandManager = ReturnType<typeof createSlashCommandManager>;

export function createSlashCommandManager() {
	const commands: Array<SlashCommand> = [];
	let registered = false;

	const manager = {
		registerSlashCommand,
		putSlashCommands,
		listenForInteractions
	};
	return manager;

	function registerSlashCommand(s: SlashCommand) {
		if (commands.find(c => c.cmd.name === s.cmd.name)) throw new Error("cannot have two slash commands with the same name");
		if (registered) throw new Error("listener for slash commands already registered, cannot add new slash command");
		commands.push(s);
	}

	async function putSlashCommands<On extends "global" | "guild">(o: {
		token: string;
		on: On;
		clientID: string;
		guildID: On extends "guild" ? string : never;
	}) {
		const rest = new REST({ version: "9" }).setToken(o.token);
		if (!(o.on === "global" || o.on === "guild")) throw new Error("can only put commands globally or on a guild");
		await rest.put(
			o.on === "global"
				? Routes.applicationCommands(o.clientID)
				: Routes.applicationGuildCommands(o.clientID, o.guildID),
			{ body: commands.map(c => c.cmd.toJSON()) }
		);
	};

	function listenForInteractions(c: Client) {
		registered = true;

		const cmds = commands.map(c => ({
			name: c.cmd.name,
			respond: c.commandResponder({
				logger: createLogger(`slash command ${c.cmd.name}`)
			})
		}));

		c.on("interactionCreate", interaction => {
			if (interaction.isCommand()) {
				cmds.find(c => c.name === interaction.commandName)
					?.respond(interaction);
			}
		});
	}
}
