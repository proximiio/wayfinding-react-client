// vite.config.ts
import path from "path";
import { defineConfig, loadEnv } from "file:///C:/Dev/proximiio-wayfinding-react/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Dev/proximiio-wayfinding-react/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { VitePWA } from "file:///C:/Dev/proximiio-wayfinding-react/node_modules/vite-plugin-pwa/dist/index.js";
import viteCompression from "file:///C:/Dev/proximiio-wayfinding-react/node_modules/vite-plugin-compression/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Dev\\proximiio-wayfinding-react";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    // vite config
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        base: `${env.BASE_URL}/`,
        includeAssets: [
          "favicon.ico",
          "apple-touch-icon.png",
          "masked-icon.svg"
        ],
        workbox: {
          maximumFileSizeToCacheInBytes: 3e6
        },
        manifest: {
          name: env.VITE_APP_TITLE,
          short_name: "Wayfinding",
          description: "Wayfinding client demo application by Proximi.io",
          icons: [
            {
              src: `${env.BASE_URL}/android-chrome-192x192.png`,
              sizes: "192x192",
              type: "image/png",
              purpose: "favicon"
            },
            {
              src: `${env.BASE_URL}/android-chrome-512x512.png`,
              sizes: "512x512",
              type: "image/png",
              purpose: "favicon"
            },
            {
              src: `${env.BASE_URL}/apple-touch-icon.png`,
              sizes: "180x180",
              type: "image/png",
              purpose: "apple touch icon"
            },
            {
              src: `${env.BASE_URL}/maskable_icon.png`,
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable"
            }
          ],
          theme_color: "#ffffff",
          background_color: "#000000"
        }
      }),
      viteCompression()
    ],
    base: env.BASE_URL,
    preview: {
      port: +env.PORT,
      strictPort: true
    },
    server: {
      port: +env.PORT,
      strictPort: true,
      host: true,
      origin: `http://127.0.0.1:${+env.PORT}`
    },
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    esbuild: {
      drop: ["console", "debugger"]
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            proximiio: ["proximiio-js-library"],
            react: [
              "react",
              "react-dom",
              "react-country-flag",
              "react-i18next",
              "react-icons",
              "react-use"
            ],
            radix: [
              "@radix-ui/react-dialog",
              "@radix-ui/react-dropdown-menu",
              "@radix-ui/react-popover",
              "@radix-ui/react-slot",
              "@radix-ui/react-toggle",
              "@radix-ui/react-toggle-group",
              "@radix-ui/react-tooltip"
            ],
            geolib: ["geolib"],
            framer: ["framer-motion"]
          }
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxEZXZcXFxccHJveGltaWlvLXdheWZpbmRpbmctcmVhY3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXERldlxcXFxwcm94aW1paW8td2F5ZmluZGluZy1yZWFjdFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovRGV2L3Byb3hpbWlpby13YXlmaW5kaW5nLXJlYWN0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJztcclxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSc7XHJcbmltcG9ydCB2aXRlQ29tcHJlc3Npb24gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xyXG5cdC8vIExvYWQgZW52IGZpbGUgYmFzZWQgb24gYG1vZGVgIGluIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LlxyXG5cdC8vIFNldCB0aGUgdGhpcmQgcGFyYW1ldGVyIHRvICcnIHRvIGxvYWQgYWxsIGVudiByZWdhcmRsZXNzIG9mIHRoZSBgVklURV9gIHByZWZpeC5cclxuXHRjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKTtcclxuXHRyZXR1cm4ge1xyXG5cdFx0Ly8gdml0ZSBjb25maWdcclxuXHRcdHBsdWdpbnM6IFtcclxuXHRcdFx0cmVhY3QoKSxcclxuXHRcdFx0Vml0ZVBXQSh7XHJcblx0XHRcdFx0cmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXHJcblx0XHRcdFx0YmFzZTogYCR7ZW52LkJBU0VfVVJMfS9gLFxyXG5cdFx0XHRcdGluY2x1ZGVBc3NldHM6IFtcclxuXHRcdFx0XHRcdCdmYXZpY29uLmljbycsXHJcblx0XHRcdFx0XHQnYXBwbGUtdG91Y2gtaWNvbi5wbmcnLFxyXG5cdFx0XHRcdFx0J21hc2tlZC1pY29uLnN2ZycsXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHR3b3JrYm94OiB7XHJcblx0XHRcdFx0XHRtYXhpbXVtRmlsZVNpemVUb0NhY2hlSW5CeXRlczogMzAwMDAwMCxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdG1hbmlmZXN0OiB7XHJcblx0XHRcdFx0XHRuYW1lOiBlbnYuVklURV9BUFBfVElUTEUsXHJcblx0XHRcdFx0XHRzaG9ydF9uYW1lOiAnV2F5ZmluZGluZycsXHJcblx0XHRcdFx0XHRkZXNjcmlwdGlvbjogJ1dheWZpbmRpbmcgY2xpZW50IGRlbW8gYXBwbGljYXRpb24gYnkgUHJveGltaS5pbycsXHJcblx0XHRcdFx0XHRpY29uczogW1xyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0c3JjOiBgJHtlbnYuQkFTRV9VUkx9L2FuZHJvaWQtY2hyb21lLTE5MngxOTIucG5nYCxcclxuXHRcdFx0XHRcdFx0XHRzaXplczogJzE5MngxOTInLFxyXG5cdFx0XHRcdFx0XHRcdHR5cGU6ICdpbWFnZS9wbmcnLFxyXG5cdFx0XHRcdFx0XHRcdHB1cnBvc2U6ICdmYXZpY29uJyxcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdHNyYzogYCR7ZW52LkJBU0VfVVJMfS9hbmRyb2lkLWNocm9tZS01MTJ4NTEyLnBuZ2AsXHJcblx0XHRcdFx0XHRcdFx0c2l6ZXM6ICc1MTJ4NTEyJyxcclxuXHRcdFx0XHRcdFx0XHR0eXBlOiAnaW1hZ2UvcG5nJyxcclxuXHRcdFx0XHRcdFx0XHRwdXJwb3NlOiAnZmF2aWNvbicsXHJcblx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRzcmM6IGAke2Vudi5CQVNFX1VSTH0vYXBwbGUtdG91Y2gtaWNvbi5wbmdgLFxyXG5cdFx0XHRcdFx0XHRcdHNpemVzOiAnMTgweDE4MCcsXHJcblx0XHRcdFx0XHRcdFx0dHlwZTogJ2ltYWdlL3BuZycsXHJcblx0XHRcdFx0XHRcdFx0cHVycG9zZTogJ2FwcGxlIHRvdWNoIGljb24nLFxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0c3JjOiBgJHtlbnYuQkFTRV9VUkx9L21hc2thYmxlX2ljb24ucG5nYCxcclxuXHRcdFx0XHRcdFx0XHRzaXplczogJzUxMng1MTInLFxyXG5cdFx0XHRcdFx0XHRcdHR5cGU6ICdpbWFnZS9wbmcnLFxyXG5cdFx0XHRcdFx0XHRcdHB1cnBvc2U6ICdhbnkgbWFza2FibGUnLFxyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdHRoZW1lX2NvbG9yOiAnI2ZmZmZmZicsXHJcblx0XHRcdFx0XHRiYWNrZ3JvdW5kX2NvbG9yOiAnIzAwMDAwMCcsXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0fSksXHJcblx0XHRcdHZpdGVDb21wcmVzc2lvbigpLFxyXG5cdFx0XSxcclxuXHRcdGJhc2U6IGVudi5CQVNFX1VSTCxcclxuXHRcdHByZXZpZXc6IHtcclxuXHRcdFx0cG9ydDogK2Vudi5QT1JULFxyXG5cdFx0XHRzdHJpY3RQb3J0OiB0cnVlLFxyXG5cdFx0fSxcclxuXHRcdHNlcnZlcjoge1xyXG5cdFx0XHRwb3J0OiArZW52LlBPUlQsXHJcblx0XHRcdHN0cmljdFBvcnQ6IHRydWUsXHJcblx0XHRcdGhvc3Q6IHRydWUsXHJcblx0XHRcdG9yaWdpbjogYGh0dHA6Ly8xMjcuMC4wLjE6JHsrZW52LlBPUlR9YCxcclxuXHRcdH0sXHJcblx0XHRyZXNvbHZlOiB7XHJcblx0XHRcdGFsaWFzOiB7XHJcblx0XHRcdFx0J0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcclxuXHRcdFx0fSxcclxuXHRcdH0sXHJcblx0XHRlc2J1aWxkOiB7XHJcblx0XHRcdGRyb3A6IFsnY29uc29sZScsICdkZWJ1Z2dlciddLFxyXG5cdFx0fSxcclxuXHRcdGJ1aWxkOiB7XHJcblx0XHRcdHNvdXJjZW1hcDogdHJ1ZSxcclxuXHRcdFx0cm9sbHVwT3B0aW9uczoge1xyXG5cdFx0XHRcdG91dHB1dDoge1xyXG5cdFx0XHRcdFx0bWFudWFsQ2h1bmtzOiB7XHJcblx0XHRcdFx0XHRcdHByb3hpbWlpbzogWydwcm94aW1paW8tanMtbGlicmFyeSddLFxyXG5cdFx0XHRcdFx0XHRyZWFjdDogW1xyXG5cdFx0XHRcdFx0XHRcdCdyZWFjdCcsXHJcblx0XHRcdFx0XHRcdFx0J3JlYWN0LWRvbScsXHJcblx0XHRcdFx0XHRcdFx0J3JlYWN0LWNvdW50cnktZmxhZycsXHJcblx0XHRcdFx0XHRcdFx0J3JlYWN0LWkxOG5leHQnLFxyXG5cdFx0XHRcdFx0XHRcdCdyZWFjdC1pY29ucycsXHJcblx0XHRcdFx0XHRcdFx0J3JlYWN0LXVzZScsXHJcblx0XHRcdFx0XHRcdF0sXHJcblx0XHRcdFx0XHRcdHJhZGl4OiBbXHJcblx0XHRcdFx0XHRcdFx0J0ByYWRpeC11aS9yZWFjdC1kaWFsb2cnLFxyXG5cdFx0XHRcdFx0XHRcdCdAcmFkaXgtdWkvcmVhY3QtZHJvcGRvd24tbWVudScsXHJcblx0XHRcdFx0XHRcdFx0J0ByYWRpeC11aS9yZWFjdC1wb3BvdmVyJyxcclxuXHRcdFx0XHRcdFx0XHQnQHJhZGl4LXVpL3JlYWN0LXNsb3QnLFxyXG5cdFx0XHRcdFx0XHRcdCdAcmFkaXgtdWkvcmVhY3QtdG9nZ2xlJyxcclxuXHRcdFx0XHRcdFx0XHQnQHJhZGl4LXVpL3JlYWN0LXRvZ2dsZS1ncm91cCcsXHJcblx0XHRcdFx0XHRcdFx0J0ByYWRpeC11aS9yZWFjdC10b29sdGlwJyxcclxuXHRcdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdFx0Z2VvbGliOiBbJ2dlb2xpYiddLFxyXG5cdFx0XHRcdFx0XHRmcmFtZXI6IFsnZnJhbWVyLW1vdGlvbiddLFxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9LFxyXG5cdFx0fSxcclxuXHR9O1xyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyUixPQUFPLFVBQVU7QUFDNVMsU0FBUyxjQUFjLGVBQWU7QUFDdEMsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUN4QixPQUFPLHFCQUFxQjtBQUo1QixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUd6QyxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFDM0MsU0FBTztBQUFBO0FBQUEsSUFFTixTQUFTO0FBQUEsTUFDUixNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsUUFDUCxjQUFjO0FBQUEsUUFDZCxNQUFNLEdBQUcsSUFBSSxRQUFRO0FBQUEsUUFDckIsZUFBZTtBQUFBLFVBQ2Q7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFFBQ0Q7QUFBQSxRQUNBLFNBQVM7QUFBQSxVQUNSLCtCQUErQjtBQUFBLFFBQ2hDO0FBQUEsUUFDQSxVQUFVO0FBQUEsVUFDVCxNQUFNLElBQUk7QUFBQSxVQUNWLFlBQVk7QUFBQSxVQUNaLGFBQWE7QUFBQSxVQUNiLE9BQU87QUFBQSxZQUNOO0FBQUEsY0FDQyxLQUFLLEdBQUcsSUFBSSxRQUFRO0FBQUEsY0FDcEIsT0FBTztBQUFBLGNBQ1AsTUFBTTtBQUFBLGNBQ04sU0FBUztBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsY0FDQyxLQUFLLEdBQUcsSUFBSSxRQUFRO0FBQUEsY0FDcEIsT0FBTztBQUFBLGNBQ1AsTUFBTTtBQUFBLGNBQ04sU0FBUztBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsY0FDQyxLQUFLLEdBQUcsSUFBSSxRQUFRO0FBQUEsY0FDcEIsT0FBTztBQUFBLGNBQ1AsTUFBTTtBQUFBLGNBQ04sU0FBUztBQUFBLFlBQ1Y7QUFBQSxZQUNBO0FBQUEsY0FDQyxLQUFLLEdBQUcsSUFBSSxRQUFRO0FBQUEsY0FDcEIsT0FBTztBQUFBLGNBQ1AsTUFBTTtBQUFBLGNBQ04sU0FBUztBQUFBLFlBQ1Y7QUFBQSxVQUNEO0FBQUEsVUFDQSxhQUFhO0FBQUEsVUFDYixrQkFBa0I7QUFBQSxRQUNuQjtBQUFBLE1BQ0QsQ0FBQztBQUFBLE1BQ0QsZ0JBQWdCO0FBQUEsSUFDakI7QUFBQSxJQUNBLE1BQU0sSUFBSTtBQUFBLElBQ1YsU0FBUztBQUFBLE1BQ1IsTUFBTSxDQUFDLElBQUk7QUFBQSxNQUNYLFlBQVk7QUFBQSxJQUNiO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDUCxNQUFNLENBQUMsSUFBSTtBQUFBLE1BQ1gsWUFBWTtBQUFBLE1BQ1osTUFBTTtBQUFBLE1BQ04sUUFBUSxvQkFBb0IsQ0FBQyxJQUFJLElBQUk7QUFBQSxJQUN0QztBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1IsT0FBTztBQUFBLFFBQ04sS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQ3JDO0FBQUEsSUFDRDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1IsTUFBTSxDQUFDLFdBQVcsVUFBVTtBQUFBLElBQzdCO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTixXQUFXO0FBQUEsTUFDWCxlQUFlO0FBQUEsUUFDZCxRQUFRO0FBQUEsVUFDUCxjQUFjO0FBQUEsWUFDYixXQUFXLENBQUMsc0JBQXNCO0FBQUEsWUFDbEMsT0FBTztBQUFBLGNBQ047QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLFlBQ0Q7QUFBQSxZQUNBLE9BQU87QUFBQSxjQUNOO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBO0FBQUEsWUFDRDtBQUFBLFlBQ0EsUUFBUSxDQUFDLFFBQVE7QUFBQSxZQUNqQixRQUFRLENBQUMsZUFBZTtBQUFBLFVBQ3pCO0FBQUEsUUFDRDtBQUFBLE1BQ0Q7QUFBQSxJQUNEO0FBQUEsRUFDRDtBQUNELENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
