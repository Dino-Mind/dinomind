/* eslint-disable @typescript-eslint/no-explicit-any */
type ErrorHandlerOptions<T> = {
  logToConsole?: boolean; // Default: true
  notifyUser?: boolean; // Default: false
  fallbackValue?: T | null; // Default: null
};

/**
 * Handles errors consistently across the application.
 * @param error - The error object or message.
 * @param options - Configuration options for error handling.
 * @returns The fallback value if provided.
 */
export const handleError = <T = any>(
  error: any,
  options: ErrorHandlerOptions<T> = {
    logToConsole: true,
    notifyUser: false,
    fallbackValue: null,
  }
): T => {
  const { logToConsole, notifyUser, fallbackValue } = options;

  if (logToConsole) {
    console.error("Error:", error);
  }

  if (notifyUser) {
    alert("An unexpected error occurred. Please try again.");
  }

  return fallbackValue as T;
};
