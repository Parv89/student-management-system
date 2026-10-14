import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import StudentTable from './components/StudentTable';
import StudentFormModal from './components/StudentFormModal';
import StudentDetailModal from './components/StudentDetailModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import AnalyticsView from './components/AnalyticsView';
import AboutView from './components/AboutView';
import Toast from './components/Toast';
import { studentApi } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Data states
  const [students, setStudents] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [availableCourses, setAvailableCourses] = useState([]);

  // Stats & Health
  const [stats, setStats] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  // Loading & Error states
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [studentError, setStudentError] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Modals
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [selectedStudentForForm, setSelectedStudentForForm] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formServerError, setFormServerError] = useState(null);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudentForDelete, setSelectedStudentForDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const searchDebounceTimer = useRef(null);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check backend health
  const checkHealth = useCallback(async () => {
    setCheckingHealth(true);
    try {
      const data = await studentApi.checkHealth();
      setHealthStatus(data);
    } catch {
      setHealthStatus({ status: 'DOWN', database: 'DISCONNECTED' });
    } finally {
      setCheckingHealth(false);
    }
  }, []);

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const data = await studentApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.warn('Failed to fetch dashboard stats:', err.message);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch distinct courses
  const fetchCourses = useCallback(async () => {
    try {
      const courses = await studentApi.getCourses();
      setAvailableCourses(courses);
    } catch (err) {
      console.warn('Failed to fetch courses:', err.message);
    }
  }, []);

  // Fetch student records from API
  const fetchStudents = useCallback(
    async (page = currentPage, size = pageSize, query = searchQuery, course = courseFilter, status = statusFilter) => {
      setLoadingStudents(true);
      setStudentError(null);
      try {
        const pageData = await studentApi.getStudents({
          page,
          size,
          query,
          course,
          status,
          sortBy: 'id',
          sortDir: 'desc',
        });
        setStudents(pageData?.content || []);
        setTotalElements(pageData?.totalElements || 0);
        setTotalPages(pageData?.totalPages || 0);
      } catch (err) {
        setStudentError(err.message || 'Failed to load students');
      } finally {
        setLoadingStudents(false);
      }
    },
    [currentPage, pageSize, searchQuery, courseFilter, statusFilter]
  );

  // Initial load
  useEffect(() => {
    checkHealth();
    fetchStats();
    fetchCourses();
    fetchStudents(0, pageSize, '', '', '');
  }, []);

  // Debounced search trigger
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(0);
    if (searchDebounceTimer.current) clearTimeout(searchDebounceTimer.current);
    searchDebounceTimer.current = setTimeout(() => {
      fetchStudents(0, pageSize, query, courseFilter, statusFilter);
    }, 350);
  };

  const handleCourseFilterChange = (course) => {
    setCourseFilter(course);
    setCurrentPage(0);
    fetchStudents(0, pageSize, searchQuery, course, statusFilter);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(0);
    fetchStudents(0, pageSize, searchQuery, courseFilter, status);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchStudents(newPage, pageSize, searchQuery, courseFilter, statusFilter);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(0);
    fetchStudents(0, newSize, searchQuery, courseFilter, statusFilter);
  };

  // Open Form Modal: Add
  const handleOpenAdd = () => {
    setFormMode('add');
    setSelectedStudentForForm(null);
    setFormServerError(null);
    setFormModalOpen(true);
  };

  // Open Form Modal: Edit
  const handleOpenEdit = (student) => {
    setFormMode('edit');
    setSelectedStudentForForm(student);
    setFormServerError(null);
    setFormModalOpen(true);
  };

  // Open Details Modal
  const handleOpenDetail = (student) => {
    setSelectedStudentForDetail(student);
    setDetailModalOpen(true);
  };

  // Open Delete Modal
  const handleOpenDelete = (student) => {
    setSelectedStudentForDelete(student);
    setDeleteModalOpen(true);
  };

  // Submit Student Form (Add or Edit)
  const handleFormSubmit = async (formData) => {
    setIsSubmittingForm(true);
    setFormServerError(null);
    try {
      if (formMode === 'add') {
        const created = await studentApi.createStudent(formData);
        addToast(`Student "${created.fullName}" created successfully!`, 'success');
      } else {
        const updated = await studentApi.updateStudent(selectedStudentForForm.id, formData);
        addToast(`Student "${updated.fullName}" updated successfully!`, 'success');
      }
      setFormModalOpen(false);
      // Refresh UI data from real database
      fetchStudents(currentPage, pageSize, searchQuery, courseFilter, statusFilter);
      fetchStats();
      fetchCourses();
    } catch (err) {
      const msg = err.response?.message || err.message || 'Operation failed';
      setFormServerError(msg);
      addToast(msg, 'error');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Confirm and Execute Delete
  const handleConfirmDelete = async () => {
    if (!selectedStudentForDelete) return;
    setIsDeleting(true);
    try {
      await studentApi.deleteStudent(selectedStudentForDelete.id);
      addToast(`Student "${selectedStudentForDelete.fullName}" was deleted.`, 'info');
      setDeleteModalOpen(false);
      setSelectedStudentForDelete(null);
      // Refresh data
      fetchStudents(currentPage, pageSize, searchQuery, courseFilter, statusFilter);
      fetchStats();
      fetchCourses();
    } catch (err) {
      addToast(err.message || 'Failed to delete student record.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'students':
        return 'Student Directory';
      case 'analytics':
        return 'Academic Analytics';
      case 'about':
        return 'Project Documentation';
      case 'dashboard':
      default:
        return 'Dashboard Overview';
    }
  };

  return (
    <div className="app-layout">
      {/* Toast Notification Layer */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main App Container */}
      <div className="main-wrapper">
        <Navbar
          pageTitle={getPageTitle()}
          healthStatus={healthStatus}
          checkingHealth={checkingHealth}
          onRefreshHealth={checkHealth}
          onOpenAddModal={handleOpenAdd}
          setMobileOpen={setMobileOpen}
        />

        <main className="content-body">
          {/* Dashboard Summary Metric Cards (Visible on Dashboard and Students tabs) */}
          {(activeTab === 'dashboard' || activeTab === 'students') && (
            <DashboardStats stats={stats} loading={loadingStats} />
          )}

          {/* Tab Views */}
          {(activeTab === 'dashboard' || activeTab === 'students') && (
            <StudentTable
              students={students}
              totalElements={totalElements}
              totalPages={totalPages}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              courseFilter={courseFilter}
              onCourseFilterChange={handleCourseFilterChange}
              statusFilter={statusFilter}
              onStatusFilterChange={handleStatusFilterChange}
              availableCourses={availableCourses}
              loading={loadingStudents}
              error={studentError}
              onRetry={() => fetchStudents(currentPage, pageSize, searchQuery, courseFilter, statusFilter)}
              onViewStudent={handleOpenDetail}
              onEditStudent={handleOpenEdit}
              onDeleteStudent={handleOpenDelete}
              onOpenAddModal={handleOpenAdd}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              stats={stats}
              loading={loadingStats}
              courses={availableCourses}
            />
          )}

          {activeTab === 'about' && <AboutView />}
        </main>
      </div>

      {/* Modals */}
      <StudentFormModal
        isOpen={formModalOpen}
        mode={formMode}
        student={selectedStudentForForm}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmittingForm}
        serverError={formServerError}
      />

      <StudentDetailModal
        isOpen={detailModalOpen}
        student={selectedStudentForDetail}
        onClose={() => setDetailModalOpen(false)}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        student={selectedStudentForDelete}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
