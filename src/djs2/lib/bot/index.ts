import type { SlashCommand, SlashCommandManager } from "./slash-command";
import { Client } from "discord.js";
import { createSlashCommandManager } from "./slash-command";

export type Bot = ReturnType<typeof createbot>;

type BotOpts = Readonly<{
	isProduction: boolean;
	clientid: string;
	guildid: string;
	token: string;
	shutdownEvents?: ReadonlyArray<string>;
}>;

export function createbot(o: BotOpts) {
	type CreatedState = {
		state: "created";
		slashManager: SlashCommandManager;
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
		slashManager: createSlashCommandManager()
	};

	const bot = {
		start, stop,
		registerSlashCommand
	};
	return bot;

	function registerSlashCommand(s: SlashCommand) {
		if (state.state === "started") throw new Error("cannot register slash command after starting");
		if (state.state === "stopped") throw new Error("what's the point of registering a new slash command after you stop the bot?");
		state.slashManager.registerSlashCommand(s);

		return bot;
	}

	function start(cb?: () => void) {
		if (state.state === "started") return bot;
		if (state.state === "stopped") throw new Error("cannot restart when already stopped");

		void new Promise<void>(async (res) => {
			// todo ack could figure out a better way to do this cast
			const s = state as CreatedState;

			// get intents
			// todo commandish functionality
			let intents = 0;

			// create d.js client
			const client = new Client({ intents });

			// init commandishes
			// except not implemented yet

			// login
			await client.login(o.token);

			// init slash commands
			await s.slashManager.putSlashCommands({
				token: o.token,
				on: "guild",
				clientID: o.clientid,
				guildID: o.guildid
			});
			s.slashManager.listenForInteractions(client);
			res();
		}).then(cb);

		return bot;
	}

	function stop() {
		if (state.state === "stopped") return;
		if (state.state === "created") throw new Error("cannot stop if not even started yet");
		state.client.destroy();
		state = { state: "stopped" };

		return bot;
	}
}
