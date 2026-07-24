export default function Navbar({ search, onSearchChange }) {
  return (
    <div className="navbar">
      <div className="brand">
        <span className="brand__name">Jobhunt</span>
        <span className="brand__tag">Powered By Reboot AI</span>
      </div>

      <div className="navlinks">
        <span className="active">Slider</span>
        <span>Job Managements</span>
        <span>Media</span>
      </div>

      <div className="navbar__search">
        <input
          type="text"
          placeholder="Search job posts…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search job posts"
        />
      </div>

      <div className="navbar__icons">
        <span className="icon-dot" title="Messages">💬</span>
        <span className="icon-dot" title="Notifications">🔔</span>
        <span className="icon-dot" title="Account">👤</span>
      </div>
    </div>
  );
}
