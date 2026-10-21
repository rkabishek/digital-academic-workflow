import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  Clock,
  FolderGit2,
  Award,
  BookOpen,
  ShieldCheck,
  Activity,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/stats');
        if (res.data?.success) {
          setStats(res.data.data.stats);
        }
      } catch {
        toast.error('Failed to load system metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout title="System Administration & Oversight">
      <div className="space-y-6">
        {/* Banner */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Institutional Oversight &amp; Audit Level</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
              AcadFlow Administrative Center
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Real-time platform metrics, user access controls, document archives, and compliance logs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/users"
              className="btn btn-primary text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <Users className="w-4 h-4" />
              <span>Manage Users</span>
            </Link>
            <Link
              to="/admin/audit-logs"
              className="btn btn-secondary text-xs px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
            >
              <Activity className="w-4 h-4 text-slate-500" />
              <span>Audit Trail</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center text-xs text-slate-400">
            Gathering system analytics...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-semibold">Total Users</span>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {stats?.users?.total || 0}
              </span>
              <span className="block text-[10px] text-slate-400 mt-1">
                {stats?.users?.students || 0} students &bull; {stats?.users?.staff || 0} faculty
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-semibold">Documents</span>
                <FileText className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {stats?.documents?.total || 0}
              </span>
              <span className="block text-[10px] text-slate-400 mt-1">
                {stats?.documents?.pending || 0} in review &bull; {stats?.documents?.approved || 0} approved
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-semibold">OD / Leave</span>
                <Clock className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {stats?.odRequests?.total || 0}
              </span>
              <span className="block text-[10px] text-slate-400 mt-1">
                {stats?.odRequests?.pending || 0} pending review
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-semibold">Projects</span>
                <FolderGit2 className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {stats?.projects?.total || 0}
              </span>
              <span className="block text-[10px] text-slate-400 mt-1">
                Active capstone tracking
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-semibold">Certificates</span>
                <Award className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {stats?.certificates?.total || 0}
              </span>
              <span className="block text-[10px] text-slate-400 mt-1">
                Tamper-proof issued
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-semibold">Notes Library</span>
                <BookOpen className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {stats?.notes?.total || 0}
              </span>
              <span className="block text-[10px] text-slate-400 mt-1">
                Published resources
              </span>
            </div>
          </div>
        )}

        {/* Administration Navigation Quick Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/users"
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:shadow-md transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
              User Directory &amp; Role Control
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Browse students and faculty, deactivate compromised accounts, seed administrative credentials.
            </p>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 pt-1">
              <span>Open Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/admin/documents"
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:shadow-md transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
              Institution Document Repository
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Complete archival oversight of NOCs, bonafide certificates, LORs, and departmental clearances.
            </p>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 pt-1">
              <span>View All Documents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/admin/audit-logs"
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:shadow-md transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
              Immutable Audit Trail
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Audit log detailing timestamps, IP addresses, approvals, account toggles, and security actions.
            </p>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 pt-1">
              <span>Inspect Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
