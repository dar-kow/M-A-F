import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Umożliwia nasłuchiwanie na wszystkich interfejsach (0.0.0.0)
    watch: {
      usePolling: true, // Włącz polling
      interval: 100, // Ustaw interwał sprawdzania zmian na 100 ms (możesz dostosować)
    },
  },
});
