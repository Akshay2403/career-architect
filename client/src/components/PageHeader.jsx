const PageHeader = ({
  title,
  subtitle,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
}) => {
  return (
    <div className={`mb-10 ${className}`}>
      <h1
        className={`text-3xl font-black text-slate-900 tracking-tight ${titleClassName}`}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className={`text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2 ${subtitleClassName}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageHeader;
