use std::convert::Infallible;
use std::error::Error;
use std::fmt::Error as FmtError;
use std::fmt::Display;
use std::fmt::Formatter;
use std::str::FromStr;
use twilight_bot_utils::env::Env;
use warp::Filter;
use warp::header;
use warp::http::StatusCode;
use warp::path;
use warp::post;
use warp::Rejection;
use warp::reject;
use warp::reject::MethodNotAllowed;
use warp::Reply;
use warp::reply;
use warp::reply::Response;
use warp::serve;
use warp::Server;

pub async fn loyalty_server(env: &Env) {
	let port = env.port();
	let action_header = header::<String>("action").and_then(|header: String| async move {
		// header::<UserAndAction>() is going to discard the error we want so do it manually
		header.parse::<UserAndAction>().map_err(|e| reject::custom(e))
	});

	let loyalty = path("loyalty-role")
		.and(post())
		.and(action_header)
		.map(|action| {
			let action = format!("action: {:?}", action);
			action
		})
		.recover(handle_loyalty_rejection);

	serve(loyalty).run(([0, 0, 0, 0], 7079)).await;
}

async fn handle_loyalty_rejection(rejection: Rejection) -> Result<Box<dyn Reply>, Infallible> {
	// #[inline]
	// fn ok(reply: impl Reply + 'static) -> Result<Box<dyn Reply>, Infallible> {
	// 	Ok(Box::new(reply))
	// }
	macro_rules! ok {
		($reply:expr) => {
			Ok(Box::new($reply))
		}
	}

	// to handle errors from incorrect action header
	if let Some(rejection) = rejection.find::<UserAndActionError>() {
		let r_str = rejection.to_string();

		let status_code = if let UserAndActionError::WeirdError = rejection {
			StatusCode::INTERNAL_SERVER_ERROR
		} else {
			StatusCode::BAD_REQUEST
		};

		// return Ok(Box::new(reply::with_status(r_str, status_code)))
		return ok!(reply::with_status(r_str, status_code))
	}


	if rejection.is_not_found() {
		// Ok(reply::with_status("".into(), StatusCode::NOT_FOUND))
		// return Ok(rejection.into())
		// return ok(rejection)
		return ok!(StatusCode::NOT_FOUND)
	}

	if rejection.find::<MethodNotAllowed>().is_some() {
		return ok!(StatusCode::NOT_FOUND)
	}

	// Ok(reply::with_status(UserAndActionError::WeirdError.to_string(), StatusCode::INTERNAL_SERVER_ERROR))
	// Ok(Box::new(reply::html::<String>(r#"<!DOCTYPE html>"#.into())))
	// ok!(reply::with_status(reply::html::<String>(r#"<!DOCTYPE html>"#.into()), StatusCode::INTERNAL_SERVER_ERROR))
	ok!(StatusCode::INTERNAL_SERVER_ERROR)
}

#[derive(Debug, PartialEq, Eq, Clone, Copy)]
enum Action {
	Grant,
	Revoke
}

impl FromStr for Action {
	type Err = ();

	fn from_str(string: &str) -> Result<Self, Self::Err> {
		match string {
			"grant" => { Ok(Action::Grant) }
			"revoke" => { Ok(Action::Revoke) }
			_ => { Err(()) }
		}
	}
}

#[derive(Debug, PartialEq, Eq, Clone)]
struct UserAndAction {
	username: String,
	discriminator: u16,
	action: Action
}

impl UserAndAction {
	#[inline]
	fn user(&self) -> String {
		format!("{}#{:04}", self.username, self.discriminator)
	}

	#[inline]
	fn username(&self) -> &str {
		&self.username
	}

	#[inline]
	fn discriminator(&self) -> &u16 {
		&self.discriminator
	}

	#[inline]
	fn action(&self) -> &Action {
		&self.action
	}
}

impl FromStr for UserAndAction {
	type Err = UserAndActionError;

	fn from_str(string: &str) -> Result<Self, Self::Err> {
		use UserAndActionError::*;

		let first_space = string.find(' ')
			.ok_or(FormatIncorrect)?;

		// let action = &string[..first_space];
		let action = string.get(..first_space)
			.ok_or(WeirdError)?; // should not error
		let action = Action::from_str(action)
			.map_err(|_| UnrecognisedAction(action.into()))?;

		let user = string.get(first_space + 1..)
			.ok_or(WeirdError)?; // should not error

		let last_hash = user.rfind('#')
			.ok_or(MissingHash)?;

		let username = user.get(..last_hash)
			.ok_or(WeirdError)?; // should not error

		let discriminator = user.get(last_hash + 1..)
			.ok_or(WeirdError)?; // should not error
		if discriminator.len() != 4 { return Err(InvalidDiscriminator(discriminator.into())) }
		let discriminator = u16::from_str(discriminator)
			.map_err(|_| InvalidDiscriminator(discriminator.into()))?;

		Ok(UserAndAction {
			username: username.into(),
			discriminator,
			action
		})
	}
}

#[derive(Debug, PartialEq, Eq, Clone)]
enum UserAndActionError {
	FormatIncorrect,
	UnrecognisedAction(String),
	MissingHash,
	InvalidDiscriminator(String),
	/// should *never* happen, but i would rather that sani
	/// doesn't panick
	WeirdError
}

impl Display for UserAndActionError {
	fn fmt(&self, f: &mut Formatter) -> Result<(), FmtError> {
		use UserAndActionError::*;

		write!(f, "{}", match self {
			FormatIncorrect => { "".into() }
			UnrecognisedAction(action) => { format!("unrecognised action: {}", action) }
			MissingHash => { r##"invalid user format, missing "#""##.into() }
			InvalidDiscriminator(discrim) => { format!("invalid discriminator: {}", discrim) }
			WeirdError => { "an extremely weird and unexpected error has occured, please contact Autumn Meadow#2864 about it, thank you!".into() }
		})?;

		if !matches!(self, FormatIncorrect | WeirdError) {
			write!(f, "\n\n")?;
		}

		if !matches!(self, WeirdError) {
			write!(f, "format: <grant | revoke> <username>#<discriminator>\nex: \"grant Autumn Meadow#2864\"\nex: \"revoke Autumn Meadow#2864\"\n")?;
		}

		Ok(())
	}
}

impl Error for UserAndActionError {}
impl reject::Reject for UserAndActionError {}

#[cfg(test)]
mod tests {
	use super::*;

	#[test]
	fn test_action_from_str() {
		use Action::*;

		assert_eq!(Action::from_str("grant"), Ok(Grant));
		assert_eq!(Action::from_str("revoke"), Ok(Revoke));
		assert_eq!(Action::from_str(""), Err(()));
		assert_eq!(Action::from_str("grant "), Err(()));
		assert_eq!(Action::from_str("revoke "), Err(()));
		assert_eq!(Action::from_str("this is something else entirely"), Err(()));
		assert_eq!(Action::from_str("Grant"), Err(()));
	}

	#[test]
	fn test_user_and_action_from_str() {
		assert_eq!(UserAndAction::from_str("grant Autumn Meadow#2864"), Ok(UserAndAction {
			username: "Autumn Meadow".into(),
			discriminator: 2864,
			action: Action::Grant
		}));
		assert_eq!(UserAndAction::from_str("revoke Autumn Meadow#2864"), Ok(UserAndAction {
			username: "Autumn Meadow".into(),
			discriminator: 2864,
			action: Action::Revoke
		}));
		assert_eq!(UserAndAction::from_str("grant Autumn Meadow"), Err(UserAndActionError::MissingHash));
		assert_eq!(UserAndAction::from_str("grant Autumn Meadow#2864#2864"), Ok(UserAndAction {
			username: "Autumn Meadow#2864".into(),
			discriminator: 2864,
			action: Action::Grant
		}));
		assert_eq!(UserAndAction::from_str("Autumn Meadow#2864"), Err(UserAndActionError::UnrecognisedAction("Autumn".into())));
	}
}
