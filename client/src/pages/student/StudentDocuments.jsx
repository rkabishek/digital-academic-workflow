import { useState, useEffect } from 'react';
import {
  FileText,
  PlusCircle,
  Download,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';

const docTypes = [
  { value: 'noc', label: 'No Objection Certificate (NOC)' },
  { value: 'bonafide', label: 'Bonafide Certificate' },
  { value: 'lor', label: 'Letter of Recommendation (LOR)' },
  { value: 'scholarship', label: 'Scholarship Application Form' },
  { value: 'internship_letter', label: 'Internship Permission Letter' },
  { value: 'exam_form', label: 'Examination Form' },
  { value: 'other', label: 'Other Academic Request' },
];

const StudentDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Submit Modal
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    title: '',
    type: 'noc',
    description: '',
    file: null,
  });
  const [submitting, setSubmitting] = useState(false);

  // Resubmit Modal
  const [resubmitTarget, setResubmitTarget] = useState(null);
  const [resubmitForm, setResubmitForm] = useState({ correction: '', file: null });
  const [resubmitting, setResubmitting] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'all' ? '/documents/my' : `/documents/my?status=${statusFilter}`;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submitForm.title.trim()) {
      toast.error('Document title is required.');
      return;
    }

    const data = new FormData();
    data.append('title', submitForm.title);
    data.append('type', submitForm.type);
    data.append('description', submitForm.description);
    if (submitForm.file) {
      data.append('file', submitForm.file);
    }

    setSubmitting(true);
    try {
      await api.post('/documents', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Document submitted successfully!');
      setIsSubmitOpen(false);
      setSubmitForm({ title: '', type: 'noc', description: '', file: null });
      fetchDocuments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResubmit = async (e) => {
    e.preventDefault();
    if (!resubmitTarget) return;

    const data = new FormData();
    data.append('correction', resubmitForm.correction);
    if (resubmitForm.file) {
      data.append('file', resubmitForm.file);
    }

    setResubmitting(true);
    try {
      await api.put(`/documents/${resubmitTarget._id}/resubmit`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Document resubmitted for review!');
      setResubmitTarget(null);
      setResubmitForm({ correction: '', file: null });
      fetchDocuments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Resubmission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this draft document?')) return;
    try {
      await api.delete(`/documents/${id}`);
      toast.success('Draft deleted.');
      fetchDocuments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    }
  };

  const filteredDocs = documents.filter((doc) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      doc.title.toLowerCase().includes(term) ||
      doc.type.toLowerCase().includes(term) ||
      (doc.remarks && doc.remarks.toLowerCase().includes(term))
    );
  });

  return (
    <DashboardLayout title="My Academic Documents">
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search documents..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="correction_needed">Correction Needed</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSubmitOpen(true)}
            className="btn btn-primary text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-1.5 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit New Document</span>
          </button>
        </div>

        {/* Documents Table / Cards */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading documents...</div>
          ) : filteredDocs.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              No documents match your query. Click "Submit New Document" to create one.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDocs.map((doc) => (
                <div
                  key={doc._id}
                  className="p-5 sm:p-6 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {doc.title}
                      </h4>
                      <StatusBadge status={doc.status} />
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Type: <span className="capitalize font-medium text-slate-700 dark:text-slate-300">{doc.type.replace('_', ' ')}</span> &bull; Submitted: {new Date(doc.submittedAt || doc.createdAt).toLocaleDateString()}
                    </p>

                    {doc.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">
                        {doc.description}
                      </p>
                    )}

                    {doc.remarks && (
                      <div className="mt-2 p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200">
                        <strong>Faculty Remarks:</strong> "{doc.remarks}"
                        {doc.reviewedBy && (
                          <span className="block text-[10px] text-amber-700 dark:text-amber-400 mt-0.5">
                            Reviewed by {doc.reviewedBy.name} on {new Date(doc.reviewedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {doc.filePath && (
                      <a
                        href={`http://localhost:6101/${doc.filePath.replace(/\\/g, '/')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>File</span>
                      </a>
                    )}

                    {doc.status === 'correction_needed' && (
                      <button
                        type="button"
                        onClick={() => {
                          setResubmitTarget(doc);
                          setResubmitForm({ correction: '', file: null });
                        }}
                        className="btn px-3 py-1.5 rounded-xl text-xs bg-orange-600 text-white hover:bg-orange-700 flex items-center gap-1.5 shadow-sm"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Resubmit</span>
                      </button>
                    )}

                    {doc.status === 'draft' && (
                      <button
                        type="button"
                        onClick={() => handleDelete(doc._id)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        title="Delete draft"
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

      {/* Submit New Document Modal */}
      <Modal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        title="Submit Academic Document"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Document Title *
            </label>
            <input
              type="text"
              required
              value={submitForm.title}
              onChange={(e) => setSubmitForm({ ...submitForm, title: e.target.value })}
              placeholder="e.g. NOC for Summer Internship at ISRO"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Document Type *
            </label>
            <select
              value={submitForm.type}
              onChange={(e) => setSubmitForm({ ...submitForm, type: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {docTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description / Justification
            </label>
            <textarea
              rows={3}
              value={submitForm.description}
              onChange={(e) => setSubmitForm({ ...submitForm, description: e.target.value })}
              placeholder="State the purpose of this request and any relevant details..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Attach Supporting File (PDF, DOCX, or PNG)
            </label>
            <input
              type="file"
              onChange={(e) => setSubmitForm({ ...submitForm, file: e.target.files[0] })}
              className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-950 dark:file:text-blue-300 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsSubmitOpen(false)}
              className="btn btn-secondary text-xs px-4 py-2 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary text-xs px-4 py-2 rounded-xl shadow-sm"
            >
              {submitting ? 'Submitting...' : 'Submit to Advisor'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Resubmit Correction Modal */}
      <Modal
        isOpen={!!resubmitTarget}
        onClose={() => setResubmitTarget(null)}
        title="Resubmit Corrected Document"
      >
        <form onSubmit={handleResubmit} className="space-y-4">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
            <strong>Advisor Remark:</strong> "{resubmitTarget?.remarks}"
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Clarifications &amp; Corrections Made *
            </label>
            <textarea
              required
              rows={3}
              value={resubmitForm.correction}
              onChange={(e) => setResubmitForm({ ...resubmitForm, correction: e.target.value })}
              placeholder="Describe what corrections you made based on the remarks..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Upload Revised Document (Optional if text clarification only)
            </label>
            <input
              type="file"
              onChange={(e) => setResubmitForm({ ...resubmitForm, file: e.target.files[0] })}
              className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-950 dark:file:text-blue-300 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setResubmitTarget(null)}
              className="btn btn-secondary text-xs px-4 py-2 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={resubmitting}
              className="btn btn-primary text-xs px-4 py-2 rounded-xl shadow-sm"
            >
              {resubmitting ? 'Resubmitting...' : 'Send Revision'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default StudentDocuments;
