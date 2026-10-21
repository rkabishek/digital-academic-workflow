import { useState, useEffect } from 'react';
import {
  Clock,
  PlusCircle,
  Calendar,
  MapPin,
  Trash2,
  FileCheck,
  Download,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';

const requestTypes = [
  { value: 'on_duty', label: 'On-Duty (College Event / Symposium)' },
  { value: 'permission', label: 'Short Permission (1–3 Hours)' },
  { value: 'medical_leave', label: 'Medical Leave' },
  { value: 'sports_od', label: 'Sports / Tournaments OD' },
  { value: 'internship_od', label: 'External Internship OD' },
];

const StudentODRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    requestType: 'on_duty',
    reason: '',
    venue: '',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    fromTime: '09:00',
    toTime: '16:30',
    supportingDoc: null,
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/od-requests/my');
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
    fetchRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.reason.trim()) {
      toast.error('Please specify the reason for the request.');
      return;
    }

    const data = new FormData();
    data.append('requestType', form.requestType);
    data.append('reason', form.reason);
    data.append('venue', form.venue);
    data.append('fromDate', form.fromDate);
    data.append('toDate', form.toDate);
    data.append('fromTime', form.fromTime);
    data.append('toTime', form.toTime);
    if (form.supportingDoc) {
      data.append('supportingDoc', form.supportingDoc);
    }

    setSubmitting(true);
    try {
      await api.post('/od-requests', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('OD Request submitted to faculty advisor!');
      setIsModalOpen(false);
      setForm({
        requestType: 'on_duty',
        reason: '',
        venue: '',
        fromDate: new Date().toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0],
        fromTime: '09:00',
        toTime: '16:30',
        supportingDoc: null,
      });
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this pending request?')) return;
    try {
      await api.delete(`/od-requests/${id}`);
      toast.success('Request deleted.');
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <DashboardLayout title="On-Duty & Permission Requests">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Attendance Permissions &amp; OD Records
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Submit digital on-duty and leave applications with supporting proof.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Request</span>
          </button>
        </div>

        {/* List */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              No on-duty or leave requests found. Click "New Request" to create one.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {requests.map((od) => (
                <div
                  key={od._id}
                  className="p-5 sm:p-6 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 capitalize">
                        {od.requestType.replace('_', ' ')}
                      </h4>
                      <StatusBadge status={od.status} />
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
                      <div className="mt-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                        <strong>Advisor Feedback:</strong> "{od.staffRemarks}"
                        {od.reviewedBy && (
                          <span className="block text-[10px] text-slate-400 mt-0.5">
                            Reviewed by {od.reviewedBy.name} on {new Date(od.reviewedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
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
                    {od.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => handleDelete(od._id)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        title="Cancel Request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Apply for On-Duty / Leave"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Request Type *
            </label>
            <select
              value={form.requestType}
              onChange={(e) => setForm({ ...form, requestType: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {requestTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Reason / Event Description *
            </label>
            <textarea
              required
              rows={2}
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="e.g. Attending National Level Hackathon at IIT Madras..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Venue / Location
            </label>
            <input
              type="text"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              placeholder="e.g. IIT Madras, Chennai"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                From Date *
              </label>
              <input
                type="date"
                required
                value={form.fromDate}
                onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                To Date *
              </label>
              <input
                type="date"
                required
                value={form.toDate}
                onChange={(e) => setForm({ ...form, toDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={form.fromTime}
                onChange={(e) => setForm({ ...form, fromTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={form.toTime}
                onChange={(e) => setForm({ ...form, toTime: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Attach Supporting Proof (Brochure / Medical Certificate / Invitation)
            </label>
            <input
              type="file"
              onChange={(e) => setForm({ ...form, supportingDoc: e.target.files[0] })}
              className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-950 dark:file:text-blue-300 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary text-xs px-4 py-2 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary text-xs px-4 py-2 rounded-xl shadow-sm"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default StudentODRequests;
