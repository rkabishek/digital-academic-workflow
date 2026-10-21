import { Link } from 'react-router-dom';
import {
  GraduationCap,
  FileText,
  Users,
  Shield,
  ArrowRight,
  CheckCircle2,
  Bell,
  Clock,
  BookOpen,
  Award,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import PublicNavbar from '../components/layout/PublicNavbar';
import HealthStatus from '../components/ui/HealthStatus';

const modules = [
  {
    icon: FileText,
    title: 'Document Workflow',
    desc: 'Paperless submissions for NOC, Bonafide, LOR, and certificates with multi-tier approval tracking.',
    badge: 'Phase 5',
  },
  {
    icon: Clock,
    title: 'On-Duty & Leave Requests',
    desc: 'Submit attendance permissions with automated date/time tracking and immediate staff advisor review.',
    badge: 'Phase 6',
  },
  {
    icon: CheckCircle2,
    title: 'Project Milestone Tracking',
    desc: 'Structured project milestones, report submissions, advisor grading, and feedback history.',
    badge: 'Phase 7',
  },
  {
    icon: BookOpen,
    title: 'Notes & Academic Materials',
    desc: 'Subject-wise learning resources and faculty notes categorized by department and academic year.',
    badge: 'Phase 8',
  },
  {
    icon: Award,
    title: 'Digital Certificates & QR',
    desc: 'Tamper-proof verifiable credentials with embedded public QR verification codes.',
    badge: 'Phase 9',
  },
  {
    icon: Bell,
    title: 'In-App Notifications',
    desc: 'Real-time alert notifications for status changes, review feedback, and approvals.',
    badge: 'Phase 10',
  },
  {
    icon: Users,
    title: 'User & Staff Code Linking',
    desc: 'Unique alphanumeric staff identifiers connect faculty advisors to student cohorts automatically.',
    badge: 'Phase 2',
  },
  {
    icon: Shield,
    title: 'Audit Trail & Compliance',
    desc: 'Complete immutable audit log recording all system actions, IP addresses, and timestamps.',
    badge: 'Phase 12',
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
            AcadFlow Central Document &amp; Academic Workflow Platform
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 max-w-4xl mx-auto leading-tight sm:leading-tight lg:leading-tight">
            Seamless Academic Workflow &amp;{' '}
            <span className="text-blue-600 dark:text-blue-400">Verifiable Records</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate paperwork bottlenecks. Digitally manage document approvals,
            on-duty permissions, project milestones, faculty study resources, and QR-verified certificates.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/register/student"
              className="btn btn-primary px-5 py-3 text-sm rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <span>Student Registration</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register/staff"
              className="btn btn-secondary px-5 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Faculty Portal
            </Link>
            <Link
              to="/verify"
              className="btn px-5 py-3 text-sm rounded-xl border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/70 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Verify Certificate</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Backend Health Status Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 z-10 w-full mb-12">
        <HealthStatus />
      </section>

      {/* Modules Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Integrated Academic Modules
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            A unified suite designed specifically for collegiate workflow management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map(({ icon: Icon, title, desc, badge }) => (
            <div
              key={title}
              className="card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {badge}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-1.5">
                  {title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">AcadFlow</span>
            <span>&mdash; Digital Academic Document Workflow &amp; Management System</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/verify" className="hover:text-blue-600 transition-colors">
              Verify Certificate
            </Link>
            <Link to="/login" className="hover:text-blue-600 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
