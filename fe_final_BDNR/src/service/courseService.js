import { apiInstanceAuth } from "@/lib/api/apiInstance";

export const postCourse = async (data) =>
  apiInstanceAuth.post("/courses", data).then((res) => res.data);
