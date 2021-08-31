import type { Message, CommandInteraction } from "discord.js";
import { Client, Intents } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import {} from "../logger";

export type Bot = ReturnType<typeof createbot>;

type BotOpts = Readonly<{
	isProduction: boolean;
	clientid: string;
	guildid: string;
	token: string;
	shutdownEvents?: ReadonlyArray<string>;
}>;

export function createbot(opts: BotOpts) {
	type CreatedState = {
		state: "created";
		commandishes: Array<Commandish>;
		slashCommands: Array<SlashCommand>;
	};
	type StartedState = {
		state: "started";
		client: Client;
	};
	type StoppedState = {
		state: "stopped";
	};
	let state: CreatedState | StartedState | StoppedState = {
		state: "created",
		commandishes: [],
		slashCommands: []
	};

	const bot = {
		registerCommandish,
		registerSlashCommand,
		start, stop
	};
	return bot;
	// const registerCommandish = () => {};
	// const registerSlashCommand = () => {};

	function registerCommandish(c: Commandish) {
		if (state.state === "started") throw new Error("cannot register commandish after starting");
		if (state.state === "stopped") throw new Error("what's the point of registering a new commandish after you stop the bot?");
		state.commandishes.push(c);

		return bot;
	}

	function registerSlashCommand(s: SlashCommand) {
		if (state.state === "started") throw new Error("cannot register slash command after starting");
		if (state.state === "stopped") throw new Error("what's the point of registering a new slash command after you stop the bot?");
		state.slashCommands.push(s);

		return bot;
	}

	function stop() {
		if (state.state === "stopped") return;
		if (state.state === "created") throw new Error("cannot stop if not even started yet");
		state.client.destroy();
		state = { state: "stopped" };

		return bot;
	}

	function start(cb?: () => void) {
		if (state.state === "started") return;
		if (state.state === "stopped") throw new Error("cannot restart when already stopped");

		void new Promise<void>(async () => {
			// const commandishes = state
			// todo ack could figure out a better way to do this cast
			const s = state as CreatedState;

			// get intents
			let intents = 0;
			for (const c of s.commandishes) {
				c.intents.forEach(i => intents | Intents.FLAGS[i]);
			}

			// create d.js client
			const client = new Client({ intents });

			// init commandishes
			const commandishes: Array<ReturnType<Commandish["commandish"]>> = [];
			for (const c of s.commandishes) commandishes.push(c.commandish(client));
			client.on("message", async msg => {
				// if no bot user, ignore all bots to prevent endless loop
				if (!client.user && msg.author.bot) return;
				// else ignore self
				if (client.user === msg.author) return;
				await Promise.all(commandishes.map(c => c(msg)));
			});

			// login, can get client id from here
			await client.login(opts.token);

			// init slash commands
			const rest = new REST({ version: "9"}).setToken(opts.token);
			const slashCommandsRegister = s.slashCommands.map(s => s.cmd.toJSON());
			await rest.put(
				opts.isProduction
					? Routes.applicationCommands(opts.clientid)
					: Routes.applicationGuildCommands(opts.clientid, opts.guildid),
				{ body: slashCommandsRegister }
			);
			client.on("interactionCreate", async interaction => {
				if (interaction.isCommand()) return void s.slashCommands
					.find(c => c.cmd.name === interaction.commandName)
					?.commandResponder(interaction);
			});

			opts.shutdownEvents?.forEach(e => process.on(e, () => bot.stop()));
		}).then(cb);

		return bot;
	}
}

export type Commandish = {
	intents: Array<keyof typeof Intents["FLAGS"]>;
	commandish(bot: Client): (msg: Message) => Promise<unknown>;
};

// export type SlashCommand = (o: {
// 	// h
// }) => (bot: Bot) => {
// 	// todo?
// };
export type SlashCommand = {
	cmd: SlashCommandBuilder;
	commandResponder(i: CommandInteraction): unknown;
};
