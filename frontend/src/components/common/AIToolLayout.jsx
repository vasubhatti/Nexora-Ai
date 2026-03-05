const AIToolLayout = ({ title, description, cost, children }) => {
  return (
    <div className="p-4 lg:p-0 max-w-3xl mx-auto pt-14 lg:pt-5">
      <div className="mb-6 space-y-1">
        <h1 className="text-xl font-semibold text-white tracking-tight">
          {title}
        </h1>
        <p className="text-zinc-500 text-sm">
          {description}
          {cost && (
            <span className="ml-1.5 inline-flex items-center gap-1 text-zinc-600">
              · {cost}
            </span>
          )}
        </p>
      </div>
      {children}
    </div>
  );
};

export default AIToolLayout;