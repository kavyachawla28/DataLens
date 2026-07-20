import axios from "axios";

const API = "http://localhost:5000/api/history";

export const getHistory = () => axios.get(API);

export const saveHistory = (history) =>
  axios.post(API, history);

export const deleteHistory = (id) =>
  axios.delete(`${API}/${id}`);