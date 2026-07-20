import axios from "axios";

const API_URL = "http://localhost:5000/api/history";

// Get all history
export const getHistory = () => axios.get(API_URL);

// Save history
export const saveHistory = (data) =>
  axios.post(API_URL, data);

// Toggle favorite
export const toggleFavorite = (id) =>
  axios.patch(`${API_URL}/${id}/favorite`);

// Delete history
export const deleteHistory = (id) =>
  axios.delete(`${API_URL}/${id}`);