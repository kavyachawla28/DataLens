import axios from "axios";
import API_URL from "./config";

const API = axios.create({
  baseURL: `${API_URL}/auth`,
});

export const registerUser = (userData) =>
  API.post("/register", userData);

export const loginUser = (userData) =>
  API.post("/login", userData);

export const sendResetOTP = (data) =>
  API.post("/send-reset-otp", data);

export const verifyResetOTP = (data) =>
  API.post("/verify-reset-otp", data);

export const resetPassword = (data) =>
  API.put("/reset-password", data);

export const changePassword = (token, data) =>
  API.put("/change-password", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const deleteAccount = (token) =>
  API.delete("/delete", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export default API;