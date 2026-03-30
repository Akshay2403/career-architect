const EmptyState = ({
  icon = "📄",
  title,
  message,
  className = "",
  variant = "default",
}) => {
  const variantClasses = {
    default:
      "bg-slate-50 p-12 rounded-[2rem] border-2 border-dashed border-slate-200",
    search:
      "bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200",
    compact:
      "bg-slate-50 p-12 rounded-[2rem] border-2 border-dashed border-slate-100",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${variantClasses[variant]} ${className}`}
    >
      {icon && <div className="text-4xl mb-4">{icon}</div>}
      {title && (
        <p
          className={`font-semibold mb-1 ${
            variant === "compact"
              ? "text-[10px] uppercase tracking-widest text-slate-400"
              : "text-sm text-slate-600"
          }`}
        >
          {title}
        </p>
      )}
      {message && (
        <p
          className={`text-slate-400 ${
            variant === "compact"
              ? "text-[10px] font-bold uppercase tracking-widest"
              : "text-xs mt-1"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default EmptyState;
