// frontend/src/services/api.js
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
export const getAllKnowledgePoints = () => apiClient.get('/admin/knowledge-points');
export const getQuestionsForExam = (examId) => apiClient.get(`/admin/exams/${examId}/questions`);
export const createQuestion = (examId, questionData) => apiClient.post(`/admin/exams/${examId}/questions`, questionData);
export const updateQuestion = (examId, questionId, questionData) => apiClient.put(`/admin/exams/${examId}/questions/${questionId}`, questionData);
export const deleteQuestion = (examId, questionId) => apiClient.delete(`/admin/exams/${examId}/questions/${questionId}`);
export const adminGetAllExamBoards = () => apiClient.get('/admin/examboards');
export const adminGetAllSubjects = (examBoardId) => apiClient.get('/admin/subjects', { params: { examBoardId } });
export const adminCreateSubject = (subjectData) => apiClient.post('/admin/subjects', subjectData);
export const adminGetAllExams = (subjectId) => apiClient.get('/admin/exams', { params: { subjectId } });
export const adminCreateExam = (examData) => apiClient.post('/admin/exams', examData);

// --- 核心修改：新增创建考试局的 Admin API ---
export const adminCreateExamBoard = (examBoardData) => {
    return apiClient.post('/admin/examboards', examBoardData);
};


export default apiClient;