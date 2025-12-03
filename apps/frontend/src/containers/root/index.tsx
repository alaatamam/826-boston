import { Outlet, NavLink } from 'react-router-dom';
import './styles.css';

export default function Root() {
  return (
    <div className="root-shell">
      {/* Left sidebar */}
      <aside className="root-sidebar">
        <div className="sidebar-logo">826 BOSTON</div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <button type="button" className="sidebar-section-label">
              Home
            </button>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-label">
              Library + Publication Archive
            </div>
            <ul className="sidebar-links">
              <li>
                <NavLink
                  to="/library/publication/all"
                  className={({ isActive }) =>
                    'sidebar-link' + (isActive ? ' sidebar-link--active' : '')
                  }
                >
                  All Publications
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/library/publication/in-progress"
                  className={({ isActive }) =>
                    'sidebar-link' + (isActive ? ' sidebar-link--active' : '')
                  }
                >
                  In Progress
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/library/publication/archived"
                  className={({ isActive }) =>
                    'sidebar-link' + (isActive ? ' sidebar-link--active' : '')
                  }
                >
                  Archived
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-label">Projects</div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-label">Resources</div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-label">People</div>
          </div>
        </nav>

        <button type="button" className="sidebar-logout">
          ⟲ Log Out
        </button>
      </aside>

      {/* Main content area */}
      <main className="root-main">
        {/* Whatever route we’re on (e.g., Archived) renders here */}
        <Outlet />
      </main>
    </div>
  );
}
