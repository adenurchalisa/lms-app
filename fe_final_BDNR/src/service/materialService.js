import { apiInstanceAuth } from "@/lib/api/apiInstance";

export const postMaterialCourse = async (data, id) =>
  apiInstanceAuth
    .post(`/courses/${id}/materials`, data, {
      headers: {
        "content-type": "multipart/form-data",
      },
    })
    .then((res) => res.data);

export const updateMaterial = async (materialId, data) =>
  apiInstanceAuth
    .put(`/materials/${materialId}`, data, {
      headers: {
        "content-type": "multipart/form-data",
      },
    })
    .then((res) => res.data);

export const deleteMaterial = async (materialId) =>
  apiInstanceAuth.delete(`/materials/${materialId}`).then((res) => res.data);
