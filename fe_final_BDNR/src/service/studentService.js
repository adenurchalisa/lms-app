import { apiInstanceAuth } from "@/lib/api/apiInstance";

export const getCourseStudent = async () =>
  apiInstanceAuth.get("/student/courses").then((res) => res.data);
