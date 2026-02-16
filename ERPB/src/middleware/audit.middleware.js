import db from '../models/index.js';
import { logger } from '../utils/logger.js';

const AuditLog = db.audit_logs;

/**
 * Map HTTP methods to action types
 */
const METHOD_TO_ACTION = {
  POST: 'CREATE',
  PUT: 'UPDATE',
  PATCH: 'UPDATE',
  DELETE: 'DELETE',
};

/**
 * Extract resource ID from request path
 * Handles patterns like /api/v1/users/:id, /api/v1/purchase/orders/:id/approve
 */
const extractResourceId = (path, params) => {
  if (params?.id) return params.id;
  // Try to extract UUID from path
  const uuidMatch = path.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  return uuidMatch ? uuidMatch[ 0 ] : null;
};

/**
 * Sanitize payload to remove sensitive data
 */
const sanitizePayload = (body) => {
  if (!body || typeof body !== 'object') return null;

  const sensitiveFields = [ 'password', 'token', 'secret', 'accessToken', 'refreshToken' ];
  const sanitized = { ...body };

  sensitiveFields.forEach(field => {
    if (field in sanitized) {
      sanitized[ field ] = '[REDACTED]';
    }
  });

  return JSON.stringify(sanitized);
};

/**
 * Audit logging middleware
 * Logs all POST, PUT, PATCH, DELETE requests after response is sent
 */
const auditLog = (req, res, next) => {
  // Only audit mutation methods
  const action = METHOD_TO_ACTION[ req.method ];
  if (!action) {
    return next();
  }

  // Store original end function
  const originalEnd = res.end;

  // Override res.end to log after response
  res.end = function (chunk, encoding) {
    // Restore original end
    res.end = originalEnd;

    // Call original end
    res.end(chunk, encoding);

    // Log asynchronously (don't block response)
    setImmediate(async () => {
      try {
        await AuditLog.create({
          userId: req.user?.id || null,
          action,
          resource: req.originalUrl,
          resourceId: extractResourceId(req.originalUrl, req.params),
          payload: sanitizePayload(req.body),
          ip: req.ip || req.connection?.remoteAddress,
          userAgent: req.get('User-Agent')?.substring(0, 500),
          statusCode: res.statusCode,
        });
      } catch (error) {
        // Don't throw - just log the error
        logger.error('Audit log failed:', {
          error: error.message,
          resource: req.originalUrl,
        });
      }
    });
  };

  next();
};

export { auditLog };
