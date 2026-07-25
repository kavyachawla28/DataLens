import axios from "axios";

const API_URL = "http://localhost:5000/api/history";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Get logged-in user's history
export const getHistory = () =>
  axios.get(API_URL, getAuthConfig());

// Save history
export const saveHistory = (data) =>
  axios.post(API_URL, data, getAuthConfig());

// Toggle favorite
export const toggleFavorite = (id) =>
  axios.patch(
    `${API_URL}/${id}/favorite`,
    {},
    getAuthConfig()
  );

// Delete history
export const deleteHistory = (id) =>
  axios.delete(
    `${API_URL}/${id}`,
    getAuthConfig()
  );