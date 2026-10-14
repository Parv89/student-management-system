import React from 'react';
import { ShieldCheck, Database, Layers, Server, Terminal, CheckCircle2 } from 'lucide-react';

export default function AboutView() {
  const endpoints = [
    { method: 'GET', path: '/api/students', desc: 'Fetch paginated & filtered student list' },
    { method: 'GET', path: '/api/students/{id}', desc: 'Retrieve student details by primary key' },
    { method: 'POST', path: '/api/students', desc: 'Create new student with strict validation' },
    { method: 'PUT', path: '/api/students/{id}', desc: 'Update existing student record' },
    { method: 'DELETE', path: '/api/students/{id}', desc: 'Permanently remove student record' },
    { method: 'GET', path: '/api/students/search?query=', desc: 'Search students by name, email, or enrollment ID' },
    { method: 'GET', path: '/api/students/stats', desc: 'Get aggregated student and course statistics' },
    { method: 'GET', path: '/api/students/courses', desc: 'Fetch distinct list of registered courses' },
    { method: 'GET', path: '/api/health', desc: 'Liveness and MySQL database connectivity check' },
  ];

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Project Overview & Architecture</h2>
          <span className="enrollment-badge">Cognevance Technologies</span>
        </div>
        <div style={{ padding: '1.75rem' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.7' }}>
            This application is built for the <strong>Java Full Stack Developer Internship</strong> at{' '}
            <strong>Cognevance Technologies</strong>. It provides an enterprise-ready Student Management System
            featuring a decoupled architecture: a React 18 + Vite frontend and a Spring Boot 3.3 + Spring Data JPA
            backend connecting to a persistent MySQL 8 relational database.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ padding: '1.25rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem', color: 'var(--accent-purple)' }}>
                <Layers size={20} />
                <h4 style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>Frontend Architecture</h4>
              </div>
              <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                <li>React 18 with Vite build tooling</li>
                <li>Lucide React icon system</li>
                <li>Responsive layout for desktop, tablet & mobile</li>
                <li>Real-time search debouncing & multi-filter criteria</li>
                <li>Centralized API client with error handling</li>
              </ul>
            </div>

            <div style={{ padding: '1.25rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem', color: 'var(--accent-indigo)' }}>
                <Server size={20} />
                <h4 style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>Backend Architecture</h4>
              </div>
              <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                <li>Java 17 LTS & Spring Boot 3.3.4</li>
                <li>Spring Data JPA & Hibernate 6 ORM</li>
                <li>Jakarta Bean Validation (Hibernate Validator)</li>
                <li>Centralized Exception Handling (@RestControllerAdvice)</li>
                <li>RESTful API with parameterized JPQL queries</li>
              </ul>
            </div>

            <div style={{ padding: '1.25rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem', color: '#059669' }}>
                <Database size={20} />
                <h4 style={{ fontWeight: 700, color: 'var(--primary-navy)' }}>Database Design</h4>
              </div>
              <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                <li>MySQL 8 Relational Database</li>
                <li>Primary key: BigInt Auto-Increment</li>
                <li>Unique constraints on email & enrollment_number</li>
                <li>Automated audit timestamps (createdAt, updatedAt)</li>
                <li>Indexed on full_name, course, status, date</li>
              </ul>
            </div>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '1rem' }}>
            Registered REST API Endpoints
          </h3>
          <div className="table-responsive">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Endpoint</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {endpoints.map((ep, i) => (
                  <tr key={i}>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: 4,
                          color: ep.method === 'GET' ? '#065f46' : ep.method === 'POST' ? '#1e40af' : ep.method === 'PUT' ? '#92400e' : '#991b1b',
                          backgroundColor: ep.method === 'GET' ? '#d1fae5' : ep.method === 'POST' ? '#dbeafe' : ep.method === 'PUT' ? '#fef3c7' : '#fee2e2',
                        }}
                      >
                        {ep.method}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{ep.path}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{ep.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
