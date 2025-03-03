import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths() // dodaj plugin do obsługi aliasów z tsconfig
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@store': path.resolve(__dirname, './src/store'),
      '@app-types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      // '@hooks': path.resolve(__dirname, './src/hooks'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@styles': path.resolve(__dirname, './src/styles')
    }
  },
  server: {
    host: true,
    watch: {
      usePolling: true,
      interval: 100,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5005',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       // opcje dla scss jeśli są potrzebne
  //     },
  //   },
  // }
});