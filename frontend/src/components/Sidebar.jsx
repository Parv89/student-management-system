import React from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BarChart3,
  Info,
  X,
  ExternalLink,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'analytics', label: 'Course Analytics', icon: BarChart3 },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: 35 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">
              <GraduationCap size={22} />
            </div>
            <div>
              <div className="brand-name">StudentHub</div>
              <div className="brand-subtitle">Cognevance Tech</div>
            </div>
          </div>
          <button
            className="mobile-menu-btn"
            style={{ color: '#94a3b8' }}
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <p>
            <strong>Internship Project</strong>
          </p>
          <p>Cognevance Technologies</p>
          <p style={{ marginTop: '0.4rem', color: '#64748b' }}>
            Java Full Stack v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
