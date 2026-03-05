const LoadingSpinner = ({ size = "md", text }) => {
  const sizes = {
    sm: "w-3.5 h-3.5 border-[2px]",
    md: "w-5 h-5 border-2",
    lg: "w-8 h-8 border-[3px]",
  };

  return (
    <div className="flex items-center justify-center gap-2.5">
      <div
        className={`${sizes[size]} border-zinc-600 border-t-white rounded-full animate-spin`}
      />
      {text && (
        <span className="text-sm text-zinc-400 animate-pulse">{text}</span>
      )}
    </div>
  );
};

export default LoadingSpinner;