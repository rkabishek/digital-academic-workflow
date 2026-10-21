import { useState, useEffect } from 'react';
import {
  FolderGit2,
  PlusCircle,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Users,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StudentProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Project Modal
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    domain: 'Web Development / AI',
    teamMembers: '',
  });
  const [submittingProject, setSubmittingProject] = useState(false);

  // New Milestone Modal
  const [targetProject, setTargetProject] = useState(null);
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    file: null,
  });
  const [submittingMilestone, setSubmittingMilestone] = useState(false);

  // Expanded project accordion state
  const [expandedId, setExpandedId] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects/my');
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

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title.trim()) {
      toast.error('Project title is required.');
      return;
    }

    setSubmittingProject(true);
    try {
      const members = projectForm.teamMembers
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);

      await api.post('/projects', {
        title: projectForm.title,
        description: projectForm.description,
        domain: projectForm.domain,
        teamMembers: members,
      });

      toast.success('Project initiated successfully!');
      setIsProjectModalOpen(false);
      setProjectForm({ title: '', description: '', domain: 'Web Development / AI', teamMembers: '' });
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project.');
    } finally {
      setSubmittingProject(false);
    }
  };

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (!targetProject) return;

    const data = new FormData();
    data.append('title', milestoneForm.title);
    data.append('description', milestoneForm.description);
    data.append('dueDate', milestoneForm.dueDate);
    if (milestoneForm.file) {
      data.append('file', milestoneForm.file);
    }

    setSubmittingMilestone(true);
    try {
      await api.post(`/projects/${targetProject._id}/milestones`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Milestone submitted for faculty evaluation!');
      setTargetProject(null);
      setMilestoneForm({ title: '', description: '', dueDate: new Date().toISOString().split('T')[0], file: null });
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit milestone.');
    } finally {
      setSubmittingMilestone(false);
    }
  };

  return (
    <DashboardLayout title="Projects & Milestone Reviews">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Academic Capstone &amp; Mini-Projects
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Submit deliverables, SRS, design reports, and receive milestone grades from your guide.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsProjectModalOpen(true)}
            className="btn btn-primary text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>

        {/* Project List */}
        {loading ? (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center text-xs text-slate-400">
            Loading project milestones...
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center text-xs text-slate-400">
            No projects registered yet. Click "New Project" to register your academic project.
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((proj) => {
              const isExpanded = expandedId === proj._id;
              return (
                <div
                  key={proj._id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all"
                >
                  {/* Card Header / Summary */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : proj._id)}
                    className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
                          {proj.title}
                        </h3>
                        <StatusBadge status={proj.status} />
                        {proj.domain && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium">
                            {proj.domain}
                          </span>
                        )}
                      </div>

                      {proj.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {proj.description}
                        </p>
                      )}

                      {proj.teamMembers?.length > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>Team: {proj.teamMembers.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {proj.milestones?.length || 0} Milestones
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Milestone Timeline */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 dark:border-slate-800 p-5 sm:p-6 bg-slate-50/50 dark:bg-slate-950/40 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                          Project Milestones &amp; Submissions
                        </h4>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTargetProject(proj);
                          }}
                          className="btn btn-secondary text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span>Add Milestone</span>
                        </button>
                      </div>

                      {proj.milestones?.length === 0 ? (
                        <p className="text-xs text-slate-400 py-4 text-center">
                          No milestones added yet. Click "Add Milestone" to submit SRS, diagrams, or progress reports.
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
                                  <div className="ml-7 mt-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                                    <strong>Guide Feedback:</strong> "{m.feedback}"
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-3 shrink-0 pl-7 sm:pl-0">
                                {m.dueDate && (
                                  <span className="text-[11px] text-slate-400">
                                    Due: {new Date(m.dueDate).toLocaleDateString()}
                                  </span>
                                )}
                                {m.filePath && (
                                  <a
                                    href={`http://localhost:6101/${m.filePath.replace(/\\/g, '/')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-secondary text-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>Attachment</span>
                                  </a>
                                )}
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

      {/* New Project Modal */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Register New Academic Project"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={projectForm.title}
              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
              placeholder="e.g. Distributed Consensus Engine in Rust"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Domain / Technology Area
            </label>
            <input
              type="text"
              value={projectForm.domain}
              onChange={(e) => setProjectForm({ ...projectForm, domain: e.target.value })}
              placeholder="e.g. Artificial Intelligence / Cloud Systems"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Abstract / Synopsis
            </label>
            <textarea
              rows={3}
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              placeholder="Summary of objectives, methodology, and expected results..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Team Members (Comma separated names)
            </label>
            <input
              type="text"
              value={projectForm.teamMembers}
              onChange={(e) => setProjectForm({ ...projectForm, teamMembers: e.target.value })}
              placeholder="e.g. Alex Johnson (Leader), Priya Sharma, David Miller"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsProjectModalOpen(false)}
              className="btn btn-secondary text-xs px-4 py-2 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingProject}
              className="btn btn-primary text-xs px-4 py-2 rounded-xl shadow-sm"
            >
              {submittingProject ? 'Creating...' : 'Register Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Milestone Modal */}
      <Modal
        isOpen={!!targetProject}
        onClose={() => setTargetProject(null)}
        title={`Add Milestone for "${targetProject?.title}"`}
      >
        <form onSubmit={handleAddMilestone} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Milestone Title *
            </label>
            <input
              type="text"
              required
              value={milestoneForm.title}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
              placeholder="e.g. Milestone 1: SRS &amp; Architecture Diagram"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Deliverable Summary
            </label>
            <textarea
              rows={2}
              value={milestoneForm.description}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
              placeholder="Outline what has been completed in this milestone..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Scheduled Due / Review Date
            </label>
            <input
              type="date"
              value={milestoneForm.dueDate}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, dueDate: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Attach Progress Report / Code ZIP / Documentation
            </label>
            <input
              type="file"
              onChange={(e) => setMilestoneForm({ ...milestoneForm, file: e.target.files[0] })}
              className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-950 dark:file:text-blue-300 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setTargetProject(null)}
              className="btn btn-secondary text-xs px-4 py-2 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingMilestone}
              className="btn btn-primary text-xs px-4 py-2 rounded-xl shadow-sm"
            >
              {submittingMilestone ? 'Submitting...' : 'Submit Milestone'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default StudentProjects;
