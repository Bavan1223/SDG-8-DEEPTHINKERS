/* ============================================================
   AgriAgent – Request Validators
   Input validation helpers for route handlers
   ============================================================ */

import { Request, Response, NextFunction } from 'express';
import { sendBadRequest } from './response';

/** Validates that required query params are present */
export function requireQuery(fields: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    for (const field of fields) {
      if (!req.query[field]) {
        sendBadRequest(res, `Missing required query parameter: ${field}`);
        return;
      }
    }
    next();
  };
}

/** Validates that required body fields are present */
export function requireBody(fields: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    for (const field of fields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        sendBadRequest(res, `Missing required body field: ${field}`);
        return;
      }
    }
    next();
  };
}

/** Validates state is a non-empty string */
export function isValidState(state: unknown): state is string {
  return typeof state === 'string' && state.trim().length > 0;
}

/** Validates district is a non-empty string */
export function isValidDistrict(district: unknown): district is string {
  return typeof district === 'string' && district.trim().length > 0;
}

/** Validates land area is a positive number */
export function isValidArea(area: unknown): area is number {
  const n = Number(area);
  return !isNaN(n) && n > 0 && n <= 10000;
}
