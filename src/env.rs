#[cfg(debug_assertions)]
fn init_dotenv() {
	if let Err(e) = dotenv::dotenv() {
		eprintln!("dotenv failed to initialise: {}", e);
	} else {
		eprintln!("initialised dotenv successfully");
	}
}

#[cfg(not(debug_assertions))]
fn init_dotenv() {
	// dotenv is not used in production
}

pub struct Env {
	token: String,
	port: u16
}

impl Env {
	pub fn get_env() -> Env {
		use std::env::var;

		init_dotenv();

		let token = var("TOKEN")
			.or_else(|_| var("BOT_TOKEN_SANI"))
			.or_else(|_| var("BOT_TOKEN"))
			.expect("could not find suitable bot token");

		let port = var("PORT")
			.unwrap_or("7079".into())
			.parse::<u16>()
			.expect("failed to parse port");

		Env { token, port }
	}

	pub fn token(&self) -> &str {
		&self.token
	}

	pub fn port(&self) -> &u16 {
		&self.port
	}
}

// debug functions
#[cfg(debug_assertions)]
impl Env {
	#[inline]
	pub fn production(&self) -> bool { false }

	#[inline]
	pub fn development(&self) -> bool { true }
}

// production functions
#[cfg(not(debug_assertions))]
impl Env {
	#[inline]
	pub fn production(&self) -> bool { true }

	#[inline]
	pub fn development(&self) -> bool { false }
}
