import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  FolderGit2,
  Award,
  PlusCircle,
  ArrowRight,
  BookOpen,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    documents: 0,
    odRequests: 0,
    projects: 0,
    certificates: 0,
  });
  const [recentDocs, setRecentDocs] = useState([]);
  const [recentOD, setRecentOD] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [docsRes, odRes, projRes, certRes] = await Promise.allSettled([
          api.get('/documents/my'),
          api.get('/od-requests/my'),
          api.get('/projects/my'),
          api.get('/certificates/my'),
        ]);

        const docs = docsRes.status === 'fulfilled' ? docsRes.value.data?.data?.documents || [] : [];
        const ods = odRes.status === 'fulfilled' ? odRes.value.data?.data?.requests || [] : [];
        const projs = projRes.status === 'fulfilled' ? projRes.value.data?.data?.projects || [] : [];
        const certs = certRes.status === 'fulfilled' ? certRes.value.data?.data?.certificates || [] : [];

        setStats({
          documents: docs.length,
          odRequests: ods.length,
          projects: projs.length,
          certificates: certs.length,
        });

        setRecentDocs(docs.slice(0, 4));
        setRecentOD(ods.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout title="Student Academic Portal">
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
              <span>Class of Year {user?.year || '1'} &bull; Sec {user?.section || 'A'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
              Hello, {user?.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Roll No: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{user?.rollNumber || 'N/A'}</span> &bull; {user?.department}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/student/documents"
              className="btn btn-primary text-xs px-3.5 py-2 rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Document</span>
            </Link>
            <Link
              to="/student/od-requests"
              className="btn btn-secondary text-xs px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
            >
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Request OD</span>
            </Link>
          </div>
        </div>

        {/* Advisor Notice if linked */}
        {user?.linkedStaffCode ? (
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Assigned Faculty Mentor:
                </span>{' '}
                <span className="font-mono text-blue-700 dark:text-blue-300 font-bold ml-1">
                  {user.linkedStaffCode}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  All submitted NOC, Bonafide, and OD requests are automatically queued for this advisor.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center gap-3 text-xs text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <span>No Faculty Advisor linked yet. Ask your mentor for their unique Staff Code to connect.</span>
            </div>
          </div>
        )}

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/student/documents"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Documents</span>
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {stats.documents}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Submitted / In-Review</span>
            </div>
          </Link>

          <Link
            to="/student/od-requests"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">OD / Leave</span>
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {stats.odRequests}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Permission requests</span>
            </div>
          </Link>

          <Link
            to="/student/projects"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Projects</span>
              <FolderGit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {stats.projects}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Tracked milestones</span>
            </div>
          </Link>

          <Link
            to="/student/certificates"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Certificates</span>
              <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {stats.certificates}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Verified credentials</span>
            </div>
          </Link>
        </div>

        {/* Recent Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Documents */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Recent Documents
              </h3>
              <Link
                to="/student/documents"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading submissions...</p>
            ) : recentDocs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No documents submitted yet. Click "Submit Document" to get started.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentDocs.map((doc) => (
                  <div key={doc._id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {doc.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 capitalize">
                        {doc.type.replace('_', ' ')} &bull; {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                      {doc.remarks && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic line-clamp-1">
                          Remarks: "{doc.remarks}"
                        </p>
                      )}
                    </div>
                    <StatusBadge status={doc.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent OD Requests */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Recent OD / Leave Requests
              </h3>
              <Link
                to="/student/od-requests"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading requests...</p>
            ) : recentOD.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No OD / leave requests submitted yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentOD.map((od) => (
                  <div key={od._id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 capitalize truncate">
                        {od.requestType.replace('_', ' ')}: {od.reason}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(od.fromDate).toLocaleDateString()} &mdash; {new Date(od.toDate).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={od.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
