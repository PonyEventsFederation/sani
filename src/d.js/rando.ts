/**
 * This function takes a variable name and checks process.env for its existence.
 *
 * @param varname variable name to check existence of
 * @returns the environment variable if it exists, or false
 */
function checkenv(varname: string): boolean {
   const envvar: string | undefined = process.env[varname];
   return envvar !== undefined;
}

// /**
//  * This function takes a variable name and exits the process with a non-zero exit code
//  * if it doesn't exist.
//  *
//  * @param varname variable name to assert existence of
//  */
// export function assertenv(varname: string): never | void {
//    if (!checkenv(varname)) {
//       console.error(`no environment variable called ${varname}`);
//       process.exit(1);
//    }
// }

/**
 * checks if process.env.NODE_ENV is "dev" or "development". If it doesn't exist,
 * it assumes development.
 * @returns  whether or not env is considered development
 */
export function envisdev(): boolean {
   // if NODE_ENV doesnt exist, assume development
   // if it does, check for mode "dev" or "development"
   // then configure using dotenv
   return !checkenv("NODE_ENV") || process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "development";
}

// /**
//  * checks if process.env.NODE_ENV is NOT "dev" or "development". If it doesn't exist,
//  * it assumes development. NODE_ENV could be something else, if its not "dev" or "development"
//  * it's considered production.
//  *
//  * see {@link envisdev}
//  *
//  * @returns whether or not env is considered production
//  */
// export function envisprod(): boolean {
//    return !envisdev();
// }

// /**
//  * put in any amount of arrays, this method will get a random number between 0 and firstarray.length - 1,
//  * and return an array with that numbered element from each of the arrays.
//  *
//  * Example:
//  * ```typescript
//  * // input arrays
//  * const arr1: Array<string> = ["a1", "a2", "a3", "a4", "a5"];
//  * const arr2: Array<string> = ["b1", "b2", "b3", "b4", "b5"];
//  * const arr3: Array<string> = ["c1", "c2", "c3", "c4", "c5"];
//  * const arr4: Array<string> = ["d1", "d2", "d3", "d4", "d5"];
//  * const arr5: Array<string> = ["e1", "e2", "e3", "e4", "e5"];
//  *
//  * // random number, this is actually random but manually set for demonstration
//  * const randnum: number = 2;
//  *
//  * // call method like so
//  * randfromarray<string>(arr1, arr2, arr3, arr4, arr5);
//  * // returns ["a3", "b3", "c3", "d3", "e3"]
//  * ```
//  *
//  * @param arrs arrays (should be all the same length) to get random from
//  * @returns array of elements picked from arrays (length is equal to amount of arrays passed in)
//  */
// export function randfromarray<T>(...arrs: Array<Array<T>>): Array<T> {
//    if (arrs.length === 0) return [];

//    const randnum: number = Math.floor(Math.random() * arrs[0].length);
//    const randarr: Array<T> = [];
//    for (const arr of arrs) if (arr.length > randnum) randarr.push(arr[randnum]);

//    return randarr;
// }

/* returns a promise that resolves after `s` seconds */
export const wait = (s: number) => new Promise<void>(res => setTimeout(res, s * 1000));
