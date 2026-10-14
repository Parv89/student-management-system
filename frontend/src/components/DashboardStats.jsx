import React from 'react';
import { Users, UserCheck, UserX, BookOpen } from 'lucide-react';

export default function DashboardStats({ stats, loading }) {
  const cards = [
    {
      label: 'Total Students',
      value: stats ? stats.totalStudents : 0,
      icon: Users,
      iconClass: 'stat-icon-purple',
    },
    {
      label: 'Active Students',
      value: stats ? stats.activeStudents : 0,
      icon: UserCheck,
      iconClass: 'stat-icon-emerald',
    },
    {
      label: 'Inactive Students',
      value: stats ? stats.inactiveStudents : 0,
      icon: UserX,
      iconClass: 'stat-icon-rose',
    },
    {
      label: 'Available Courses',
      value: stats ? stats.availableCourses : 0,
      icon: BookOpen,
      iconClass: 'stat-icon-amber',
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="stat-card">
            <div className={`stat-icon-wrapper ${card.iconClass}`}>
              <Icon size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">{card.label}</span>
              <span className="stat-value">
                {loading ? '...' : card.value.toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
