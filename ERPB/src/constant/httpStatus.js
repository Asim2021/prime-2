const HTTP_STATUS = {
  OK: 200, // Success - The request was successful
  CREATED: 201, // Success - The resource was successfully created
  ACCEPTED: 202, // Success - The request has been accepted for processing
  NO_CONTENT: 204, // Success - No content to send for this request

  BAD_REQUEST: 400, // Client Error - The request could not be understood or was missing required parameters
  UNAUTHORIZED: 401, // Client Error - Authentication failed or user does not have permissions
  FORBIDDEN: 403, // Client Error - Access is forbidden to the requested resource
  NOT_FOUND: 404, // Client Error - The requested resource could not be found
  METHOD_NOT_ALLOWED: 405, // Client Error - The method specified in the request is not allowed
  CONFLICT: 409, // Client Error - The request could not be completed due to a conflict
  UNPROCESSABLE_ENTITY: 422, // Client Error - The request was well-formed but unable to be followed due to semantic errors

  SERVER_ERROR: 500, // Server Error - A generic error message for unexpected issues on the server
  NOT_IMPLEMENTED: 501, // Server Error - The server does not support the functionality required to fulfill the request
  BAD_GATEWAY: 502, // Server Error - The server was acting as a gateway or proxy and received an invalid response
  SERVICE_UNAVAILABLE: 503, // Server Error - The server is not ready to handle the request
  GATEWAY_TIMEOUT: 504, // Server Error - The server was acting as a gateway and did not receive a timely response
};

export { HTTP_STATUS };
