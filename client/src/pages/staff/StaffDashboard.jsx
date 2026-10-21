import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  FolderGit2,
  Award,
  Users,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  XCircle,
  BookOpen,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StaffDashboard = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    pendingDocs: 0,
    pendingOD: 0,
    projects: 0,
    certificates: 0,
  });
  const [pendingDocs, setPendingDocs] = useState([]);
  const [pendingOD, setPendingOD] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Review Modal for Document
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [reviewForm, setReviewForm] = useState({ status: 'approved', remarks: '' });
  const [reviewing, setReviewing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [docsRes, odRes, projRes, certRes] = await Promise.allSettled([
        api.get('/documents/review?status=submitted'),
        api.get('/od-requests/review?status=pending'),
        api.get('/projects/review'),
        api.get('/certificates'),
      ]);

      const docs = docsRes.status === 'fulfilled' ? docsRes.value.data?.data?.documents || [] : [];
      const ods = odRes.status === 'fulfilled' ? odRes.value.data?.data?.requests || [] : [];
      const projs = projRes.status === 'fulfilled' ? projRes.value.data?.data?.projects || [] : [];
      const certs = certRes.status === 'fulfilled' ? certRes.value.data?.data?.certificates || [] : [];

      setStats({
        pendingDocs: docs.length,
        pendingOD: ods.length,
        projects: projs.length,
        certificates: certs.length,
      });

      setPendingDocs(docs.slice(0, 5));
      setPendingOD(ods.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const copyCode = () => {
    if (user?.staffCode) {
      navigator.clipboard.writeText(user.staffCode);
      setCopied(true);
      toast.success('Staff Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleQuickReview = async (e) => {
    e.preventDefault();
    if (!selectedDoc) return;

    setReviewing(true);
    try {
      await api.put(`/documents/${selectedDoc._id}/review`, {
        status: reviewForm.status,
        remarks: reviewForm.remarks,
      });
      toast.success(`Document marked as ${reviewForm.status}.`);
      setSelectedDoc(null);
      setReviewForm({ status: 'approved', remarks: '' });
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed.');
    } finally {
      setReviewing(false);
    }
  };

  return (
    <DashboardLayout title="Faculty Academic Management">
      <div className="space-y-6">
        {/* Welcome & Staff Code Banner */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
              <span>{user?.designation || 'Faculty Member'} &bull; {user?.department}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
              Welcome, {user?.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Review student submissions, grade project milestones, and issue official credentials.
            </p>
          </div>

          {/* Staff Code Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-4 shrink-0">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Your Staff Code
              </span>
              <span className="text-base font-mono font-bold text-blue-600 dark:text-blue-400">
                {user?.staffCode || 'N/A'}
              </span>
            </div>
            <button
              type="button"
              onClick={copyCode}
              title="Copy code for your students"
              className="p-2 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:text-blue-600 shadow-xs transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/staff/documents"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Pending Docs</span>
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {stats.pendingDocs}
              </span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 block mt-0.5">
                Awaiting your review
              </span>
            </div>
          </Link>

          <Link
            to="/staff/od-requests"
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">Pending ODs</span>
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {stats.pendingOD}
              </span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 block mt-0.5">
                Permissions pending
              </span>
            </div>
          </Link>

          <Link
            to="/staff/projects"
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
              <span className="text-[11px] text-slate-400 block mt-0.5">Assigned projects</span>
            </div>
          </Link>

          <Link
            to="/staff/certificates"
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
              <span className="text-[11px] text-slate-400 block mt-0.5">Issued credentials</span>
            </div>
          </Link>
        </div>

        {/* Action Queues */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Documents Review Queue */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Documents Awaiting Review
              </h3>
              <Link
                to="/staff/documents"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>All documents</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading queue...</p>
            ) : pendingDocs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No pending documents. All student submissions are up to date!
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {pendingDocs.map((doc) => (
                  <div key={doc._id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {doc.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        By {doc.submittedBy?.name} ({doc.submittedBy?.rollNumber}) &bull; {doc.type.replace('_', ' ')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedDoc(doc)}
                      className="btn btn-primary text-xs px-3 py-1 rounded-xl shadow-xs"
                    >
                      Review
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending OD Requests Queue */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Pending On-Duty Requests
              </h3>
              <Link
                to="/staff/od-requests"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>All ODs</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading queue...</p>
            ) : pendingOD.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No pending on-duty or leave requests.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {pendingOD.map((od) => (
                  <div key={od._id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate capitalize">
                        {od.submittedBy?.name} &bull; {od.requestType.replace('_', ' ')}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        Reason: {od.reason}
                      </p>
                    </div>
                    <Link
                      to="/staff/od-requests"
                      className="btn btn-secondary text-xs px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700"
                    >
                      Manage
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Review Modal */}
      <Modal
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        title={`Review Document: ${selectedDoc?.title}`}
      >
        <form onSubmit={handleQuickReview} className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
            <p><strong>Student:</strong> {selectedDoc?.submittedBy?.name} ({selectedDoc?.submittedBy?.rollNumber})</p>
            <p className="mt-1"><strong>Type:</strong> {selectedDoc?.type?.replace('_', ' ')}</p>
            {selectedDoc?.description && <p className="mt-1"><strong>Note:</strong> {selectedDoc.description}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Review Decision *
            </label>
            <select
              value={reviewForm.status}
              onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="approved">Approve Document</option>
              <option value="correction_needed">Request Correction / Revision</option>
              <option value="under_review">Mark Under Review</option>
              <option value="rejected">Reject Submission</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Remarks &amp; Feedback
            </label>
            <textarea
              rows={3}
              value={reviewForm.remarks}
              onChange={(e) => setReviewForm({ ...reviewForm, remarks: e.target.value })}
              placeholder="Provide constructive feedback, approval comments, or correction details..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setSelectedDoc(null)}
              className="btn btn-secondary text-xs px-4 py-2 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={reviewing}
              className="btn btn-primary text-xs px-4 py-2 rounded-xl shadow-sm"
            >
              {reviewing ? 'Submitting...' : 'Submit Decision'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default StaffDashboard;
