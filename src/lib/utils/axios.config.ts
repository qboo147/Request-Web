import axios from 'axios';

export const projects_claims_API = axios.create({
  baseURL: import.meta.env.VITE_PROJECTS_CLAIMS_API,
});

export const staff_API = axios.create({
  baseURL: import.meta.env.VITE_STAFF_API,
});
