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
    const isLoginRequest = error.config && error.config.url && error.config.url.includes('/auth/login');
    if (error.response && error.response.status === 401 && !isLoginRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Transform flat form data into the nested structure the backend expects.
 * Only includes department-specific fields for the selected department.
 */
function transformApplicationData(data) {
  const deptFields = {
    'Tech': ['motivation', 'skills', 'portfolioLink'],
    'Graphic Design': ['interestReason', 'softwaresUsed', 'otherSoftware', 'driveLink'],
    'Photography': ['cameraModel', 'phoneModel', 'experienceLevel', 'portfolioLink'],
    'Content': ['controversialOpinion', 'deskItemStory', 'portfolioLink'],
    'Video Editing': ['editingSoftware', 'portfolioLink'],
  };

  const allowedFields = deptFields[data.department] || [];
  const departmentAnswers = {};
  for (const key of allowedFields) {
    if (data[key] !== undefined && data[key] !== '') {
      departmentAnswers[key] = data[key];
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
