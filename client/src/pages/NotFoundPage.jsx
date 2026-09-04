import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
    <div className="text-center animate-slide-up">
      {/* Big 404 */}
      <div className="relative mb-6 inline-block">
        <p className="text-[9rem] font-black text-slate-800 leading-none select-none">
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <AlertTriangle className="w-16 h-16 text-brand-500 animate-pulse-slow" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
      <p className="text-slate-400 mb-8 max-w-sm mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        id="notfound-home-btn"
      >
        <Home className="w-4 h-4" />
        Go home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
