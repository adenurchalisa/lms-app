import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { logout } from "./auth";

// Global error handler for React Query
const queryErrorHandler = (error) => {
  // Handle authentication errors globally
  if (error?.response?.status === 401 || error?.response?.status === 403) {
    toast.error("Session expired. Please login again.");
    logout();
    return;
  }

  // Handle other errors
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "An unexpected error occurred";
  toast.error("Error", {
    description: message,
  });
};

// Create a custom QueryClient with default error handling
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        onError: queryErrorHandler,
        retry: (failureCount, error) => {
          // Don't retry on authentication errors
          if (
            error?.response?.status === 401 ||
            error?.response?.status === 403
          ) {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      },
      mutations: {
        onError: queryErrorHandler,
        retry: (failureCount, error) => {
          // Don't retry on authentication errors
          if (
            error?.response?.status === 401 ||
            error?.response?.status === 403
          ) {
            return false;
          }
          // Don't retry mutations by default
          return false;
        },
      },
    },
  });
};
