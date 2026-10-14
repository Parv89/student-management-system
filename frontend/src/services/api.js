/**
 * Cognevance Technologies - StudentHub API Client Service
 * Interacts with Spring Boot backend REST endpoints
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Generic request helper with standardized JSON parsing and error handling
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type') || '';
    let data = null;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : {};
    }

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.fieldErrors = data.fieldErrors || {};
      error.response = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const connError = new Error(
        'Unable to connect to the backend server. Please verify that the Spring Boot API is running on port 8080.'
      );
      connError.isNetworkError = true;
      throw connError;
    }
    throw err;
  }
}

export const studentApi = {
  /**
   * GET /api/students - Paginated and filtered student list
   */
  async getStudents({
    query = '',
    course = '',
    status = '',
    page = 0,
    size = 10,
    sortBy = 'id',
    sortDir = 'desc',
  } = {}) {
    const params = new URLSearchParams();
    if (query && query.trim()) params.append('query', query.trim());
    if (course && course.trim()) params.append('course', course.trim());
    if (status && status.trim()) params.append('status', status.trim());
    params.append('page', page);
    params.append('size', size);
    params.append('sortBy', sortBy);
    params.append('sortDir', sortDir);

    const res = await request(`/students?${params.toString()}`);
    return res.data; // Page<StudentResponseDto>
  },

  /**
   * GET /api/students/{id} - Retrieve student by ID
   */
  async getStudentById(id) {
    const res = await request(`/students/${id}`);
    return res.data;
  },

  /**
   * POST /api/students - Register a new student
   */
  async createStudent(studentData) {
    const res = await request('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
    return res.data;
  },

  /**
   * PUT /api/students/{id} - Update student record
   */
  async updateStudent(id, studentData) {
    const res = await request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
    return res.data;
  },

  /**
   * DELETE /api/students/{id} - Remove student record
   */
  async deleteStudent(id) {
    const res = await request(`/students/${id}`, {
      method: 'DELETE',
    });
    return res;
  },

  /**
   * GET /api/students/search?query= - Quick search by keyword
   */
  async searchStudents(keyword) {
    const res = await request(`/students/search?query=${encodeURIComponent(keyword || '')}`);
    return res.data;
  },

  /**
   * GET /api/students/stats - Aggregated stats for dashboard cards
   */
  async getDashboardStats() {
    const res = await request('/students/stats');
    return res.data;
  },

  /**
   * GET /api/students/courses - Distinct list of courses
   */
  async getCourses() {
    const res = await request('/students/courses');
    return res.data || [];
  },

  /**
   * GET /api/health - Backend and DB health check
   */
  async checkHealth() {
    return await request('/health');
  },
};
