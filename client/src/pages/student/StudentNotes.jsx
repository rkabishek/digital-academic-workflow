import { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Tag,
  FileCheck,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';

const departments = [
  'All Departments',
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering',
  'Artificial Intelligence & Data Science',
];

const StudentNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedYear, setSelectedYear] = useState('all');
  const [search, setSearch] = useState('');

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedDept !== 'All Departments') params.append('department', selectedDept);
      if (selectedYear !== 'all') params.append('year', selectedYear);
      if (search.trim()) params.append('search', search.trim());

      const res = await api.get(`/notes?${params.toString()}`);
      if (res.data?.success) {
        setNotes(res.data.data.notes || []);
      }
    } catch {
      toast.error('Failed to load notes repository.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [selectedDept, selectedYear]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchNotes();
  };

  const handleDownload = async (note) => {
    try {
      window.open(`http://localhost:6101/api/notes/${note._id}/download`, '_blank');
      // Update local download count
      setNotes((prev) =>
        prev.map((n) => (n._id === note._id ? { ...n, downloads: (n.downloads || 0) + 1 } : n))
      );
      toast.success(`Downloading ${note.title}`);
    } catch {
      toast.error('Download failed.');
    }
  };

  return (
    <DashboardLayout title="Academic Notes & Materials">
      <div className="space-y-6">
        {/* Header & Filter Controls */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Departmental Study Resources &amp; Lecture Materials
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified lecture slides, syllabus references, and question banks curated by faculty members.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by topic, keyword, or course code..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Department */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Year */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Years</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>

            <button
              type="submit"
              className="btn btn-primary text-xs px-4 py-2 rounded-xl shadow-sm shrink-0"
            >
              Search
            </button>
          </form>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center text-xs text-slate-400">
            Fetching course resources...
          </div>
        ) : notes.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center text-xs text-slate-400">
            No materials found for the chosen filters. Try selecting "All Departments" or clear the search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {notes.map((note) => (
              <div
                key={note._id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-blue-500/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    {note.year && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        Year {note.year}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 line-clamp-1">
                      {note.title}
                    </h3>
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                      {note.subject}
                    </p>
                    {note.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {note.description}
                      </p>
                    )}
                  </div>

                  {note.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {note.tags.map((t, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-slate-400">
                    <span className="block text-[10px]">
                      By {note.uploadedBy?.name || 'Faculty'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {note.downloads || 0} downloads
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownload(note)}
                    className="btn btn-secondary text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 hover:border-blue-500 hover:text-blue-600"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentNotes;
