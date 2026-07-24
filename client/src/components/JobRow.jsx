export default function JobRow({ job, selected, onSelect, onToggle, onEdit, onDelete, onView, toggling }) {
  return (
    <tr>
      <td>
        <input
          type="checkbox"
          className="checkbox"
          checked={selected}
          onChange={() => onSelect(job._id)}
          aria-label={`Select ${job.title}`}
        />
      </td>
      <td className="job-title">{job.title}</td>
      <td>{job.designation}</td>
      <td>{job.salary}</td>
      <td>{job.category}</td>
      <td>{job.jobType}</td>
      <td>{job.location}</td>
      <td>{job.deadline}</td>
      <td>
        <div className="row-actions">
          <button className="link--view" onClick={() => onView(job)}>View</button>
          <span>|</span>
          <button className="link--edit" onClick={() => onEdit(job)}>Edit</button>
          <span>|</span>
          <button className="link--delete" onClick={() => onDelete(job._id)}>Delete</button>
        </div>
      </td>
      <td>
        <label className="switch" title={job.isActive ? "Deactivate" : "Activate"}>
          <input
            type="checkbox"
            checked={job.isActive}
            disabled={toggling}
            onChange={() => onToggle(job._id)}
            aria-label={`Toggle ${job.title} active status`}
          />
          <span className="switch__track" />
        </label>
      </td>
    </tr>
  );
}
