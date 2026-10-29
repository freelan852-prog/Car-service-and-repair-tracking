/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/autotrust',
  jwtSecret: process.env.JWT_SECRET || 'autotrust_jwt_secret_dev_key_2026',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  stageIntervalSeconds: parseInt(process.env.STAGE_INTERVAL_SECONDS || '15', 10),
};
