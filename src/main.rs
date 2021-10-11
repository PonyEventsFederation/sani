mod env;

use tokio::runtime::Builder as TokioRuntimeBuilder;
use std::time::Duration;

fn main() {
	TokioRuntimeBuilder::new_multi_thread()
		.enable_all()
		.worker_threads(2)
		.max_blocking_threads(32)
		.thread_keep_alive(Duration::from_secs(60))
		.build()
		.unwrap()
		.block_on(async_main());
}

async fn async_main() {
	let env = env::Env::get_env();

	println!("we are in production mode? {}", env.is_production());
	println!("we are in development mode? {}", env.is_development());
}
