import React from 'react';
import { BookOpen, BarChart2, PieChart, CheckCircle2 } from 'lucide-react';

export default function AnalyticsView({ stats, loading, courses }) {
  if (loading) {
    return (
      <div className="card">
        <div className="state-box">
          <div className="spinner" />
          <p className="state-title" style={{ marginTop: '0.8rem' }}>
            Loading Analytics...
          </p>
        </div>
      </div>
    );
  }

  const distribution = stats?.courseDistribution || {};
  const total = stats?.totalStudents || 0;
  const active = stats?.activeStudents || 0;
  const inactive = stats?.inactiveStudents || 0;
  const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;
  const inactivePercent = total > 0 ? Math.round((inactive / total) * 100) : 0;

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BarChart2 size={20} color="var(--accent-purple)" />
            <span>Course Enrollment Distribution</span>
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Real-time counts aggregated from MySQL records
          </span>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {Object.keys(distribution).length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>
              No course distribution data available. Add student records to view course analytics.
            </p>
          ) : (
            <div className="course-badges-grid">
              {Object.entries(distribution).map(([courseName, count]) => {
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={courseName} className="course-metric-card">
                    <div>
                      <div className="course-name">{courseName}</div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary)',
                          marginTop: '0.2rem',
                        }}
                      >
                        {percentage}% of total student body
                      </div>
                    </div>
                    <span className="course-count-badge">{count} enrolled</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Enrollment Status Ratio */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <PieChart size={20} color="var(--accent-indigo)" />
            <span>Enrollment Status Ratio</span>
          </h2>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--status-active-text)' }}>Active Students</span>
                <span style={{ fontWeight: 700 }}>{active} ({activePercent}%)</span>
              </div>
              <div style={{ height: 10, backgroundColor: '#e2e8f0', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ width: `${activePercent}%`, height: '100%', backgroundColor: '#10b981', transition: 'width 0.4s' }} />
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--status-inactive-text)' }}>Inactive Students</span>
                <span style={{ fontWeight: 700 }}>{inactive} ({inactivePercent}%)</span>
              </div>
              <div style={{ height: 10, backgroundColor: '#e2e8f0', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ width: `${inactivePercent}%`, height: '100%', backgroundColor: '#ef4444', transition: 'width 0.4s' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
