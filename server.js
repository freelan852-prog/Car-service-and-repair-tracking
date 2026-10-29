/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createApp } from './server/app.js';
import { connectDB } from './server/config/db.js';
import { config } from './server/config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  await connectDB();

  const app = createApp();
  const isProd = process.env.NODE_ENV === 'production';
  const port = config.port || 3000;

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[AutoTrust] Vite development middleware mounted.');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('[AutoTrust] Serving production static build from dist.');
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[AutoTrust] Server running at http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('[AutoTrust] Failed to start server:', err);
  process.exit(1);
});
