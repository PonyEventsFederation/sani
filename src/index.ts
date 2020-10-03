import { SaniSoda } from "./bot";
import { envisdev } from "./rando";

setup().then(() => {
   void new SaniSoda().start();
}).catch(console.warn);

async function setup(): Promise<void> {
   if (envisdev()) (await import("dotenv")).config();
   else console.log = (): any => {};
}
