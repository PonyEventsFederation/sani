export default class Bot {
   static hallo(name?: string): void {
      if (!name) console.log("Hello!");
      else console.log(`Hello ${name}`);
   }
}
