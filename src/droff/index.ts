import { createApp } from "./app";
import { greetings } from "./modules/greetings";
import { getEnv } from "./env";

(async () => {
	(await import("dotenv")).config();

	const env = getEnv();

	const app = createApp();
	app.registerModule("greetings", greetings)
		.start(env.token);
})().catch(console.error);
