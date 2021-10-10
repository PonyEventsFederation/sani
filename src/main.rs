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
	println!("i spent like 4 hours on this, help");
}
