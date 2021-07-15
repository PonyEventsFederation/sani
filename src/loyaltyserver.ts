import http from "http";

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
   user: string;
   username: string;
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
   const lastHash = header.lastIndexOf("#");
   if (lastHash === -1) return formatIncorrectError("invalid user format, missing \"#\"");
   const username = user.substring(0, lastHash);
   const discriminator = user.substring(lastHash + 1);
   if (discriminator.length !== 4 || isNaN(Number(discriminator))) return formatIncorrectError(`invalid discriminator: ${discriminator}`);

   return { user, username, discriminator, action };
}

export async function createServer(port: number, cb: (user: UserAndAction) => Promise<void>) {
   const server = http.createServer(async (req, res) => {
      try {
         const checked = checkrequest(req);
         if ("code" in checked) return finaliserequest(checked, req, res);

         if (!req.headers.action) return finaliserequest({ code: 400, data: "Missing action header" }, req, res);
         const user = getUserAndAction(Array.isArray(req.headers.action) ? req.headers.action.join("") : req.headers.action);
         if ("code" in user) return finaliserequest(user, req, res); // user isn't a user lol
         void cb(user);
      } catch (err: unknown) { console.error(err); }
   });

   await new Promise<void>(res => server.listen(port, res));
   return server;
}
