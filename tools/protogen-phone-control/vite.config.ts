import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

let protogenIp = 'http://192.168.4.1'; // fallback

// A custom plugin to receive the IP from ESP32
const discoverPlugin = {
  name: 'protogen-discover',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      // ESP32 hits this to register its IP
      if (req.url.startsWith('/api/register?ip=')) {
        const ip = req.url.split('ip=')[1];
        if (ip) {
          protogenIp = `http://${ip}`;
          console.log(`[Discover] Protogen registered at ${protogenIp}`);
          res.statusCode = 200;
          res.end('OK');
          return;
        }
      }
      // Control panel hits this to get the IP
      if (req.url === '/api/get-ip') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ip: protogenIp }));
        return;
      }
      next();
    });
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), discoverPlugin],
  server: {
    host: true
  },
  preview: {
    host: true
  }
})
