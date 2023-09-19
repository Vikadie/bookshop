import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        manifest: true,
        outDir: "dist",
        assetsDir: "static",
    },
    plugins: [react()],
    // server: {
    //     proxy: {
    //         "": {
    //             target: [
    //                 "http://localhost:5173",
    //                 "http://127.0.0.1:8000",
    //                 // "https://mravolak-bookshop-ccd79b877dad.herokuapp.com",
    //                 // "https://web-production-2b33.up.railway.app",
    //                 // Add more backend URLs as needed
    //             ],
    //             changeOrigin: true, // This is important for proper proxying
    //         },
    //     },
    // },
});
