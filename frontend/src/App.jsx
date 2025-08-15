// frontend/src/App.jsx (最终完整版)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// 页面组件导入
import HomePage from './pages/HomePage';
import ExamPage from './pages/ExamPage';
import ResultPage from './pages/ResultPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

// 管理员页面组件导入
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminKnowledgePoints from './pages/admin/AdminKnowledgePoints';
import AdminExamQuestions from './pages/admin/AdminExamQuestions';
import AdminExamBoards from './pages/admin/AdminExamBoards';
import AdminSubjects from './pages/admin/AdminSubjects';
import AdminExams from './pages/admin/AdminExams';
//import AdminQuestionBank from './pages/admin/AdminQuestionBank';
//import AdminQuestionForm from './pages/admin/AdminQuestionForm';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* 公共路由 */}
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<HomePage />} />

                    {/* 学生端路由 */}
                    <Route path="/exam/:examId" element={<ExamPage />} />
                    <Route path="/results/:submissionId" element={<ResultPage />} />

                    {/* 管理员专属路由 */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/knowledge-points" element={<AdminKnowledgePoints />} />
                    <Route path="/admin/examboards" element={<AdminExamBoards />} />
                    <Route path="/admin/subjects" element={<AdminSubjects />} />
                    <Route path="/admin/exams" element={<AdminExams />} />
                    <Route path="/admin/exams/:examId/questions" element={<AdminExamQuestions />} />
                    {/*<Route path="/admin/questions" element={<AdminQuestionBank />} />*/}
                    {/*<Route path="/admin/questions/new" element={<AdminQuestionForm />} />*/}
                    {/*<Route path="/admin/questions/edit/:questionId" element={<AdminQuestionForm />} />*/}
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;