export default function JobViewModal({ job, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{job.title}</h2>
        <div className="field-grid">
          <div className="field">
            <label>Designation</label>
            <div>{job.designation || "—"}</div>
          </div>
          <div className="field">
            <label>Salary</label>
            <div>{job.salary || "—"}</div>
          </div>
          <div className="field">
            <label>Category</label>
            <div>{job.category || "—"}</div>
          </div>
          <div className="field">
            <label>Job Type</label>
            <div>{job.jobType || "—"}</div>
          </div>
          <div className="field">
            <label>Location</label>
            <div>{job.location || "—"}</div>
          </div>
          <div className="field">
            <label>Deadline</label>
            <div>{job.deadline || "—"}</div>
          </div>
          <div className="field field--full">
            <label>Status</label>
            <span className={`status-pill ${job.isActive ? "status-pill--active" : "status-pill--inactive"}`}>
              {job.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          {job.description && (
            <div className="field field--full">
              <label>Description</label>
              <div>{job.description}</div>
            </div>
          )}
        </div>
        <div className="modal-actions">
          <button className="btn btn--primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
