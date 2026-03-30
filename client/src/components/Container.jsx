const Container = ({
  children,
  size = "default",
  className = "",
  ...props
}) => {
  const sizeClasses = {
    small: "max-w-4xl",
    default: "max-w-6xl",
    large: "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div
      className={`mx-auto px-6 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
