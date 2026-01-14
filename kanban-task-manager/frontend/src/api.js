import axios from "axios";

// Construct base API URL from environment variables
const host = import.meta.env.VITE_API_HOST || "172.16.7.219";
const port = import.meta.env.VITE_API_PORT || "3000";
const API_BASE = `http://${host}:${port}/api`;

export const getTasks = () => axios.get(`${API_BASE}/tasks`);
export const getTaskById = (id) => axios.get(`${API_BASE}/tasks/${id}`);
export const createTask = (task) => axios.post(`${API_BASE}/tasks`, task);
export const updateTask = (id, updates) =>
	axios.patch(`${API_BASE}/tasks/${id}`, updates);
export const deleteTask = (id) => axios.delete(`${API_BASE}/tasks/${id}`);
