/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_URI = 'mongodb+srv://Auto_db_trust:aMdkHcFVaR5VzB5V@autotrust.ho7gcej.mongodb.net/';

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }
  if (mongoose.connection.readyState === 2) {
    let attempts = 0;
    while (mongoose.connection.readyState === 2 && attempts < 10) {
      await new Promise((r) => setTimeout(r, 100));
      attempts++;
    }
    if (mongoose.connection.readyState === 1) {
      return mongoose;
    }
  }

  const uri =
    process.env.MONGO_URI ||
    process.env['mongodb+srv://Auto_db_trust:aMdkHcFVaR5VzB5V@autotrust.ho7gcej.mongodb.net/'] ||
    DEFAULT_URI;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    // Log the exact error message
    console.log(err.message);
    if (process.env.EXIT_ON_DB_FAIL === 'true') {
      console.error(err.message);
      process.exit(1);
    }
    return null;
  }
}

/**
 * Health check endpoint handler
 * Returns { status: "ok", db: "connected" } or "disconnected" using mongoose.connection.readyState
 */
export const healthCheck = (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'ok',
    db: isConnected ? 'connected' : 'disconnected',
  });
};

export function isConnected() {
  return mongoose.connection.readyState === 1;
}

// Allow standalone execution for connection verification
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/^[./]+/, ''))) {
  connectDB().then((conn) => {
    if (!conn) {
      process.exit(1);
    }
  });
}

export default connectDB;
