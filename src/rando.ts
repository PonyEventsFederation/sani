export function checkenv(varname: string): boolean {
   return !!process.env[varname];
}

export function assertenv(varname: string): void {
   if (!checkenv(varname)) {
      console.error(`no environment variable called ${varname}`);
      process.exit(1);
   }
}

// if NODE_ENV doesnt exist, assume development
// if it does, check for mode "dev" or "development"
// then configure using dotenv
export function envisdev(): boolean {
   return !checkenv("NODE_ENV") || process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "development";
}

export function envisprod(): boolean {
   return !envisdev();
}

export function randfromarray<T>(...arrs: Array<Array<T>>): Array<T> {
   if (arrs.length === 0) return [];

   const randnum: number = Math.floor(Math.random() * arrs[0].length);
   const randarr: Array<T> = [];
   for (let i = 0; i < arrs.length; i++) if (arrs[i] && arrs[i].length > randnum) randarr.push(arrs[i][randnum]);

   return randarr;
}
