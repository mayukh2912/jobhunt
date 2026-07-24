import { useEffect, useState, useCallback, useMemo } from "react";
import { jobsApi } from "./api";
import Navbar from "./components/Navbar.jsx";
import JobRow from "./components/JobRow.jsx";
import JobFormModal from "./components/JobFormModal.jsx";
import JobViewModal from "./components/JobViewModal.jsx";

const PAGE_SIZE = 8;

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingId, setTogglingId] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [viewingJob, setViewingJob] = useState(null);
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1);
  const [jumpValue, setJumpValue] = useState("");

  const fetchJobs = useCallback(async (term) => {
    setLoading(true);
    setError("");
    try {
      const data = await jobsApi.list(term);
      setJobs(data);
    } catch (err) {
      setError(err.message || "Could not load job posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs("");
  }, [fetchJobs]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setPage(1);
      fetchJobs(search);
    }, 350);
    return () => clearTimeout(handle);
  }, [search, fetchJobs]);

  const totalPages = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE));
  const pageJobs = useMemo(
    () => jobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [jobs, page]
  );

  const handleToggle = async (id) => {
    setTogglingId(id);
    const prev = jobs;
    setJobs((cur) => cur.map((j) => (j._id === id ? { ...j, isActive: !j.isActive } : j)));
    try {
      await jobsApi.toggle(id);
    } catch (err) {
      setJobs(prev);
      setError(err.message || "Could not update job status.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleSave = async (id, form) => {
    try {
      const updated = await jobsApi.update(id, form);
      setJobs((cur) => cur.map((j) => (j._id === id ? updated : j)));
      setEditingJob(null);
    } catch (err) {
      setError(err.message || "Could not save changes.");
    }
  };

  const handleCreate = async (form) => {
    try {
      const created = await jobsApi.create(form);
      setJobs((cur) => [created, ...cur]);
      setCreating(false);
      setPage(1);
    } catch (err) {
      setError(err.message || "Could not create job post.");
    }
  };

  const handleDelete = async (id) => {
    const prev = jobs;
    setJobs((cur) => cur.filter((j) => j._id !== id));
    try {
      await jobsApi.remove(id);
    } catch (err) {
      setJobs(prev);
      setError(err.message || "Could not delete job post.");
    }
  };

  const toggleSelect = (id) => {
    setSelected((cur) => {
      const next = new Set(cur);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected((cur) =>
      cur.size === pageJobs.length ? new Set() : new Set(pageJobs.map((j) => j._id))
    );
  };

  const handleJump = (e) => {
    e.preventDefault();
    const n = parseInt(jumpValue, 10);
    if (n >= 1 && n <= totalPages) setPage(n);
    setJumpValue("");
  };

  return (
    <div className="app">
      <Navbar search={search} onSearchChange={setSearch} />

      <div className="page">
        <div className="page__head">
          <h1 className="page__title">All Live Jobs</h1>
          <button className="btn btn--primary" onClick={() => setCreating(true)}>
            Add/Post a Job
          </button>
        </div>

        {error && <p className="status-line status-line--error">{error}</p>}
        {loading && <p className="status-line">Loading job posts…</p>}

        <div className="table-wrap">
          {!loading && jobs.length === 0 ? (
            <div className="empty-state">No job posts match "{search}".</div>
          ) : (
            !loading && (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={selected.size === pageJobs.length && pageJobs.length > 0}
                          onChange={toggleSelectAll}
                          aria-label="Select all on page"
                        />
                      </th>
                      <th>Enter Job Title</th>
                      <th>Designation</th>
                      <th>Salary</th>
                      <th>Category</th>
                      <th>Job Type</th>
                      <th>Location</th>
                      <th>Deadline</th>
                      <th className="th--link">Actions</th>
                      <th>Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageJobs.map((job) => (
                      <JobRow
                        key={job._id}
                        job={job}
                        selected={selected.has(job._id)}
                        onSelect={toggleSelect}
                        onToggle={handleToggle}
                        onEdit={setEditingJob}
                        onDelete={handleDelete}
                        onView={setViewingJob}
                        toggling={togglingId === job._id}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {!loading && jobs.length > 0 && (
            <div className="pagination">
              <span>
                {page}/{totalPages} Pages
              </span>
              <form className="pagination__jump" onSubmit={handleJump}>
                <input
                  value={jumpValue}
                  onChange={(e) => setJumpValue(e.target.value)}
                  placeholder={String(page)}
                  aria-label="Jump to page"
                />
                <button type="submit" className="btn btn--primary btn--sm">Jump</button>
              </form>
              <div className="pagination__pages">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    className={`page-btn ${page === n ? "active" : ""}`}
                    onClick={() => setPage(n)}
                  >
                    {String(n).padStart(2, "0")}
                  </button>
                ))}
                <button
                  className="page-btn"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next »
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {editingJob && (
        <JobFormModal
          mode="edit"
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSubmit={(form) => handleSave(editingJob._id, form)}
        />
      )}
      {creating && (
        <JobFormModal mode="create" onClose={() => setCreating(false)} onSubmit={handleCreate} />
      )}
      {viewingJob && <JobViewModal job={viewingJob} onClose={() => setViewingJob(null)} />}
    </div>
  );
}
