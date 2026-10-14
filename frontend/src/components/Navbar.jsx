import React from 'react';
import { Menu, Plus, RefreshCw, Server, AlertCircle } from 'lucide-react';

export default function Navbar({
  pageTitle,
  healthStatus,
  checkingHealth,
  onRefreshHealth,
  onOpenAddModal,
  setMobileOpen,
}) {
  return (
    <header className="top-navbar">
      <div className="navbar-title-section">
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="page-title">{pageTitle}</h1>
      </div>

      <div className="navbar-actions">
        {/* Backend Connectivity Status Pill */}
        <div
          className={`health-badge ${
            healthStatus?.status === 'UP' ? 'connected' : 'offline'
          }`}
          onClick={onRefreshHealth}
          title={
            healthStatus?.status === 'UP'
              ? `Backend: Online (Database: ${healthStatus.database || 'CONNECTED'})`
              : 'Backend: Offline. Click to recheck.'
          }
        >
          <div className="health-dot" />
          <span>
            {checkingHealth
              ? 'Checking...'
              : healthStatus?.status === 'UP'
              ? 'API Online'
              : 'API Offline'}
          </span>
          <RefreshCw
            size={12}
            className={checkingHealth ? 'spinner' : ''}
            style={{ marginLeft: 2 }}
          />
        </div>

        {/* Add Student Quick Action */}
        <button className="btn btn-primary btn-sm" onClick={onOpenAddModal}>
          <Plus size={16} />
          <span>Add Student</span>
        </button>
      </div>
    </header>
  );
}
