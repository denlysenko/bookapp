export interface ApiError {
  message?: string;
  extensions?: {
    errors?: Record<string, { message: string }>;
  };
}
