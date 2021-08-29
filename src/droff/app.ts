import { Client, Intents, createClient } from "droff";
import type { GatewayEvents } from "droff/dist/types";
import * as rx from "rxjs";

type MaybePromise<A> = A | PromiseLike<A>;
type PlainOldObservable = rx.Observable<any>;

/**
 * **NOTE: DO NOT SUBSCRIBE TO THE DISPATCH!!! APP WILL DO THAT FOR YOU!!!!!
 * DOING SO WILL RESULT IN IT BEING INVOKED TWICE EVERY TIME THE EVENT HAPPENS!!!!!!!!!**
 */
export type AAPI = {
	client: Client;
};

export type Module = () => MaybePromise<InitModule>;
export type InitModule = {
	intents: MaybePromise<Array<keyof typeof Intents>>;
	finalise?(): MaybePromise<void>;

	// onHello?: (aapi: AAPI & { dispatch: rx.Observable<GatewayEvents["HELLO"]> }) => MaybePromise<PlainOldObservable>;
	onReady?(aapi: AAPI & { dispatch: rx.Observable<GatewayEvents["READY"]> }): MaybePromise<PlainOldObservable>;
	// RESUMED
	// RECONNECT
	// INVALID_SESSION
	// APPLICATION_COMMAND_CREATE
	// APPLICATION_COMMAND_UPDATE
	// APPLICATION_COMMAND_DELETE
	// CHANNEL_CREATE
	// CHANNEL_UPDATE
	// CHANNEL_DELETE
	// CHANNEL_PINS_UPDATE
	// THREAD_CREATE
	// THREAD_UPDATE
	// THREAD_DELETE
	// THREAD_LIST_SYNC
	// THREAD_MEMBER_UPDATE
	// THREAD_MEMBERS_UPDATE
	// GUILD_CREATE
	// GUILD_UPDATE
	// GUILD_DELETE
	// GUILD_BAN_ADD
	// GUILD_BAN_REMOVE
	// GUILD_EMOJIS_UPDATE
	// GUILD_INTEGRATIONS_UPDATE
	// onGuildMemberAdd?: (aapi: AAPI & { dispatch: rx.Observable<GatewayEvents["GUILD_MEMBER_ADD"]> }) => MaybePromise<PlainOldObservable>;
	// GUILD_MEMBER_REMOVE
	// GUILD_MEMBER_UPDATE
	// GUILD_MEMBERS_CHUNK
	// GUILD_ROLE_CREATE
	// GUILD_ROLE_UPDATE
	// GUILD_ROLE_DELETE
	// INTEGRATION_CREATE
	// INTEGRATION_UPDATE
	// INTEGRATION_DELETE
	// INTERACTION_CREATE
	// INVITE_CREATE
	// INVITE_DELETE
	onMessageCreate?(aapi: AAPI & { dispatch: rx.Observable<GatewayEvents["MESSAGE_CREATE"]> }): MaybePromise<PlainOldObservable>;
	// MESSAGE_UPDATE
	// MESSAGE_DELETE
	// MESSAGE_DELETE_BULK
	// MESSAGE_REACTION_ADD
	// MESSAGE_REACTION_REMOVE
	// MESSAGE_REACTION_REMOVE_ALL
	// MESSAGE_REACTION_REMOVE_EMOJI
	// PRESENCE_UPDATE
	// STAGE_INSTANCE_CREATE
	// STAGE_INSTANCE_DELETE
	// STAGE_INSTANCE_UPDATE
	// TYPING_START
	// USER_UPDATE
	// VOICE_STATE_UPDATE
	// VOICE_SERVER_UPDATE
	// WEBHOOKS_UPDATE
};

export const createApp = () => {
	const state: {
		state: "created";
		modules: Record<string, Module>;
	} | {
		state: "started";
		combinedObservable: rx.Observable<any>;
	} | {
		state: "stopped";
	} = {
		state: "created",
		modules: {}
	};

	const app = { registerModule, start, stop };
	return app;

	// functions

	function registerModule(name: string, module: Module) {
		if (state.state === "started") throw new Error("registering modules after start currently not supported");
		if (state.state === "stopped") throw new Error("theres no point in registering modules after stopping!");
		if (state.modules[name] !== undefined) throw new Error(`couldn't register module ${name}, module already registered`);

		state.modules[name] = module;
		return app;
	}

	function stop() {
		// if (state.state === "started") throw new Error("cannot stop when not started yet");
		// if (state.state === "") return;

		// TODO stop mechanism
		// TODO stop all modules
	}

	function start(token: string, cb?: () => void) {
		if (state.state === "stopped") throw new Error("restarting currently not supported yet");
		if (state.state === "started") return app;

		void new Promise<void>(async () => {
			const initmodules: Record<string, InitModule> = {};
			let intents = 0;

			for (const name in state.modules) {
				const module = state.modules[name];
				const initmodule = await Promise.resolve(module());

				(await Promise.resolve(initmodule.intents)).forEach(intent => intents = intents | Intents[intent]);
				initmodules[name] = initmodule;
			}

			const client = createClient({
				token,
				gateway: { intents }
			});
			const aapi = { client };

			const arrayOfDispatchPromises: Array<MaybePromise<PlainOldObservable>> = [];
			function handleDispatchPromise(p?: MaybePromise<PlainOldObservable>) {
				p && arrayOfDispatchPromises.push(p);
			}

			for (const name in initmodules) {
				const m = initmodules[name];

				// TODO create logger and stick in aapi

				// HELLO
				handleDispatchPromise(m.onReady?.({ ...aapi, dispatch: client.fromDispatch("READY") }));
				// RESUMED
				// RECONNECT
				// INVALID_SESSION
				// APPLICATION_COMMAND_CREATE
				// APPLICATION_COMMAND_UPDATE
				// APPLICATION_COMMAND_DELETE
				// CHANNEL_CREATE
				// CHANNEL_UPDATE
				// CHANNEL_DELETE
				// CHANNEL_PINS_UPDATE
				// THREAD_CREATE
				// THREAD_UPDATE
				// THREAD_DELETE
				// THREAD_LIST_SYNC
				// THREAD_MEMBER_UPDATE
				// THREAD_MEMBERS_UPDATE
				// GUILD_CREATE
				// GUILD_UPDATE
				// GUILD_DELETE
				// GUILD_BAN_ADD
				// GUILD_BAN_REMOVE
				// GUILD_EMOJIS_UPDATE
				// GUILD_INTEGRATIONS_UPDATE
				// GUILD_MEMBER_ADD
				// GUILD_MEMBER_REMOVE
				// GUILD_MEMBER_UPDATE
				// GUILD_MEMBERS_CHUNK
				// GUILD_ROLE_CREATE
				// GUILD_ROLE_UPDATE
				// GUILD_ROLE_DELETE
				// INTEGRATION_CREATE
				// INTEGRATION_UPDATE
				// INTEGRATION_DELETE
				// INTERACTION_CREATE
				// INVITE_CREATE
				// INVITE_DELETE
				handleDispatchPromise(m.onMessageCreate?.({ ...aapi, dispatch: client.fromDispatch("MESSAGE_CREATE") }));
				// MESSAGE_UPDATE
				// MESSAGE_DELETE
				// MESSAGE_DELETE_BULK
				// MESSAGE_REACTION_ADD
				// MESSAGE_REACTION_REMOVE
				// MESSAGE_REACTION_REMOVE_ALL
				// MESSAGE_REACTION_REMOVE_EMOJI
				// PRESENCE_UPDATE
				// STAGE_INSTANCE_CREATE
				// STAGE_INSTANCE_DELETE
				// STAGE_INSTANCE_UPDATE
				// TYPING_START
				// USER_UPDATE
				// VOICE_STATE_UPDATE
				// VOICE_SERVER_UPDATE
				// WEBHOOKS_UPDATE
			}

			const dispatches = await Promise.all(arrayOfDispatchPromises);
			rx.merge(client.effects$, ...dispatches).subscribe();
		}).then(cb);


		return app;
	}
};
