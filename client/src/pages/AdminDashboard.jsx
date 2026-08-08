import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getApplications, updateApplicationStatus, getStats } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye } from "lucide-react";

const statusOptions = [
  "submitted",
  "under-review",
  "shortlisted",
  "rejected",
  "selected",
];

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "submitted":
      return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    case "under-review":
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    case "shortlisted":
      return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    case "rejected":
      return "bg-red-500/10 text-red-400 border border-red-500/20";
    case "selected":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    default:
      return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
  }
};

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const [allApplications, setAllApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appsRes, statsRes] = await Promise.all([
        getApplications({ limit: 5000 }),
        getStats(),
      ]);
      setAllApplications(appsRes.data.applications || appsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateApplicationStatus(id, newStatus);
      setAllApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
      );
      // Also update selectedApp status if it's currently open
      if (selectedApp && selectedApp._id === id) {
        setSelectedApp((prev) => ({ ...prev, status: newStatus }));
      }
      // Refresh stats
      const statsRes = await getStats();
      setStats(statsRes.data);
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  // Perform instant real-time client-side filtering
  const filteredApplications = allApplications.filter(app => {
    // 1. Department Filter
    const matchesDept = selectedDept === "All" || app.department === selectedDept;
    
    // 2. Search Filter (Case Insensitive)
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = query === "" || 
      (app.personalDetails?.name || "").toLowerCase().includes(query) ||
      (app.personalDetails?.email || "").toLowerCase().includes(query) ||
      (app.personalDetails?.rollNumber || "").toLowerCase().includes(query);
      
    return matchesDept && matchesSearch;
  });

  if (loading && allApplications.length === 0) {
    return (
      <section className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-8 w-52 bg-slate-800 rounded-md" />
              <div className="h-4 w-36 bg-slate-800 rounded-md" />
            </div>
            <div className="h-10 w-24 bg-slate-800 rounded-full" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-slate-800/40 border border-border/20 rounded-xl" />
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="bg-card/40 border border-border/30 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-border/30 h-16 bg-slate-900/20" />
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-slate-800/50 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-slate-400">Welcome, {admin?.name || "Admin"}</p>
          </div>
          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/30 hover:bg-violet-500/20 transition-all font-medium text-sm"
          >
            Logout
          </button>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            {error}
          </motion.p>
        )}

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard title="Total Applications" value={stats.totalApplications} />
            <StatCard title="Pending Review" value={stats.pending} />
            <StatCard title="Shortlisted" value={stats.shortlisted} />
            <StatCard title="Selected" value={stats.selected} />
          </div>
        )}

        {/* Applications List */}
        <div className="bg-card/40 backdrop-blur-sm rounded-2xl border border-border/30 overflow-hidden">
          <div className="p-6 border-b border-border/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-lg font-semibold text-white">Candidates Applications</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search name, email, roll..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                  className="w-full sm:w-60 bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg pl-8 pr-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                />
                <svg
                  className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider shrink-0">// DEPT:</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 focus:border-violet-500 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Departments</option>
                  <option value="Tech">Tech</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Photography">Photography</option>
                  <option value="Content">Content</option>
                  <option value="Video Editing">Video Editing</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full min-w-[800px]">
              <thead className="bg-slate-800/40">
                <tr>
                  <th className="p-4 text-left text-xs font-mono uppercase tracking-wider text-slate-400">Name</th>
                  <th className="p-4 text-left text-xs font-mono uppercase tracking-wider text-slate-400">Email</th>
                  <th className="p-4 text-left text-xs font-mono uppercase tracking-wider text-slate-400">Department</th>
                  <th className="p-4 text-left text-xs font-mono uppercase tracking-wider text-slate-400">Status</th>
                  <th className="p-4 text-center text-xs font-mono uppercase tracking-wider text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 text-slate-200 font-medium">{app.personalDetails?.name}</td>
                    <td className="p-4 text-slate-400 text-sm">{app.personalDetails?.email}</td>
                    <td className="p-4 text-slate-300 text-sm">{app.department}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${getStatusBadgeClass(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-center gap-3">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                      >
                        <Eye size={14} /> View Details
                      </button>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg p-1.5 focus:border-violet-500 focus:outline-none"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredApplications.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Candidate Profile Details Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border/40 bg-slate-900/40">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedApp.personalDetails?.name}
                  </h3>
                  <p className="text-xs text-violet-400 font-mono tracking-wider mt-0.5">// PROFILE DETAILS</p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-300">
                {/* Personal Information */}
                <div>
                  <h4 className="text-xs font-mono text-violet-400 uppercase tracking-widest mb-3">// PERSONAL DETAILS</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/30 p-4 rounded-xl border border-border/20">
                    <p><strong>Email:</strong> <span className="text-slate-200">{selectedApp.personalDetails?.email}</span></p>
                    <p><strong>Roll Number:</strong> <span className="text-slate-200">{selectedApp.personalDetails?.rollNumber}</span></p>
                    <p><strong>Contact:</strong> <span className="text-slate-200">{selectedApp.personalDetails?.contact}</span></p>
                    <p><strong>Campus:</strong> <span className="text-slate-200">{selectedApp.personalDetails?.campus}</span></p>
                    <p><strong>Branch:</strong> <span className="text-slate-200">{selectedApp.personalDetails?.branch}</span></p>
                    <p><strong>Department:</strong> <span className="text-violet-400 font-semibold">{selectedApp.department}</span></p>
                  </div>
                </div>

                {/* About & Why Join */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-mono text-violet-400 uppercase tracking-widest mb-1.5">// INTRODUCTION</h4>
                    <p className="bg-slate-900/30 p-3.5 rounded-xl border border-border/20 text-slate-300 leading-relaxed">
                      {selectedApp.personalDetails?.introduction}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono text-violet-400 uppercase tracking-widest mb-1.5">// REASON TO JOIN</h4>
                    <p className="bg-slate-900/30 p-3.5 rounded-xl border border-border/20 text-slate-300 leading-relaxed">
                      {selectedApp.personalDetails?.reasonToJoin}
                    </p>
                  </div>
                </div>

                {/* Department-Specific Answers */}
                <div>
                  <h4 className="text-xs font-mono text-violet-400 uppercase tracking-widest mb-3">// {selectedApp.department.toUpperCase()} ANSWERS</h4>
                  <div className="bg-slate-900/30 p-4 rounded-xl border border-border/20 space-y-3.5">
                    {Object.entries(selectedApp.departmentAnswers || {}).length > 0 ? (
                      Object.entries(selectedApp.departmentAnswers).map(([key, val]) => (
                        <div key={key} className="space-y-1">
                          <span className="text-xs font-mono text-slate-400 capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                          </span>
                          {typeof val === "string" && val.startsWith("http") ? (
                            <p>
                              <a
                                href={val}
                                target="_blank"
                                rel="noreferrer"
                                className="text-violet-400 hover:underline inline-flex items-center gap-1"
                              >
                                {val}
                              </a>
                            </p>
                          ) : (
                            <p className="text-slate-200">{val || "N/A"}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-xs">No specific answers provided.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-border/40 bg-slate-900/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusBadgeClass(selectedApp.status)}`}>
                    {selectedApp.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedApp.status}
                    onChange={(e) => handleStatusChange(selectedApp._id, e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg p-2 focus:border-violet-500 focus:outline-none"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-lg text-xs font-medium border border-slate-700/60"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

const StatCard = ({ title, value }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    className="p-5 bg-card/40 backdrop-blur-sm rounded-xl border border-border/30 text-center"
  >
    <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1.5">{title}</p>
    <p className="text-3xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-white to-slate-300">
      {value}
    </p>
  </motion.div>
);

export default AdminDashboard;
