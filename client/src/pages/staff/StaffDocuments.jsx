import { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  User,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StaffDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Review Modal State
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [reviewForm, setReviewForm] = useState({ status: 'approved', remarks: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'all' ? '/documents/review' : `/documents/review?status=${statusFilter}`;
      const res = await api.get(url);
      if (res.data?.success) {
        setDocuments(res.data.data.documents || []);
      }
    } catch {
      toast.error('Failed to load documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [statusFilter]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoc) return;

    setSubmitting(true);
    try {
      await api.put(`/documents/${selectedDoc._id}/review`, {
        status: reviewForm.status,
        remarks: reviewForm.remarks,
      });
      toast.success(`Document marked as ${reviewForm.status}.`);
      setSelectedDoc(null);
      setReviewForm({ status: 'approved', remarks: '' });
      fetchDocuments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const studentName = doc.submittedBy?.name?.toLowerCase() || '';
    const rollNo = doc.submittedBy?.rollNumber?.toLowerCase() || '';
    const title = doc.title.toLowerCase();
    return title.includes(term) || studentName.includes(term) || rollNo.includes(term);
  });

  return (
    <DashboardLayout title="Student Document Reviews">
      <div className="space-y-6">
        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student, roll no, or title..."
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
                <option value="all">All Submissions</option>
                <option value="submitted">Needs Review</option>
                <option value="under_review">Under Review</option>
                <option value="correction_needed">Correction Needed</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documents Table */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading student documents...</div>
          ) : filteredDocs.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              No documents found matching the filter criteria.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDocs.map((doc) => (
                <div
                  key={doc._id}
                  className="p-5 sm:p-6 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {doc.title}
                      </h4>
                      <StatusBadge status={doc.status} />
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {doc.type.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {doc.submittedBy?.name} ({doc.submittedBy?.rollNumber})
                      </span>
                      <span>&bull;</span>
                      <span>Dept: {doc.submittedBy?.department}</span>
                      <span>&bull;</span>
                      <span>Submitted: {new Date(doc.submittedAt || doc.createdAt).toLocaleDateString()}</span>
                    </div>

                    {doc.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {doc.description}
                      </p>
                    )}

                    {doc.correction && (
                      <div className="mt-2 p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-xs text-orange-900 dark:text-orange-200">
                        <strong>Student Correction Note:</strong> "{doc.correction}"
                      </div>
                    )}

                    {doc.remarks && (
                      <div className="mt-1 text-xs text-slate-500 italic">
                        Your Remarks: "{doc.remarks}"
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {doc.filePath && (
                      <a
                        href={`http://localhost:6101/${doc.filePath.replace(/\\/g, '/')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>View Attachment</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDoc(doc);
                        setReviewForm({
                          status: doc.status === 'submitted' ? 'approved' : doc.status,
                          remarks: doc.remarks || '',
                        });
                      }}
                      className="btn btn-primary text-xs px-3.5 py-1.5 rounded-xl shadow-xs"
                    >
                      Evaluate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Document Modal */}
      <Modal
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        title={`Evaluate Document Submission`}
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
            <p><strong>Title:</strong> {selectedDoc?.title}</p>
            <p><strong>Student:</strong> {selectedDoc?.submittedBy?.name} (Roll: {selectedDoc?.submittedBy?.rollNumber})</p>
            <p><strong>Document Type:</strong> {selectedDoc?.type?.replace('_', ' ')}</p>
            {selectedDoc?.description && <p><strong>Student Note:</strong> {selectedDoc.description}</p>}
            {selectedDoc?.filePath && (
              <div className="pt-2">
                <a
                  href={`http://localhost:6101/${selectedDoc.filePath.replace(/\\/g, '/')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / Inspect Submitted Document</span>
                </a>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Approval Status *
            </label>
            <select
              value={reviewForm.status}
              onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="approved">Approve Submission</option>
              <option value="correction_needed">Request Correction / Revisions</option>
              <option value="under_review">Mark Under Review</option>
              <option value="rejected">Reject Submission</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Feedback Remarks for Student
            </label>
            <textarea
              rows={3}
              value={reviewForm.remarks}
              onChange={(e) => setReviewForm({ ...reviewForm, remarks: e.target.value })}
              placeholder="State reasons for decision, required corrections, or approval notes..."
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
              disabled={submitting}
              className="btn btn-primary text-xs px-4 py-2 rounded-xl shadow-sm"
            >
              {submitting ? 'Submitting...' : 'Confirm Evaluation'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default StaffDocuments;
