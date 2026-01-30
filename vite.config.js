import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(function (_a) {
    var mode = _a.mode;
    return ({
        plugins: [react()],
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                        'three-vendor': ['three', 'postprocessing'],
                    },
                    // Obfuscate code structure
                    format: 'es',
                    compact: true,
                },
            },
            chunkSizeWarningLimit: 1000,
            minify: 'esbuild', // Use esbuild (faster, built-in)
            sourcemap: mode === 'development', // Source maps only in dev
            // Remove console and debugger statements in production only
            esbuild: {
                drop: mode === 'production' ? ['console', 'debugger'] : [],
                legalComments: 'none',
            },
        },
        optimizeDeps: {
            exclude: ['face-api.js'],
        },
        server: {
            headers: {
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'X-XSS-Protection': '1; mode=block',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
                'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
            },
        },
    });
});
