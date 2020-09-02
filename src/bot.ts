export default class Bot {
   static hallo(name?: string) {
      if (!name) console.log("Hello!");
      else console.log(`Hello ${name}`);
   }
}
