import axios from 'axios';

export const request = axios.create({
  baseURL: 'https://openrouter.ai/api/v1'
});

request.interceptors.request.use(config => {
  config.headers['Authorization'] = `Bearer ${localStorage.getItem('openrouter_api_key')}`;
  return config;
}, error => {
  return Promise.reject(error);
});

request.interceptors.response.use(response => {
  return response.data;
}, error => {
  return Promise.reject(error);
});
