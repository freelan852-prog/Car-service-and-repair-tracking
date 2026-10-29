/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function errorHandler(err, req, res, next) {
  console.log('[API Error]', err.message || err);

  const statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
    errors: err.errors || undefined,
  });
}
