import { apiInstanceAuth } from "@/lib/api/apiInstance";

export const getOverview = async () =>
  apiInstanceAuth.get("/dashboard/stats").then((res) => res.data);
