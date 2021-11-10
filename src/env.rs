#[cfg(debug_assertions)]
fn init_dotenv() {
	if let Err(e) = dotenv::dotenv() {
		eprintln!("dotenv failed to initialise: {}", e);
	} else {
		eprintln!("initialised dotenv successfully");
	}
}

#[cfg(not(debug_assertions))]
fn init_dotenv() {}

pub struct Env {
	token: String
}

impl Env {
	pub fn get_env() -> Env {
		use std::env::var;

		init_dotenv();

		let token = var("TOKEN")
			// .unwrap_or_else(|_| var("BOT_TOKEN").unwrap());
			.or_else(|_| var("BOT_TOKEN"))
			.or_else(|_| var("BOT_TOKEN_SANI"))
			.expect("could not find suitable bot token");

		Env { token }
	}

	pub fn token(&self) -> &str {
		&self.token
	}

	#[inline]
	#[cfg(debug_assertions)]
	pub fn is_production(&self) -> bool { false }

	#[inline]
	#[cfg(not(debug_assertions))]
	pub fn is_production(&self) -> bool { true }

	#[inline]
	#[cfg(debug_assertions)]
	pub fn is_development(&self) -> bool { true }

	#[inline]
	#[cfg(not(debug_assertions))]
	pub fn is_development(&self) -> bool { false }
}
