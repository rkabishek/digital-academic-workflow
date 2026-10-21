import { useState, useEffect } from 'react';
import {
  FolderGit2,
  Calendar,
  CheckCircle,
  Download,
  Users,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Award,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StaffProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  // Review Project Modal
  const [projectTarget, setProjectTarget] = useState(null);
  const [projectStatus, setProjectStatus] = useState('approved');
  const [projectRemarks, setProjectRemarks] = useState('');
  const [updatingProject, setUpdatingProject] = useState(false);

  // Review Milestone Modal
  const [milestoneTarget, setMilestoneTarget] = useState(null);
  const [milestoneStatus, setMilestoneStatus] = useState('accepted');
  const [milestoneFeedback, setMilestoneFeedback] = useState('');
  const [updatingMilestone, setUpdatingMilestone] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects/review');
      if (res.data?.success) {
        const list = res.data.data.projects || [];
        setProjects(list);
        if (list.length > 0 && !expandedId) {
          setExpandedId(list[0]._id);
        }
      }
    } catch {
      toast.error('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectReview = async (e) => {
    e.preventDefault();
    if (!projectTarget) return;

    setUpdatingProject(true);
    try {
      await api.put(`/projects/${projectTarget._id}/review`, {
        status: projectStatus,
        remarks: projectRemarks,
      });
      toast.success('Project status updated.');
      setProjectTarget(null);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review failed.');
    } finally {
      setUpdatingProject(false);
    }
  };

  const handleMilestoneReview = async (e) => {
    e.preventDefault();
    if (!milestoneTarget) return;

    setUpdatingMilestone(true);
    try {
      const { projectId, milestoneId } = milestoneTarget;
      await api.put(`/projects/${projectId}/milestones/${milestoneId}/review`, {
        status: milestoneStatus,
        feedback: milestoneFeedback,
      });
      toast.success('Milestone evaluation recorded.');
      setMilestoneTarget(null);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update milestone.');
    } finally {
      setUpdatingMilestone(false);
    }
  };

  return (
    <DashboardLayout title="Project Reviews & Milestone Evaluation">
      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Student Capstone, Mini-Project &amp; Research Reviews
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Grade iterative milestones, assess documentation reports, and monitor progress.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center text-xs text-slate-400">
            Loading student projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center text-xs text-slate-400">
            No student projects submitted yet.
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((proj) => {
              const isExpanded = expandedId === proj._id;
              return (
                <div
                  key={proj._id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
                >
                  {/* Header */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : proj._id)}
                    className="p-5 sm:p-6 cursor-pointer flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
                          {proj.title}
                        </h3>
                        <StatusBadge status={proj.status} />
                        {proj.domain && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                            {proj.domain}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Lead: <strong className="text-slate-700 dark:text-slate-300">{proj.submittedBy?.name} ({proj.submittedBy?.rollNumber})</strong> &bull; Dept: {proj.submittedBy?.department}
                      </p>

                      {proj.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                          {proj.description}
                        </p>
                      )}

                      {proj.teamMembers?.length > 0 && (
                        <p className="text-xs text-slate-400">
                          Team: {proj.teamMembers.join(', ')}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectTarget(proj);
                          setProjectStatus(proj.status);
                          setProjectRemarks(proj.remarks || '');
                        }}
                        className="btn btn-secondary text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700"
                      >
                        Project Status
                      </button>

                      <span className="text-xs text-slate-400 font-medium">
                        {proj.milestones?.length || 0} Milestones
                      </span>

                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Milestones Evaluation Area */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 dark:border-slate-800 p-5 sm:p-6 bg-slate-50/50 dark:bg-slate-950/40 space-y-4">
                      <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                        Deliverable Milestones for Evaluation
                      </h4>

                      {proj.milestones?.length === 0 ? (
                        <p className="text-xs text-slate-400 py-3 text-center">
                          No milestone submissions from student yet.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {proj.milestones.map((m, idx) => (
                            <div
                              key={m._id || idx}
                              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
                            >
                              <div className="space-y-1 min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                                    {idx + 1}
                                  </span>
                                  <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                    {m.title}
                                  </h5>
                                  <StatusBadge status={m.status} />
                                </div>

                                {m.description && (
                                  <p className="text-xs text-slate-600 dark:text-slate-300 pl-7">
                                    {m.description}
                                  </p>
                                )}

                                {m.feedback && (
                                  <p className="text-xs text-slate-500 italic pl-7 mt-0.5">
                                    Guide Remarks: "{m.feedback}"
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2 shrink-0 pl-7 sm:pl-0">
                                {m.filePath && (
                                  <a
                                    href={`http://localhost:6101/${m.filePath.replace(/\\/g, '/')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-secondary text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>Artifact</span>
                                  </a>
                                )}

                                <button
                                  type="button"
                                  onClick={() => {
                                    setMilestoneTarget({
                                      projectId: proj._id,
                                      milestoneId: m._id,
                                      title: m.title,
                                    });
                                    setMilestoneStatus(m.status === 'submitted' ? 'accepted' : m.status);
                                    setMilestoneFeedback(m.feedback || '');
                                  }}
                                  className="btn btn-primary text-xs px-3 py-1.5 rounded-lg shadow-xs"
                                >
                                  Grade
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Project Status Modal */}
      <Modal
        isOpen={!!projectTarget}
        onClose={() => setProjectTarget(null)}
        title={`Review Project: ${projectTarget?.title}`}
      >
        <form onSubmit={handleProjectReview} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Overall Project Status *
            </label>
            <select
              value={projectStatus}
              onChange={(e) => setProjectStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="approved">Approved &amp; Active</option>
              <option value="completed">Completed Successfully</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Faculty Comments / Directives
            </label>
            <textarea
              rows={3}
              value={projectRemarks}
              onChange={(e) => setProjectRemarks(e.target.value)}
              placeholder="Comments on overall project scope, architecture, or timeline..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setProjectTarget(null)}
              className="btn btn-secondary text-xs px-4 py-2 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updatingProject}
              className="btn btn-primary text-xs px-4 py-2 rounded-xl shadow-sm"
            >
              {updatingProject ? 'Saving...' : 'Save Decision'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Milestone Review Modal */}
      <Modal
        isOpen={!!milestoneTarget}
        onClose={() => setMilestoneTarget(null)}
        title={`Grade Milestone: ${milestoneTarget?.title}`}
      >
        <form onSubmit={handleMilestoneReview} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Milestone Status *
            </label>
            <select
              value={milestoneStatus}
              onChange={(e) => setMilestoneStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="approved">Approved / Passed</option>
              <option value="revision_needed">Revisions Required</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Feedback &amp; Corrections for Student Team
            </label>
            <textarea
              rows={3}
              value={milestoneFeedback}
              onChange={(e) => setMilestoneFeedback(e.target.value)}
              placeholder="Detail required fixes, code improvements, or approval notes..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setMilestoneTarget(null)}
              className="btn btn-secondary text-xs px-4 py-2 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updatingMilestone}
              className="btn btn-primary text-xs px-4 py-2 rounded-xl shadow-sm"
            >
              {updatingMilestone ? 'Recording...' : 'Submit Grade'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default StaffProjects;
