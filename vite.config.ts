import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carrega as variáveis do arquivo .env (da raiz)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Importante para Capacitor: garante que os caminhos no index.html sejam relativos
    base: './',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      // Gera sourcemaps para facilitar o debug se o app crashar no Android
      sourcemap: true,
      // Melhora a compatibilidade com dispositivos Android mais antigos
      target: 'es2015',
    },
    define: {
      // Injeta as variáveis de ambiente no bundle final
      // Isso permite que services/geminiService.ts e supabaseClient.ts funcionem no APK
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY || env.GEMINI_API_KEY),
      'process.env.SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || env.SUPABASE_URL),
      'process.env.SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY),
      // Fornece um shim para process.env para evitar erros de referência
      'process.env': JSON.stringify(env)
    },
    resolve: {
      alias: {
        // Permite usar '@/' para se referir à raiz do projeto
        '@': path.resolve(__dirname, './'),
      },
    },
  };
});