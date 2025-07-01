import axios from "axios";

export const apiInstance = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  timeout: 2000,
});

export const apiInstanceAuth = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 2000,
});

apiInstanceAuth.interceptors.request.use(async (config) => {
  const session = JSON.parse(localStorage.getItem("credentials"));

  if (!session) {
    return config;
  }

  config.headers.Authorization = `JWT ${session.token}`;
  return config;
});
