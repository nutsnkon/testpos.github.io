import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: { // <-- นี่สำหรับ 'dev'
        port: 3000,
        host: '0.0.0.0',
      },

      // vvvvvvvvvvvvvvvv เพิ่มส่วนนี้ vvvvvvvvvvvvvvvv
      preview: { 
        allowedHosts: [
          'testpos-github-io.onrender.com'
        ]
      },
      // ^^^^^^^^^^^^^^^^ สิ้นสุดส่วนที่เพิ่ม ^^^^^^^^^^^^^^^^

      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});