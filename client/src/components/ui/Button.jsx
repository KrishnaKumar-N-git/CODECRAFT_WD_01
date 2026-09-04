import { Loader2 } from 'lucide-react';

/**
 * Generic button with loading state and variant support.
 */
const Button = ({
  children,
  isLoading = false,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const variantClass =
    variant === 'secondary'
      ? 'btn-secondary'
      : variant === 'danger'
      ? 'btn-danger'
      : 'btn-primary';

  return (
    <button
      className={`${variantClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Please wait…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
