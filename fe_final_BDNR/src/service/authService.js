import { apiInstance } from "@/lib/api/apiInstance";

export const authRegister = async (data) =>
  apiInstance.post("/register", data).then((res) => res.data);

export const authLogin = async (data) =>
  apiInstance.post("/login", data).then((res) => res.data);
