import { useState } from "react";

const emptyForm = {
  title: "",
  designation: "",
  salary: "",
  category: "",
  jobType: "Full-Time",
  location: "",
  deadline: "",
  description: "",
};

export default function JobFormModal({ mode, job, onClose, onSubmit }) {
  const [form, setForm] = useState(
    job
      ? {
          title: job.title,
          designation: job.designation,
          salary: job.salary,
          category: job.category,
          jobType: job.jobType,
          location: job.location,
          deadline: job.deadline,
          description: job.description,
        }
      : emptyForm
  );
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{mode === "create" ? "Add / Post a job" : "Edit job post"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="field-grid">
            <div className="field field--full">
              <label htmlFor="title">Job Title</label>
              <input id="title" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="field">
              <label htmlFor="designation">Designation</label>
              <input id="designation" name="designation" value={form.designation} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="salary">Salary</label>
              <input id="salary" name="salary" value={form.salary} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="category">Category</label>
              <input id="category" name="category" value={form.category} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="jobType">Job Type</label>
              <select id="jobType" name="jobType" value={form.jobType} onChange={handleChange}>
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="location">Location</label>
              <input id="location" name="location" value={form.location} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="deadline">Deadline</label>
              <input id="deadline" name="deadline" placeholder="dd/mm/yy" value={form.deadline} onChange={handleChange} />
            </div>
            <div className="field field--full">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" rows={3} value={form.description} onChange={handleChange} />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? "Saving…" : mode === "create" ? "Post job" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
