# sani soda bot
Hi! I see you are interested in this project or something

How to run (development mode):
1. `git clone https://github.com/PCelestia/sani.git` then `cd sani` (pretty standard stuff lol)
2. `npm install` (still standard stuff lol)
3. create a `.env` file at the root of the `sani` repository, and put one line containing `TOKEN=abcdefgg` in it. Replace `abcdefgg` with your bot token. It's ok if your text editor inserts a newline at the end of the file.
4. run `npm run build` to compile the typescript to javascript. then run `npm run bot` to run it. Alternatively, run `npm run buildandbot` to build and run the bot.

How to run (production mode):
1. `git clone https://github.com/PCelestia/sani.git` then `cd sani` (pretty standard stuff lol)
2. `npm install` (still standard stuff lol)
3. set the environment variables `TOKEN` and `NODE_ENV` however you want. `TOKEN` is your bot token, and `NODE_ENV` should be `production` or `prod`.
4. run `npm run build` to build the bot, then run `npm prune` to remove dev dependencies that are not needed in production.
5. to start the bot run `npm run bot`
