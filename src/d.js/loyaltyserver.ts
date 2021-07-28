import http from "http";
import { Sani } from "./bot";
import { galaconid, loyaltyrole } from "./ids";

export async function startServer(port: number, sani: Sani) {
   const server = await createServer(port, async req => {
      try {
         const galacon = await sani.bot.guilds.fetch(galaconid);
         const members = await galacon.members.fetch();

         // case sensitive check first, if cant find then insensitive check in case
         let memberfindres = members.filter(member => member.user.username === req.username && member.user.discriminator === req.discriminator);
         if (memberfindres.size !== 1) memberfindres = members.filter(member => member.user.username.toUpperCase() === req.username.toUpperCase() && member.user.discriminator === req.discriminator);
         if (memberfindres.size !== 1) return { code: 500, data: "could not find user" };

         const member = memberfindres.array()[0];
         await member.fetch(true); // force update with latest info

         const hasrole = member.roles.cache.has(loyaltyrole);
         if (req.action === "grant") {
            if (!hasrole) await member.roles.add(loyaltyrole);
            else return { code: 304, data: "member already has the role"};
         } else {
            // req.action === "revoke"
            if (hasrole) await member.roles.remove(loyaltyrole);
            else return { code: 304, data: "member already doesn't have the role" };
         }

         return { code: 200 };
      } catch (err: unknown) {
         console.log(err);
         return { code: 500, data: "oops! something went horribly wrong"};
      };
   });

   return {
      stop: () => {
         return new Promise<void>((res, rej) => server.close(err => err ? res(): rej(err)));
      }
   };
}

function finaliserequest(data: metadata, req: http.IncomingMessage, res: http.ServerResponse) {
   data.headers && Object.entries(data.headers).forEach(([header, value]) => res.setHeader(header, value));
   res.writeHead(data.code);
   data.data && res.write(data.data);
   res.end();
}

/**
 * represents data that functions should return when they process a request
 * copy/pasted from some other project of mine lol - autumn
 */
type metadata = {
   code: number;
   headers?: Record<string, string | number | ReadonlyArray<string>>;
   data?: any;
};

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
type HttpMethod = "POST";
type UrlAndMethod = {
   url: string;
   method: HttpMethod;
};

function checkrequest(req: http.IncomingMessage): metadata | UrlAndMethod {
   if (!req.url || !req.method) return { code: 400 };

   const m = req.method.toUpperCase();
   if (m !== "POST" || req.url !== "/loyalty-role") return { code: 400 };

   return { url: req.url, method: m };
}

type UserAndAction = {
   /** whole thing, ex Autumn Blaze#2864 */
   user: string;
   /** username, ex Autumn Blaze */
   username: string;
   /** discriminator, ex. 2864 */
   discriminator: string;
   action: "grant" | "revoke";
};

const formatIncorrectError = (msg?: string): metadata => ({
   code: 400,
   data: `${msg ? msg + "\n\n" : ""}format: <grant | revoke> <username>#<discriminator>\nex: "grant Autumn Blaze#2864"\nex. "revoke Autumn Blaze#2864"`
});

function getUserAndAction(header: string): UserAndAction | metadata {
   // example: "grant Autumn Blaze#2864"
   // example: "revoke Autumn Blaze#2864"

   const firstSpace = header.indexOf(" ");
   if (firstSpace === -1) return formatIncorrectError();

   const action = header.substring(0, firstSpace);
   if (action !== "grant" && action !== "revoke") return formatIncorrectError(`unrecognised action: ${action}`);

   const user = header.substring(firstSpace + 1);
   const lastHash = user.lastIndexOf("#");
   console.log(lastHash);
   if (lastHash === -1) return formatIncorrectError("invalid user format, missing \"#\"");
   const username = user.substring(0, lastHash);
   const discriminator = user.substring(lastHash + 1);
   console.log(discriminator);
   if (discriminator.length !== 4 || isNaN(Number(discriminator))) return formatIncorrectError(`invalid discriminator: ${discriminator}`);

   return { user, username, discriminator, action };
}

async function createServer(port: number, cb: (user: UserAndAction) => Promise<metadata>) {
   const server = http.createServer(async (req, res) => {
      try {
         const checked = checkrequest(req);
         if ("code" in checked) return finaliserequest(checked, req, res);

         if (!req.headers.action) return finaliserequest({ code: 400, data: "Missing action header" }, req, res);
         const user = getUserAndAction(Array.isArray(req.headers.action) ? req.headers.action.join("") : req.headers.action);
         if ("code" in user) return finaliserequest(user, req, res); // user isn't a user lol
         const cbres = await cb(user);

         finaliserequest(cbres, req, res);
      } catch (err: unknown) { console.error(err); }
   });

   await new Promise<void>(res => server.listen(port, res));
   return server;
}
