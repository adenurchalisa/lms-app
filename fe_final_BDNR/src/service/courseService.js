import { apiInstanceAuth } from "@/lib/api/apiInstance";

export const postCourse = async (data) =>
  apiInstanceAuth.post("/courses", data).then((res) => res.data);

export const getCourseByTeacher = async () =>
  apiInstanceAuth.get("/courses").then((res) => res.data);

export const getCourseById = async (id) =>
  apiInstanceAuth.get(`/courses/${id}`).then((res) => res.data);

export const updateCourse = async (id, data) =>
  apiInstanceAuth.put(`/courses/${id}/update`, data).then((res) => res.data);

export const deleteCourse = async (id) => {
  apiInstanceAuth.delete(`/courses/${id}/delete`).then((res) => res.data);
};
