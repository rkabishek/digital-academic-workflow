import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Activity, Database, Server, RefreshCw } from 'lucide-react';

const dot = (color) => (
  <span className={`w-2.5 h-2.5 rounded-full ${color} inline-block`} />
);

const HealthStatus = () => {
  const [status, setStatus]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/health');
      setStatus(data.data);
    } catch (err) {
      setError(err.message || 'Cannot reach the backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-slate-800 dark:text-slate-100 shadow-sm transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
          <Activity size={18} className="text-emerald-500" />
          System Health
        </div>
        <button
          onClick={fetch}
          disabled={loading}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors disabled:opacity-40 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Refresh health status"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Checking backend…
        </div>
      )}

      {error && !loading && (
        <div className="text-sm text-red-500 dark:text-red-400 flex items-center gap-2">
          {dot('bg-red-500 animate-pulse')}
          {error}
          <span className="text-slate-400 ml-1">— Is the server running?</span>
        </div>
      )}

      {status && !loading && (
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Server size={14} className="text-blue-500" /> API Server
            </span>
            <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              {dot('bg-emerald-500')} Online
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Database size={14} className="text-blue-500" /> MongoDB Atlas
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              {status.database === 'connected'
                ? <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1.5">{dot('bg-emerald-500')} Connected</span>
                : <span className="text-amber-600 dark:text-amber-400 inline-flex items-center gap-1.5">{dot('bg-amber-500 animate-pulse')} {status.database}</span>}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Environment: <span className="font-semibold text-slate-700 dark:text-slate-300">{status.environment}</span></span>
            <span>{new Date(status.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthStatus;
