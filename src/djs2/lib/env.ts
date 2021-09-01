export function getEnv() {
	function envDie(varname: string): never {
		console.error(`process.env["${varname}"] doesn't exist, it is required to be set to run. please set it!`);
		process.exit(1);
	}

	if (!process.env.TOKEN) envDie("TOKEN");

	const env = {
		env: process.env.NODE_ENV === "production" ? "production" : "development" as "production" | "development",
		token: process.env.TOKEN
	};

	// typecheck, will check that everything returned is not null or undefined
	/* eslint-disable @typescript-eslint/no-unused-vars */
	/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
	const typecheck: { [k in keyof typeof env]: NonNullable<typeof env[k]> } = env;
	/* eslint-enable @typescript-eslint/no-unused-vars */
	/* eslint-enable @typescript-eslint/no-unused-vars-experimental */

	return env;
}
