/* ============================================================
   AgriAgent – Response Helpers
   Standardised API response builders
   ============================================================ */

import { Response } from 'express';

/** Send a successful response */
export function sendSuccess<T>(res: Response, data: T, statusCode = 200, message?: string): void {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/** Send an error response */
export function sendError(res: Response, message: string, statusCode = 500, error?: unknown): void {
  console.error(`[API Error] ${message}`, error);
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
  });
}

/** Send 404 not found */
export function sendNotFound(res: Response, resource = 'Resource'): void {
  sendError(res, `${resource} not found`, 404);
}

/** Send 400 bad request with validation details */
export function sendBadRequest(res: Response, message: string): void {
  sendError(res, message, 400);
}
