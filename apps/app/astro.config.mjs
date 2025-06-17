// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  devToolbar: {
    enabled: false,
  },

  output: "server",
  integrations: [react()],

  server: {
    host: "0.0.0.0",
  },

  adapter: node({
    mode: "standalone",
  }),
});
