import { SaniSoda } from "./bot";
import { envisdev } from "./rando";

// if NODE_ENV doesnt exist, assume development
// if it does, check for mode "dev" or "development"
// then configure using dotenv
if (envisdev()) require("dotenv").config();
else console.log = () => {};


new SaniSoda().start();
