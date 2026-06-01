export function Badge({ children, variant = 'primary', className = '' }) {
  const variantClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-gray-200 text-gray-900',
    success: 'bg-green-500 text-white',
    danger: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white'
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        px-2 py-1 text-xs font-semibold rounded-full
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
