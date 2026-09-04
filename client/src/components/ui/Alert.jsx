import { AlertCircle, CheckCircle2, X } from 'lucide-react';

/**
 * Inline alert banner for success / error feedback.
 */
const Alert = ({ type = 'error', message, onDismiss }) => {
  if (!message) return null;

  const styles = {
    error: {
      wrapper: 'bg-red-900/30 border-red-500/40 text-red-300',
      icon: <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />,
    },
    success: {
      wrapper: 'bg-emerald-900/30 border-emerald-500/40 text-emerald-300',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />,
    },
  };

  const { wrapper, icon } = styles[type] || styles.error;

  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 p-3.5 rounded-xl border text-sm animate-fade-in ${wrapper}`}
    >
      {icon}
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="text-current opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
