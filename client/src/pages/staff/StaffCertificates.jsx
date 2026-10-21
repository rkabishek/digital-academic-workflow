import { useState, useEffect } from 'react';
import {
  Award,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  Calendar,
  UserCheck,
  Search,
  Filter,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';

const certTypes = [
  { value: 'completion', label: 'Certificate of Course Completion' },
  { value: 'achievement', label: 'Academic Achievement Award' },
  { value: 'participation', label: 'Symposium / Workshop Participation' },
  { value: 'internship', label: 'Internship Recommendation & Certificate' },
  { value: 'project', label: 'Capstone Project Excellence' },
  { value: 'other', label: 'Institutional Commendation' },
];

const StaffCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    issuedTo: '',
    title: '',
    type: 'completion',
    description: '',
    validUntil: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [certsRes, studentsRes] = await Promise.allSettled([
        api.get('/certificates'),
        api.get('/users/students'),
      ]);

      if (certsRes.status === 'fulfilled' && certsRes.value.data?.success) {
        setCertificates(certsRes.value.data.data.certificates || []);
      }
      if (studentsRes.status === 'fulfilled' && studentsRes.value.data?.success) {
        const studentList = studentsRes.value.data.data.students || [];
        setStudents(studentList);
        if (studentList.length > 0 && !form.issuedTo) {
          setForm((f) => ({ ...f, issuedTo: studentList[0]._id }));
        }
      }
    } catch {
      toast.error('Failed to load certificate data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIssue = async (e) => {
    e.preventDefault();
    if (!form.issuedTo || !form.title.trim()) {
      toast.error('Student and title are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/certificates', {
        issuedTo: form.issuedTo,
        title: form.title,
        type: form.type,
        description: form.description,
        validUntil: form.validUntil || null,
      });

      toast.success(res.data?.message || 'Certificate issued with QR verification!');
      setIsModalOpen(false);
      setForm({
        issuedTo: students[0]?._id || '',
        title: '',
        type: 'completion',
        description: '',
        validUntil: '',
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue certificate.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Digital Certificate Issuance">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Institutional Credential Generation &amp; QR Encoding
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Issue tamper-proof certificates instantly verified via public QR codes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Issue New Certificate</span>
          </button>
        </div>

        {/* Certificates List */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading certificate registry...</div>
          ) : certificates.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              No certificates issued yet. Click "Issue New Certificate" to award a student.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {certificates.map((cert) => (
                <div
                  key={cert._id}
                  className="p-5 sm:p-6 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {cert.title}
                      </h4>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                        {cert.type}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      Awarded to: <strong>{cert.issuedTo?.name}</strong> (Roll: {cert.issuedTo?.rollNumber})
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>ID: <code className="font-mono font-bold text-slate-800 dark:text-slate-200">{cert.certificateNumber}</code></span>
                      <span>&bull;</span>
                      <span>Issued: {new Date(cert.issuedDate).toLocaleDateString()}</span>
                      <span>&bull;</span>
                      <span>By: {cert.issuedBy?.name}</span>
                    </div>

                    {cert.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {cert.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {cert.qrCode && (
                      <img
                        src={cert.qrCode}
                        alt="QR Code"
                        className="w-12 h-12 rounded-lg bg-white p-1 border border-slate-200"
                      />
                    )}

                    <a
                      href={`/verify/${cert.certificateNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Verify Link</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Issue Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Issue Verified Digital Certificate"
      >
        <form onSubmit={handleIssue} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Recipient Student *
            </label>
            <select
              required
              value={form.issuedTo}
              onChange={(e) => setForm({ ...form, issuedTo: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {students.length === 0 ? (
                <option value="">No registered students found</option>
              ) : (
                students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} &mdash; {s.rollNumber} ({s.department})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Certificate Title / Award Name *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Advanced Machine Learning Specialization"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Certificate Category *
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {certTypes.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Citation / Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="State the student's accomplishments, grade, or reason for commendation..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Valid Until Date (Optional)
            </label>
            <input
              type="date"
              value={form.validUntil}
              onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              disabled={submitting || students.length === 0}
              className="btn btn-primary text-xs px-4 py-2 rounded-xl shadow-sm"
            >
              {submitting ? 'Generating QR...' : 'Issue Credential'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default StaffCertificates;
