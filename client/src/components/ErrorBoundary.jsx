import { useState, useEffect } from "react";

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  // Handle runtime errors
  useEffect(() => {
    const handleError = (event) => {
      console.error("Error caught:", event.error);
      setHasError(true);
      setError(event.error?.message || "An unexpected error occurred");
    };

    window.addEventListener("error", handleError);

    const handleUnhandledRejection = (event) => {
      console.error("Unhandled rejection:", event.reason);
      setHasError(true);
      setError(event.reason?.message || "An unexpected error occurred");
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="text-center max-w-md">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4v2m-6-4a9 9 0 1118 0 9 9 0 01-18 0z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-slate-600 mb-6">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          {error && (
            <p className="text-xs text-slate-500 mb-6 p-3 bg-slate-100 rounded-lg font-mono break-words">
              {error}
            </p>
          )}
          <button
            onClick={() => {
              setHasError(false);
              setError(null);
              window.location.reload();
            }}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-slate-900 transition-all"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ErrorBoundary;
