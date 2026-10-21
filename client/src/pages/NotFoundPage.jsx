import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
    <div className="text-center animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-6">
        <AlertCircle size={36} className="text-primary-500" />
      </div>
      <h1 className="text-5xl font-extrabold text-slate-800 mb-2">404</h1>
      <p className="text-lg text-slate-500 mb-8">This page does not exist.</p>
      <Link to="/" className="btn-primary">
        <Home size={16} />
        Back to Home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
