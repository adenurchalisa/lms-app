import { apiInstanceAuth } from "@/lib/api/apiInstance";

// Get enrolled students for a specific course (teacher only)
export const getEnrolledStudents = async(courseId) => {
    return apiInstanceAuth.get(`/courses/${courseId}/students`).then((res) => res.data);
};