pub mod module;

// useful imports for modules
// import all of this with `use super::*;`
use module::Event;
use module::Module;
use async_trait::async_trait;
use twilight_gateway::Event::*;

pub mod status;
