import { SaniSoda } from "./bot";
import { checkenv } from "./rando";

// if NODE_ENV doesnt exist, assume development
// if it does, check for mode "dev" or "development"
// then configure using dotenv
if (!checkenv("NODE_ENV") || process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "development") require("dotenv").config();

new SaniSoda().start();
