import { apiInstanceAuth } from "@/lib/api/apiInstance";

export const getCourseStudent = async() => {
    console.log("Calling getCourseStudent API...");
    return apiInstanceAuth.get("/student/courses").then((res) => {
        console.log("getCourseStudent response:", res.data);
        return res.data;
    }).catch((error) => {
        console.error("getCourseStudent error:", error);
        throw error;
    });
};

export const getStudentOverview = async() =>
    apiInstanceAuth.get("/student/overview").then((res) => res.data);

export const getEnrolledCoursesDetailed = async() =>
    apiInstanceAuth.get("/student/courses/detailed").then((res) => res.data);

export const getAllAvailableCourses = async() =>
    apiInstanceAuth.get("/courses").then((res) => res.data);

export const enrollToCourse = async(courseId) =>
    apiInstanceAuth.post(`/courses/${courseId}/enroll`).then((res) => res.data);