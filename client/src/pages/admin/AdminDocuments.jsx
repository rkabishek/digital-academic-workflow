import { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Calendar,
  User,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      params.append('page', String(page));
      params.append('limit', '20');

      const res = await api.get(`/admin/documents?${params.toString()}`);
      if (res.data?.success) {
        setDocuments(res.data.data.documents || []);
        setTotalPages(res.data.data.pagination?.pages || 1);
      }
    } catch {
      toast.error('Failed to load document archive.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [statusFilter, page]);

  const filtered = documents.filter((doc) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const student = doc.submittedBy?.name?.toLowerCase() || '';
    const roll = doc.submittedBy?.rollNumber?.toLowerCase() || '';
    const title = doc.title.toLowerCase();
    return title.includes(term) || student.includes(term) || roll.includes(term);
  });

  return (
    <DashboardLayout title="Central Document Archive">
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
                placeholder="Search across all submitted files..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Documents</option>
                <option value="submitted">Submitted</option>
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
            <div className="p-12 text-center text-xs text-slate-400">Loading document archive...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">No documents found.</div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((doc) => (
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

                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      Student: <strong>{doc.submittedBy?.name}</strong> ({doc.submittedBy?.rollNumber})
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>Submitted: {new Date(doc.submittedAt || doc.createdAt).toLocaleDateString()}</span>
                      {doc.reviewedBy && (
                        <span>&bull; Reviewed By: <strong>{doc.reviewedBy.name}</strong></span>
                      )}
                    </div>

                    {doc.remarks && (
                      <p className="text-xs text-slate-500 italic mt-0.5">
                        Remarks: "{doc.remarks}"
                      </p>
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
                        <span>Download</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDocuments;
