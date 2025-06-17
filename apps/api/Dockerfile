FROM oven/bun:1.2

WORKDIR /app

RUN bun add -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build TypeScript
RUN pnpm run build

# Expose the port your app runs on
EXPOSE 3000

# Start the server
CMD ["bun", "dist/index.js"]
