interface ErpError {
  success: boolean;
  message: string;
  severity: string;
  result?: null;
  service?: string;
  error?: Error;
}

export interface ApiErrorResponse {
  data?: any | null;
  message: string;
  severity?: "error" | "warning" | "info";
  success: boolean; // It's important to set this to 'false' for type-checking
  type?: string;
}
