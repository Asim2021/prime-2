import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {

  const serverPort =  3001;
  const socketUrl = `ws://localhost:5001`;

  return {
    plugins: [react(), tsconfigPaths()],
    optimizeDeps: {
      esbuildOptions: {
        target: "es2020",
      },
    },
    base: "/",
    server: {
      port: serverPort,
      strictPort: true,
      host: true, // binds to 0.0.0.0
      //// use watch when running inside docker ////
      watch: {
        usePolling: true,
        interval: 100,
      },
      hmr: {
        host: "localhost",
        overlay: true,
        protocol: "ws",
        port: serverPort,
        clientPort: serverPort,
      },
      proxy: {
        "/socket.io": {
          target: socketUrl,
          ws: true,
          rewriteWsOrigin: true,
        },
      },
    },
  };
});
