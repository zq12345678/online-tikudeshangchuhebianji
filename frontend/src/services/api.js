// frontend/src/services/api.js (稳定版)
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3001/api',
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- Public & Student Services ---
export const fetchAllExams = () => apiClient.get('/exams');
export const fetchExamById = (examId) => apiClient.get(`/exams/${examId}`);
export const submitExamAnswers = (examId, answers) => apiClient.post('/submissions', { examId, answers });

// --- Auth Services ---
export const registerUser = (userData) => apiClient.post('/auth/register', userData);
export const loginUser = (credentials) => apiClient.post('/auth/login', credentials);

// --- Admin Services ---
export const adminCreateExamBoard = (examBoardData) => apiClient.post('/admin/examboards', examBoardData);
export const adminGetAllExamBoards = () => apiClient.get('/admin/examboards');
export const adminCreateSubject = (subjectData) => apiClient.post('/admin/subjects', subjectData);
export const adminCreateExam = (examData) => apiClient.post('/admin/exams', examData);

export const adminGetAllSubjects = (examBoardId) => {
    return apiClient.get('/admin/subjects', { params: { examBoardId } });
};
export const adminGetAllExams = (subjectId) => {
    return apiClient.get('/admin/exams', { params: { subjectId } });
};

// ... 其他 Admin API 保持不变 ...
export const getAllKnowledgePoints = () => apiClient.get('/admin/knowledge-points');
export const adminGetAllQuestions = (subjectId) => apiClient.get('/admin/questions', { params: { subjectId } });
export const adminGetQuestionById = (questionId) => apiClient.get(`/admin/questions/${questionId}`);
export const adminCreateQuestion = (questionData) => apiClient.post('/admin/questions', questionData);
export const adminUpdateQuestion = (questionId, questionData) => apiClient.put(`/admin/questions/${questionId}`, questionData);
export const adminDeleteQuestion = (questionId) => apiClient.delete(`/admin/questions/${questionId}`);

// 添加缺失的函数
export const getQuestionsForExam = (examId) => apiClient.get(`/admin/exams/${examId}/questions`);
export const deleteQuestion = (examId, questionId) => apiClient.delete(`/admin/exams/${examId}/questions/${questionId}`);

export default apiClient;