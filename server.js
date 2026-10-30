/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import http from 'http';
import fs from 'fs';
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
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : (config.port || 3000);

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
    const indexPath = path.resolve(distPath, 'index.html');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(503).send('AutoTrust build in progress. Please refresh.');
        }
      });
      console.log('[AutoTrust] Serving production static build from dist.');
    } else {
      console.warn('[AutoTrust] dist directory not found. Please run npm run build.');
    }
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[AutoTrust] Server running at http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('[AutoTrust] Failed to start server:', err);
  process.exit(1);
});
