import { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Download,
  Filter,
  Search,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StaffODRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Review Modal State
  const [targetOD, setTargetOD] = useState(null);
  const [decision, setDecision] = useState('approved');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchODs = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'all' ? '/od-requests/review' : `/od-requests/review?status=${statusFilter}`;
      const res = await api.get(url);
      if (res.data?.success) {
        setRequests(res.data.data.requests || []);
      }
    } catch {
      toast.error('Failed to load OD requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchODs();
  }, [statusFilter]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!targetOD) return;

    setSubmitting(true);
    try {
      await api.put(`/od-requests/${targetOD._id}/review`, {
        status: decision,
        staffRemarks: remarks,
      });
      toast.success(`Request has been ${decision}.`);
      setTargetOD(null);
      setRemarks('');
      fetchODs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = requests.filter((r) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const student = r.submittedBy?.name?.toLowerCase() || '';
    const roll = r.submittedBy?.rollNumber?.toLowerCase() || '';
    const reason = r.reason.toLowerCase();
    return student.includes(term) || roll.includes(term) || reason.includes(term);
  });

  return (
    <DashboardLayout title="On-Duty & Leave Applications Review">
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student name, roll no, or event..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading student requests...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              No on-duty or leave requests match your criteria.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((od) => (
                <div
                  key={od._id}
                  className="p-5 sm:p-6 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 capitalize">
                        {od.submittedBy?.name} &bull; {od.requestType.replace('_', ' ')}
                      </h4>
                      <StatusBadge status={od.status} />
                      <span className="text-xs text-slate-400 font-mono">
                        ({od.submittedBy?.rollNumber})
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      <strong>Reason:</strong> {od.reason}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        {new Date(od.fromDate).toLocaleDateString()} &mdash; {new Date(od.toDate).toLocaleDateString()}
                      </span>
                      {od.venue && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {od.venue}
                        </span>
                      )}
                      {od.fromTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {od.fromTime} - {od.toTime}
                        </span>
                      )}
                    </div>

                    {od.staffRemarks && (
                      <p className="text-xs text-slate-500 italic mt-1">
                        Remarks: "{od.staffRemarks}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {od.supportingDoc && (
                      <a
                        href={`http://localhost:6101/${od.supportingDoc.replace(/\\/g, '/')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Proof</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setTargetOD(od);
                        setDecision('approved');
                        setRemarks(od.staffRemarks || '');
                      }}
                      className="btn btn-primary text-xs px-3.5 py-1.5 rounded-xl shadow-xs"
                    >
                      {od.status === 'pending' ? 'Review Application' : 'Update Status'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={!!targetOD}
        onClose={() => setTargetOD(null)}
        title="Review OD / Leave Application"
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
            <p><strong>Student:</strong> {targetOD?.submittedBy?.name} ({targetOD?.submittedBy?.rollNumber})</p>
            <p><strong>Type:</strong> {targetOD?.requestType?.replace('_', ' ')}</p>
            <p><strong>Reason:</strong> {targetOD?.reason}</p>
            <p>
              <strong>Dates:</strong> {targetOD && new Date(targetOD.fromDate).toLocaleDateString()} to {targetOD && new Date(targetOD.toDate).toLocaleDateString()}
            </p>
            {targetOD?.venue && <p><strong>Venue:</strong> {targetOD.venue}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Decision *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision('approved')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  decision === 'approved'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve Permission</span>
              </button>

              <button
                type="button"
                onClick={() => setDecision('rejected')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  decision === 'rejected'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Application</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Faculty Remarks / Conditions
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Approved. Ensure missed lab sessions are compensated next Tuesday."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setTargetOD(null)}
              className="btn btn-secondary text-xs px-4 py-2 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary text-xs px-4 py-2 rounded-xl shadow-sm"
            >
              {submitting ? 'Updating...' : 'Submit Decision'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default StaffODRequests;
