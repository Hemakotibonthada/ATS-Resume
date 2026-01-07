import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const saveResume = async (resume) => {
  const response = await api.post('/resumes', resume);
  return response.data;
};

export const getResume = async (id) => {
  const response = await api.get(`/resumes/${id}`);
  return response.data;
};

export const listResumes = async () => {
  const response = await api.get('/resumes');
  return response.data;
};

export const deleteResume = async (id) => {
  const response = await api.delete(`/resumes/${id}`);
  return response.data;
};

export const scoreResume = async (resume) => {
  const response = await api.post('/score', resume);
  return response.data;
};

export const analyzeResume = async (resume) => {
  const response = await api.post('/analyze', resume);
  return response.data;
};

export const matchJob = async (resume, job) => {
  const response = await api.post('/match-job', { resume, job });
  return response.data;
};

export const optimizeKeywords = async (resume, job) => {
  const response = await api.post('/optimize-keywords', { resume, job });
  return response.data;
};

export const getSuggestions = async (resume) => {
  const response = await api.post('/suggestions', resume);
  return response.data;
};

export const getTemplates = async () => {
  const response = await api.get('/templates');
  return response.data;
};

export default api;
