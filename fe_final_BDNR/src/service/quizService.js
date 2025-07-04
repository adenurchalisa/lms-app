import { apiInstanceAuth } from "@/lib/api/apiInstance";

// Teacher: Create quiz for a course
export const createQuiz = async(courseId, quizData) => {
    return apiInstanceAuth.post(`/courses/${courseId}/quizzes`, quizData).then((res) => res.data);
};

// Get all quizzes for a course
export const getQuizzesByCourse = async(courseId) => {
    return apiInstanceAuth.get(`/courses/${courseId}/quizzes`).then((res) => res.data);
};

// Student: Get quiz detail (without answers)
export const getQuizDetail = async(quizId) => {
    return apiInstanceAuth.get(`/quizzes/${quizId}`).then((res) => res.data);
};

// Student: Submit quiz answers
export const submitQuiz = async(quizId, answers) => {
    return apiInstanceAuth.post(`/quizzes/${quizId}/submit`, { answers }).then((res) => res.data);
};

// Student: Get my submission for a quiz
export const getMySubmission = async(quizId) => {
    return apiInstanceAuth.get(`/quizzes/${quizId}/mysubmission`).then((res) => res.data);
};

// Teacher: Get all submissions for a quiz
export const getQuizSubmissions = async(quizId) => {
    return apiInstanceAuth.get(`/quizzes/${quizId}/submissions`).then((res) => res.data);
};