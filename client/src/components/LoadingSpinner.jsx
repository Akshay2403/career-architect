const LoadingSpinner = ({
  size = "medium",
  message = "Loading...",
  className = "",
}) => {
  const sizeClasses = {
    small: "h-6 w-6 border-2",
    medium: "h-8 w-8 border-2",
    large: "h-12 w-12 border-4",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-slate-200 border-t-indigo-600 ${sizeClasses[size]} mb-4`}
      ></div>
      {message && (
        <p className="text-slate-500 font-semibold text-sm tracking-wide">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
