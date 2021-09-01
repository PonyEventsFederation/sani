export type LogFunction = (...stuff: Array<any>) => void;

export type LogLevel = keyof typeof loglevels;
export type LoggerOptions = {
	level?: LogLevel;
	filename?: string;
	padlen?: number;
};

const loglevels = {
	error: 0,
	warn: 1,
	info: 2,
	verbose: 3,
	debug: 4
};

// const loglevellen: { [k in keyof typeof loglevels]: number } = {
// 	error: 5,
// 	warn: 5,
// 	info: 5,
// 	verbose: 7,
// 	debug: 7
// };

const logLevelChangeWatchFunctions: Array<() => void> = [];

let logLevel: LogLevel = "debug";
export function setGlobalLogLevel(level: LogLevel) {
	logLevel = level;
	logLevelChangeWatchFunctions.forEach(f => f());
}

export type Logger = ReturnType<typeof createLogger>;
export function createLogger(name: string, opts?: LoggerOptions) {
	let locallevel = opts?.level;

	// opts?.padlen ?? loglevellen[opts?.level ?? logLevel]
	const fmt = createfmt(name.trim());

	// logging disabled, empty function that does nothing
	const noop = () => {}; // eslint-disable-line

	// functions that actually function
	const actuallyError: LogFunction = (...stuff) => console.error(...fmt("error", ...stuff));
	const actuallyWarn: LogFunction = (...stuff) => console.warn(...fmt("warn", ...stuff));
	const actuallyInfo: LogFunction = (...stuff) => console.info(...fmt("info", ...stuff));
	const actuallyVerbose: LogFunction = (...stuff) => console.debug(...fmt("verbose", ...stuff));
	const actuallyDebug: LogFunction = (...stuff) => console.debug(...fmt("debug", ...stuff));

	// functions that are set to either noop or a functioning log function
	// avoid checking the log level every single time log is called
	// these variables are set automatically
	let setfnError: LogFunction = noop;
	let setfnWarn: LogFunction = noop;
	let setfnInfo: LogFunction = noop;
	let setfnVerbose: LogFunction = noop;
	let setfnDebug: LogFunction = noop;

	// closure functions
	// pulls active function off of the variables above and runs it
	const error: LogFunction = (...args) => setfnError(...args);
	const warn: LogFunction = (...args) => setfnWarn(...args);
	const info: LogFunction = (...args) => setfnInfo(...args);
	const verbose: LogFunction = (...args) => setfnVerbose(...args);
	const debug: LogFunction = (...args) => setfnDebug(...args);

	// functions that check log level and set the log fns to the appropriate functions
	const adjustError = () => setfnError = shouldLog(loglevels.error, locallevel ?? logLevel) ? noop : actuallyError;
	const adjustWarn = () => setfnWarn = shouldLog(loglevels.warn, locallevel ?? logLevel) ? noop : actuallyWarn;
	const adjustInfo = () => setfnInfo = shouldLog(loglevels.info, locallevel ?? logLevel) ? noop : actuallyInfo;
	const adjustVerbose = () => setfnVerbose = shouldLog(loglevels.verbose, locallevel ?? logLevel) ? noop : actuallyVerbose;
	const adjustDebug = () => setfnDebug = shouldLog(loglevels.debug, locallevel ?? logLevel) ? noop : actuallyDebug;

	const adjust = () => {
		adjustError();
		adjustWarn();
		adjustInfo();
		adjustVerbose();
		adjustDebug();
	};
	adjust();
	logLevelChangeWatchFunctions.push(adjust);

	/** sets log level */
	const setLocalLogLevel = (level: LogLevel) => {
		locallevel = level;
		adjust();
	};
	const removeLocalLogLevel = () => {
		locallevel = undefined;
		adjust();
	};

	// const destroy = () => {
	// 	// remove watcher, set all to noop
	// 	warn("an attempt to call destroy on this logger was called! it does not do anything yet!");
	// };

	return { error, warn, info, verbose, debug, setLocalLogLevel, removeLocalLogLevel };
}

function shouldLog(loglevel: number, levelsetting: LogLevel): boolean {
	return loglevels[levelsetting] < loglevel;
}

// function padstr(len: number, smollen: number) {
// 	return " ".repeat(len - smollen);
// }

// function padIfNecessary(len: number, lr: "left" | "right", thingtopad: string) {
// 	if (thingtopad.length >= len) return thingtopad;
// 	return lr === "left" ? `${padstr(len, thingtopad.length)}${thingtopad}`
// 		: lr === "right" ? `${thingtopad}${padstr(len, thingtopad.length)}`
// 		: thingtopad; // eslint-disable-line
// }

function createfmt(name: string) {
	// padlen: number

	return function(logtype: string, ...stuff: Array<any>) {
		stuff.unshift(`[${new Date().toISOString()}] [${name}, ${logtype}]`);
		return stuff;
	};
}
