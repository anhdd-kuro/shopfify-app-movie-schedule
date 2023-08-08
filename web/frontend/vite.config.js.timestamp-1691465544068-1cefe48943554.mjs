// vite.config.js
import { defineConfig } from "file:///Users/kuro/Documents/kuro/coding/shopify/shopf-app-1/web/frontend/node_modules/vite/dist/node/index.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import react from "file:///Users/kuro/Documents/kuro/coding/shopify/shopf-app-1/web/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tsconfigPaths from "file:///Users/kuro/Documents/kuro/coding/shopify/shopf-app-1/web/frontend/node_modules/vite-tsconfig-paths/dist/index.mjs";
import svgr from "file:///Users/kuro/Documents/kuro/coding/shopify/shopf-app-1/web/frontend/node_modules/vite-plugin-svgr/dist/index.js";
var __vite_injected_original_import_meta_url = "file:///Users/kuro/Documents/kuro/coding/shopify/shopf-app-1/web/frontend/vite.config.js";
if (process.env.npm_lifecycle_event === "build" && !process.env.CI && !process.env.SHOPIFY_API_KEY) {
  console.warn(
    "\nBuilding the frontend app without an API key. The frontend build will not run without an API key. Set the SHOPIFY_API_KEY environment variable when running the build command.\n"
  );
}
var proxyOptions = {
  target: `http://127.0.0.1:${process.env.BACKEND_PORT}`,
  changeOrigin: false,
  secure: true,
  ws: false
};
var host = process.env.HOST ? process.env.HOST.replace(/https?:\/\//, "") : "localhost";
var hmrConfig;
if (host === "localhost") {
  hmrConfig = {
    protocol: "ws",
    host: "localhost",
    port: 64999,
    clientPort: 64999
  };
} else {
  hmrConfig = {
    protocol: "wss",
    host,
    port: process.env.FRONTEND_PORT,
    clientPort: 443
  };
}
var vite_config_default = defineConfig({
  root: dirname(fileURLToPath(__vite_injected_original_import_meta_url)),
  plugins: [tsconfigPaths(), svgr(), react()],
  define: {
    "process.env.SHOPIFY_API_KEY": JSON.stringify(process.env.SHOPIFY_API_KEY)
  },
  resolve: {
    preserveSymlinks: true
  },
  server: {
    host: "localhost",
    port: process.env.FRONTEND_PORT,
    hmr: hmrConfig,
    proxy: {
      "^/(\\?.*)?$": proxyOptions,
      "^/api(/|(\\?.*)?$)": proxyOptions
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMva3Vyby9Eb2N1bWVudHMva3Vyby9jb2Rpbmcvc2hvcGlmeS9zaG9wZi1hcHAtMS93ZWIvZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9rdXJvL0RvY3VtZW50cy9rdXJvL2NvZGluZy9zaG9waWZ5L3Nob3BmLWFwcC0xL3dlYi9mcm9udGVuZC92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMva3Vyby9Eb2N1bWVudHMva3Vyby9jb2Rpbmcvc2hvcGlmeS9zaG9wZi1hcHAtMS93ZWIvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgZGlybmFtZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJ1xuaW1wb3J0IGh0dHBzIGZyb20gJ2h0dHBzJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocydcbmltcG9ydCBzdmdyIGZyb20gJ3ZpdGUtcGx1Z2luLXN2Z3InXG5cbmlmIChcbiAgcHJvY2Vzcy5lbnYubnBtX2xpZmVjeWNsZV9ldmVudCA9PT0gJ2J1aWxkJyAmJlxuICAhcHJvY2Vzcy5lbnYuQ0kgJiZcbiAgIXByb2Nlc3MuZW52LlNIT1BJRllfQVBJX0tFWVxuKSB7XG4gIGNvbnNvbGUud2FybihcbiAgICAnXFxuQnVpbGRpbmcgdGhlIGZyb250ZW5kIGFwcCB3aXRob3V0IGFuIEFQSSBrZXkuIFRoZSBmcm9udGVuZCBidWlsZCB3aWxsIG5vdCBydW4gd2l0aG91dCBhbiBBUEkga2V5LiBTZXQgdGhlIFNIT1BJRllfQVBJX0tFWSBlbnZpcm9ubWVudCB2YXJpYWJsZSB3aGVuIHJ1bm5pbmcgdGhlIGJ1aWxkIGNvbW1hbmQuXFxuJ1xuICApXG59XG5cbmNvbnN0IHByb3h5T3B0aW9ucyA9IHtcbiAgdGFyZ2V0OiBgaHR0cDovLzEyNy4wLjAuMToke3Byb2Nlc3MuZW52LkJBQ0tFTkRfUE9SVH1gLFxuICBjaGFuZ2VPcmlnaW46IGZhbHNlLFxuICBzZWN1cmU6IHRydWUsXG4gIHdzOiBmYWxzZSxcbn1cblxuY29uc3QgaG9zdCA9IHByb2Nlc3MuZW52LkhPU1RcbiAgPyBwcm9jZXNzLmVudi5IT1NULnJlcGxhY2UoL2h0dHBzPzpcXC9cXC8vLCAnJylcbiAgOiAnbG9jYWxob3N0J1xuXG5sZXQgaG1yQ29uZmlnXG5pZiAoaG9zdCA9PT0gJ2xvY2FsaG9zdCcpIHtcbiAgaG1yQ29uZmlnID0ge1xuICAgIHByb3RvY29sOiAnd3MnLFxuICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgIHBvcnQ6IDY0OTk5LFxuICAgIGNsaWVudFBvcnQ6IDY0OTk5LFxuICB9XG59IGVsc2Uge1xuICBobXJDb25maWcgPSB7XG4gICAgcHJvdG9jb2w6ICd3c3MnLFxuICAgIGhvc3Q6IGhvc3QsXG4gICAgcG9ydDogcHJvY2Vzcy5lbnYuRlJPTlRFTkRfUE9SVCxcbiAgICBjbGllbnRQb3J0OiA0NDMsXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcm9vdDogZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpLFxuICBwbHVnaW5zOiBbdHNjb25maWdQYXRocygpLCBzdmdyKCksIHJlYWN0KCldLFxuXG4gIGRlZmluZToge1xuICAgICdwcm9jZXNzLmVudi5TSE9QSUZZX0FQSV9LRVknOiBKU09OLnN0cmluZ2lmeShwcm9jZXNzLmVudi5TSE9QSUZZX0FQSV9LRVkpLFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgcHJlc2VydmVTeW1saW5rczogdHJ1ZSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgcG9ydDogcHJvY2Vzcy5lbnYuRlJPTlRFTkRfUE9SVCxcbiAgICBobXI6IGhtckNvbmZpZyxcbiAgICBwcm94eToge1xuICAgICAgJ14vKFxcXFw/LiopPyQnOiBwcm94eU9wdGlvbnMsXG4gICAgICAnXi9hcGkoL3woXFxcXD8uKik/JCknOiBwcm94eU9wdGlvbnMsXG4gICAgfSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdYLFNBQVMsb0JBQW9CO0FBQ3JaLFNBQVMsZUFBZTtBQUN4QixTQUFTLHFCQUFxQjtBQUU5QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxVQUFVO0FBTjJOLElBQU0sMkNBQTJDO0FBUTdSLElBQ0UsUUFBUSxJQUFJLHdCQUF3QixXQUNwQyxDQUFDLFFBQVEsSUFBSSxNQUNiLENBQUMsUUFBUSxJQUFJLGlCQUNiO0FBQ0EsVUFBUTtBQUFBLElBQ047QUFBQSxFQUNGO0FBQ0Y7QUFFQSxJQUFNLGVBQWU7QUFBQSxFQUNuQixRQUFRLG9CQUFvQixRQUFRLElBQUksWUFBWTtBQUFBLEVBQ3BELGNBQWM7QUFBQSxFQUNkLFFBQVE7QUFBQSxFQUNSLElBQUk7QUFDTjtBQUVBLElBQU0sT0FBTyxRQUFRLElBQUksT0FDckIsUUFBUSxJQUFJLEtBQUssUUFBUSxlQUFlLEVBQUUsSUFDMUM7QUFFSixJQUFJO0FBQ0osSUFBSSxTQUFTLGFBQWE7QUFDeEIsY0FBWTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLEVBQ2Q7QUFDRixPQUFPO0FBQ0wsY0FBWTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1Y7QUFBQSxJQUNBLE1BQU0sUUFBUSxJQUFJO0FBQUEsSUFDbEIsWUFBWTtBQUFBLEVBQ2Q7QUFDRjtBQUVBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU0sUUFBUSxjQUFjLHdDQUFlLENBQUM7QUFBQSxFQUM1QyxTQUFTLENBQUMsY0FBYyxHQUFHLEtBQUssR0FBRyxNQUFNLENBQUM7QUFBQSxFQUUxQyxRQUFRO0FBQUEsSUFDTiwrQkFBK0IsS0FBSyxVQUFVLFFBQVEsSUFBSSxlQUFlO0FBQUEsRUFDM0U7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLGtCQUFrQjtBQUFBLEVBQ3BCO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNLFFBQVEsSUFBSTtBQUFBLElBQ2xCLEtBQUs7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNMLGVBQWU7QUFBQSxNQUNmLHNCQUFzQjtBQUFBLElBQ3hCO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
