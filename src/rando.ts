export function checkenv(varname: string): boolean {
   return !!process.env[varname];
}

export function assertenv(varname: string): void {
   if (!checkenv(varname)) {
      console.error(`no environment variable called ${varname}`);
      process.exit(1);
   }
}
