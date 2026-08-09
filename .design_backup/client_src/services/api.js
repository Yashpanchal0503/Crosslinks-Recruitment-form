import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Transform flat form data into the nested structure the backend expects.
 */
function transformApplicationData(data) {
  const personalFields = ['fullName', 'email', 'rollNumber', 'contactNumber', 'campus', 'branch', 'about', 'whyJoin', 'department'];
  const departmentAnswers = {};
  for (const [key, value] of Object.entries(data)) {
    if (!personalFields.includes(key) && value !== undefined && value !== '') {
      departmentAnswers[key] = value;
    }
  }
  return {
    personalDetails: {
      name: data.fullName,
      email: data.email,
      rollNumber: data.rollNumber,
      contact: data.contactNumber,
      campus: data.campus,
      branch: data.branch,
      introduction: data.about,
      reasonToJoin: data.whyJoin,
    },
    department: data.department,
    departmentAnswers,
  };
}

export const submitApplication = (data) => api.post('/applications', transformApplicationData(data));
export const getDepartments = () => api.get('/departments');
export const login = (credentials) => api.post('/auth/login', credentials);
export const getApplications = (params) => api.get('/admin/applications', { params });
export const getApplication = (id) => api.get(`/admin/applications/${id}`);
export const updateApplicationStatus = (id, status) => api.patch(`/admin/applications/${id}/status`, { status });
export const getStats = () => api.get('/admin/stats');
export const getProfile = () => api.get('/admin/profile');

export default api;
