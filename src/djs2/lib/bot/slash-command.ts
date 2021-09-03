import type { CommandInteraction, Client } from "discord.js";
import type { Logger } from "../logger";
import { SlashCommandBuilder } from "@discordjs/builders";
import { createLogger } from "../logger";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

type _SlashCommand = {
	cmd(s: SlashCommandBuilder): unknown;
	commandResponder(o: {
		logger: Logger;
		i: CommandInteraction;
	}): unknown;
};
export type SlashCommand = _SlashCommand | (() => _SlashCommand);
export type SlashCommandManager = ReturnType<typeof createSlashCommandManager>;

type InternalSlashCommandStore = {
	cmd: SlashCommandBuilder;
	respond(interaction: CommandInteraction): unknown;
};

export function createSlashCommandManager() {
	const commands: Array<InternalSlashCommandStore> = [];
	let registered = false;

	const manager = {
		registerSlashCommand,
		putSlashCommands,
		listenForInteractions
	};
	return manager;

	function registerSlashCommand(s: SlashCommand) {
		if (typeof s === "function") s = s();
		if (commands.find(c => c.cmd.name === (s as _SlashCommand).cmd.name)) throw new Error("cannot have two slash commands with the same name");
		if (registered) throw new Error("listener for slash commands already registered, cannot add new slash command");

		const cmd = new SlashCommandBuilder();
		s.cmd(cmd);

		const logger = createLogger(`slash command ${cmd.name}`);

		commands.push({
			cmd,
			respond(i) {
				(s as _SlashCommand).commandResponder({ i, logger });
			}
		});
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

	function listenForInteractions(client: Client) {
		registered = true;

		client.on("interactionCreate", interaction => {
			if (interaction.isCommand()) {
				commands.find(c => c.cmd.name === interaction.commandName)
					?.respond(interaction);
			}
		});
	}
}
