
export function getEnv() {
   function envdie(envname: string): never{
      throw `process.env["${envname}"] does not exist, but it is required for this app to run. please set it`;
   }
   if (!process.env.TOKEN) envdie("TOKEN");

   let tmp: number;
   let port = process.env.port && !isNaN(tmp = Number(process.env.PORT)) ? tmp : 7079;

   const env = {
      token: process.env.TOKEN,
      port
   };

   // this is a typecheck, if any key in the env could be undefined or null,
   // then this will report an error
   /* eslint-disable @typescript-eslint/no-unused-vars */
   /* eslint-disable @typescript-eslint/no-unused-vars-experimental */
   const typecheck: { [k in keyof typeof env]: NonNullable<typeof env[k]> } = env;
   /* eslint-enable @typescript-eslint/no-unused-vars */
   /* eslint-enable @typescript-eslint/no-unused-vars-experimental */

   return env;
}
