FROM mcr.microsoft.com/playwright:v1.64.1-noble@sha256:2f05f8a734509a7b3f26a912639488ee08f58a7b292d14d62271bcff9038768f
WORKDIR /opt/trusted
COPY . .
RUN npm ci && npx playwright install chrome && node node_modules/typescript/bin/tsc -p tsconfig.media.json && node -e "require('fs').writeFileSync('.generated/media-tools/package.json', JSON.stringify({type:'commonjs'}))"
ENV NEXT_TELEMETRY_DISABLED=1
USER 1000:1000
