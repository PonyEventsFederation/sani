FROM debian:bullseye-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
		curl \
		software-properties-common \
	&& rm -rf /var/lib/apt/lists/*

# RUN useradd -m sani
# USER sani

ENV PNPM_VERSION 8.6.12
ENV PNPM_HOME /root/.local/share/pnpm
ENV PATH ${PATH}:/root/.local/share/pnpm
RUN curl -fsSL https://get.pnpm.io/install.sh | SHELL=`/bin/bash` sh - \
	&& pnpm -v

ENV NODE_VERSION 18.18.0
RUN pnpm env use -g ${NODE_VERSION}

WORKDIR /home/sani/app

COPY package.json package.json
COPY pnpm-lock.yaml pnpm-lock.yaml

RUN pnpm i --frozen-lockfile

COPY tsconfig.json tsconfig.json
COPY src src

RUN pnpm build

COPY .eslintrc.js .eslintrc.js
RUN pnpm lint \
	# cleanup
	&& rm .eslintrc.js tsconfig.json

RUN pnpm prune --prod && pnpm store prune

COPY LICENSE LICENSE

ENV NODE_ENV production

CMD ["node", "build/d.js"]
