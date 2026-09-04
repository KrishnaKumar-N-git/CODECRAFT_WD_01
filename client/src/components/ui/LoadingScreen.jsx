import { Loader2 } from 'lucide-react';

/**
 * Full-page loading spinner shown during initial auth check.
 */
const LoadingScreen = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      {/* Glowing orb */}
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-brand-600/20 animate-pulse-slow" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
        </div>
      </div>
      <p className="text-slate-400 text-sm font-medium tracking-wide">Loading…</p>
    </div>
  </div>
);

export default LoadingScreen;
