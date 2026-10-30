/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import cors from 'cors';
import { healthCheck, connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(cors());

  // Database connection check middleware (reuses warm connections or establishes new one)
  app.use(async (req, res, next) => {
    try {
      await connectDB();
    } catch (err) {
      console.log('[DB Middleware Error]', err?.message || err);
    }
    next();
  });

  app.use((req, res, next) => {
    if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
      return next();
    }
    return express.json()(req, res, next);
  });

  // Health check: returns { status: "ok", db: "connected" } or "disconnected" using mongoose.connection.readyState
  app.get(['/api/health', '/health'], healthCheck);

  // Mount API endpoints (both with and without /api prefix for Vercel serverless rewrites)
  app.use(['/api/auth', '/auth'], authRoutes);
  app.use(['/api/vehicles', '/vehicles'], vehicleRoutes);
  app.use(['/api/services', '/services'], serviceRoutes);
  app.use(['/api/orders', '/orders'], orderRoutes);

  // 404 handler for API routes
  app.use(['/api/*', '/auth/*', '/vehicles/*', '/services/*', '/orders/*'], (req, res) => {
    res.status(404).json({
      success: false,
      message: `API endpoint ${req.originalUrl} not found`,
    });
  });

  // Central error handler
  app.use(errorHandler);

  return app;
}
