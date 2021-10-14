type LogFn = Box<dyn Fn(String) -> ()>;

#[derive(Copy, Clone, Debug, Hash, PartialEq, Eq, PartialOrd, Ord)]
pub enum LogLevel { Error, Warn, Info, Verbose, Debug }

impl std::fmt::Display for LogLevel {
	fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
		write!(f, "{}", match self {
			LogLevel::Error => { "error" }
			LogLevel::Warn => { "warn" }
			LogLevel::Info => { "info" }
			LogLevel::Verbose => { "verbose" }
			LogLevel::Debug => { "debug" }
		})
	}
}

pub struct Logger {
	name: String,
	level: LogLevel,

	error: LogFn,
	warn: LogFn,
	info: LogFn,
	verbose: LogFn,
	debug: LogFn
}

/// simple struct to hold return value of Logger::make_log_fns
struct LogFns {
	error: LogFn,
	warn: LogFn,
	info: LogFn,
	verbose: LogFn,
	debug: LogFn
}

impl Logger {
	/// returns a log function that does nothing
	fn noop() -> LogFn {
		Box::from(|_| {})
	}

	fn make_log_fn(name: String, for_level: LogLevel, level_setting: LogLevel) -> LogFn {
		if for_level <= level_setting {
			use std::time::SystemTime;

			match for_level {
				LogLevel::Error | LogLevel::Warn => {
					Box::from(move |msg| eprintln!(
						"[{time}] [{name}, {level}] {msg}",
						time = chrono::Local::now().to_rfc3339(),
						name = name,
						level = for_level.to_string(),
						msg = msg
					))
				}
				_ => {
					Box::from(move |msg| println!(
						"[{time}] [{name}, {level}] {msg}",
						time = chrono::Local::now().to_rfc3339(),
						name = name,
						level = for_level.to_string(),
						msg = msg
					))
				}
			}
		} else {
			Box::from(|_| {})
		}
	}

	fn make_log_fns(name: &String, level_setting: LogLevel) -> LogFns {
		use LogLevel::*;

		LogFns {
			error: Logger::make_log_fn(name.clone(), Error, level_setting),
			warn: Logger::make_log_fn(name.clone(), Warn, level_setting),
			info: Logger::make_log_fn(name.clone(), Info, level_setting),
			verbose: Logger::make_log_fn(name.clone(), Verbose, level_setting),
			debug: Logger::make_log_fn(name.clone(), Debug, level_setting)
		}
	}

	pub fn new(name: &str) -> Logger {
		use LogLevel::*;

		let name = String::from(name);
		let level = Debug;

		let LogFns { error, warn, info, verbose, debug } = Logger::make_log_fns(&name, level);

		let logger = Logger {
			name,
			level,
			error, warn, info, verbose, debug
		};

		logger
	}

	pub fn set_log_level(&mut self, level: LogLevel) {
		self.level = level;
		let LogFns { error, warn, info, verbose, debug } = Logger::make_log_fns(&self.name, level);
		self.error = error;
		self.warn = warn;
		self.info = info;
		self.verbose = verbose;
		self.debug = debug;
	}

	#[inline]
	pub fn error(&self, content: String) {
		(self.error)(content);
	}
	#[inline]
	pub fn warn(&self, content: String) {
		(self.warn)(content);
	}
	#[inline]
	pub fn info(&self, content: String) {
		(self.info)(content);
	}
	#[inline]
	pub fn verbose(&self, content: String) {
		(self.verbose)(content);
	}
	#[inline]
	pub fn debug(&self, content: String) {
		(self.debug)(content);
	}
}
