import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getApplications, updateApplicationStatus, getStats } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, LogOut, Search, Filter, CheckCircle2, Clock, Users, UserCheck } from "lucide-react";
import Navbar from "../components/common/Navbar";
import CursorBlob from "../components/common/CursorBlob";

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
      return "bg-muted text-muted-foreground border-border";
    case "under-review":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "shortlisted":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "rejected":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "selected":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const questionLabels = {
  motivation: "Motivation to Join Tech",
  skills: "Proficient Languages & Frameworks",
  portfolioLink: "Portfolio / Work Drive Link",
  interestReason: "Motivation to Join Graphic Design",
  softwaresUsed: "Softwares Used",
  taskLink: "Task Submission Link",
  brownieLink: "Brownie Points Post Link",
  previousWorkLink: "Previous Work Link / N/A",
  cameraModel: "Camera Model Used",
  phoneModel: "Phone Model Used",
  experienceLevel: "Current Level in Photography",
  controversialOpinion: "Controversial Opinion",
  deskItemStory: "Boring Item Backstory",
  editingSoftware: "Video Editing Software Used",
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
      setError(err.response?.data?.message || "Failed to load applications data.");
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
      if (selectedApp && selectedApp._id === id) {
        setSelectedApp((prev) => ({ ...prev, status: newStatus }));
      }
      const statsRes = await getStats();
      setStats(statsRes.data);
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  const filteredApplications = allApplications.filter((app) => {
    const matchesDept = selectedDept === "All" || app.department === selectedDept;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      (app.personalDetails?.name || "").toLowerCase().includes(query) ||
      (app.personalDetails?.email || "").toLowerCase().includes(query) ||
      (app.personalDetails?.rollNumber || "").toLowerCase().includes(query);

    return matchesDept && matchesSearch;
  });

  if (loading && allApplications.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 pt-28">
        <Navbar />
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-8 w-52 bg-muted rounded-md" />
              <div className="h-4 w-36 bg-muted rounded-md" />
            </div>
            <div className="h-10 w-24 bg-muted rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted/40 border border-border rounded-xl" />
            ))}
          </div>
          <div className="bg-card border border-border rounded-2xl h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 pt-28 sm:pt-32 relative transition-colors duration-300">
      <CursorBlob />
      <Navbar />

      <div className="max-w-7xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-xs text-accent font-semibold tracking-widest uppercase mb-1">// ADMIN PANEL</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-sans">
              Recruitment Submissions
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Logged in as {admin?.name || "Admin"}</p>
          </div>
          <button
            onClick={logout}
            className="h-10 px-5 inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 text-accent font-semibold text-xs hover:bg-accent hover:text-accent-foreground transition-all duration-200 cursor-pointer"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-semibold"
          >
            ⚠️ {error}
          </motion.div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
            <StatCard title="Total Applications" value={stats.totalApplications} icon={<Users className="w-4 h-4 text-accent" />} />
            <StatCard title="Pending Review" value={stats.pending} icon={<Clock className="w-4 h-4 text-amber-500" />} />
            <StatCard title="Shortlisted" value={stats.shortlisted} icon={<CheckCircle2 className="w-4 h-4 text-blue-500" />} />
            <StatCard title="Selected" value={stats.selected} icon={<UserCheck className="w-4 h-4 text-emerald-500" />} />
          </div>
        )}

        {/* Applications List Table */}
        <div className="glass-card rounded-2xl border border-border overflow-hidden shadow-xl">
          <div className="p-5 sm:p-6 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground font-sans">Applicant Records</h2>
              <p className="text-xs text-muted-foreground font-mono">// TOTAL {filteredApplications.length} CANDIDATES FOUND</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search name, email, roll..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 input-field text-xs py-2 pl-9 pr-3 rounded-full"
                />
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* Department Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="input-field text-xs py-2 px-3 rounded-full cursor-pointer"
                >
                  <option value="All">All Domains</option>
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
            <table className="w-full min-w-[750px]">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="p-4 text-left text-xs font-mono uppercase tracking-wider text-muted-foreground">Name</th>
                  <th className="p-4 text-left text-xs font-mono uppercase tracking-wider text-muted-foreground">Email</th>
                  <th className="p-4 text-left text-xs font-mono uppercase tracking-wider text-muted-foreground">Department</th>
                  <th className="p-4 text-left text-xs font-mono uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="p-4 text-center text-xs font-mono uppercase tracking-wider text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-foreground font-semibold text-sm">{app.personalDetails?.name}</td>
                    <td className="p-4 text-muted-foreground text-xs">{app.personalDetails?.email}</td>
                    <td className="p-4 text-accent text-xs font-mono font-semibold">{app.department}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border capitalize ${getStatusBadgeClass(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="h-8 px-3 inline-flex items-center gap-1.5 rounded-full bg-muted border border-border text-xs text-foreground hover:border-accent hover:text-accent transition-all cursor-pointer font-medium"
                      >
                        <Eye size={13} /> View
                      </button>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className="h-8 bg-muted border border-border text-foreground text-xs rounded-full px-2 focus:border-accent focus:outline-none cursor-pointer"
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
                    <td colSpan={5} className="p-12 text-center text-muted-foreground text-sm font-mono">
                      No matching candidate applications found.
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl glass-card rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col border border-border"
            >
              <div className="flex items-center justify-between p-6 border-b border-border bg-card">
                <div>
                  <h3 className="text-xl font-bold text-foreground font-sans">
                    {selectedApp.personalDetails?.name}
                  </h3>
                  <p className="text-xs text-accent font-mono tracking-wider mt-0.5">// CANDIDATE DOSSIER</p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="h-8 w-8 rounded-full border border-border bg-muted flex items-center justify-center text-foreground hover:border-accent hover:text-accent transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-foreground">
                <div>
                  <h4 className="text-xs font-mono text-accent uppercase tracking-widest mb-3 font-semibold">// PERSONAL DETAILS</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/40 p-4 rounded-2xl border border-border text-xs">
                    <p><strong className="text-muted-foreground">Email:</strong> {selectedApp.personalDetails?.email}</p>
                    <p><strong className="text-muted-foreground">Roll Number:</strong> {selectedApp.personalDetails?.rollNumber}</p>
                    <p><strong className="text-muted-foreground">Contact:</strong> {selectedApp.personalDetails?.contact}</p>
                    <p><strong className="text-muted-foreground">Campus:</strong> {selectedApp.personalDetails?.campus}</p>
                    <p><strong className="text-muted-foreground">Branch & Year:</strong> {selectedApp.personalDetails?.branch}</p>
                    <p><strong className="text-muted-foreground">Department:</strong> <span className="text-accent font-semibold">{selectedApp.department}</span></p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-mono text-accent uppercase tracking-widest mb-1.5 font-semibold">// ABOUT CANDIDATE</h4>
                    <p className="bg-muted/40 p-4 rounded-2xl border border-border text-xs leading-relaxed text-foreground">
                      {selectedApp.personalDetails?.introduction}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono text-accent uppercase tracking-widest mb-1.5 font-semibold">// REASON TO JOIN</h4>
                    <p className="bg-muted/40 p-4 rounded-2xl border border-border text-xs leading-relaxed text-foreground">
                      {selectedApp.personalDetails?.reasonToJoin}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono text-accent uppercase tracking-widest mb-3 font-semibold">// {selectedApp.department.toUpperCase()} ANSWERS</h4>
                  <div className="bg-muted/40 p-4 rounded-2xl border border-border space-y-3 text-xs">
                    {Object.entries(selectedApp.departmentAnswers || {}).length > 0 ? (
                      Object.entries(selectedApp.departmentAnswers).map(([key, val]) => (
                        <div key={key} className="space-y-1">
                          <span className="text-xs font-mono text-muted-foreground uppercase font-semibold">
                            {questionLabels[key] || key.replace(/([A-Z])/g, " $1")}
                          </span>
                          {typeof val === "string" && val.startsWith("http") ? (
                            <p>
                              <a
                                href={val}
                                target="_blank"
                                rel="noreferrer"
                                className="text-accent hover:underline inline-flex items-center gap-1 font-semibold"
                              >
                                {val}
                              </a>
                            </p>
                          ) : (
                            <p className="text-foreground">{val || "N/A"}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-xs font-mono">No department specific answers provided.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">STATUS:</span>
                  <span className={`px-3 py-0.5 rounded-full text-xs font-mono font-semibold border capitalize ${getStatusBadgeClass(selectedApp.status)}`}>
                    {selectedApp.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedApp.status}
                    onChange={(e) => handleStatusChange(selectedApp._id, e.target.value)}
                    className="h-9 bg-muted border border-border text-foreground text-xs rounded-full px-3 focus:border-accent focus:outline-none cursor-pointer font-medium"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="h-9 px-5 bg-accent text-accent-foreground rounded-full text-xs font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    className="p-5 glass-card rounded-2xl border border-border text-center flex flex-col items-center justify-center gap-1"
  >
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground font-semibold">{title}</p>
    </div>
    <p className="text-3xl font-extrabold text-foreground font-sans">
      {value}
    </p>
  </motion.div>
);

export default AdminDashboard;
