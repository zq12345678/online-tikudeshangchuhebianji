// frontend/src/pages/admin/AdminExamQuestions.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getQuestionsForExam, deleteQuestion } from '../../services/api';
import './Admin.css';

const AdminExamQuestions = () => {
    // 从 URL 中获取 examId
    const { examId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 用于加载数据的函数
    const loadQuestions = async () => {
        try {
            setLoading(true);
            const response = await getQuestionsForExam(examId);
            // 按题号排序
            const sortedQuestions = response.data.sort((a, b) => a.order - b.order);
            setQuestions(sortedQuestions);
        } catch (err) {
            setError('获取题目列表失败。');
        } finally {
            setLoading(false);
        }
    };

    // 在组件加载时调用加载函数
    useEffect(() => {
        loadQuestions();
    }, [examId]);

    // 删除题目的处理函数
    const handleDelete = async (questionId) => {
        if (window.confirm('你确定要删除这道题吗？此操作无法撤销。')) {
            try {
                await deleteQuestion(examId, questionId);
                // 删除成功后，重新加载列表
                loadQuestions();
            } catch (err) {
                alert('删除失败！');
            }
        }
    };

    if (loading) return <div className="admin-container"><h1>正在加载题目...</h1></div>;
    if (error) return <div className="admin-container"><h1 className="error-message">{error}</h1></div>;

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>管理试卷题目 (Exam ID: {examId})</h1>
                {/* 之后我们会让这个按钮链接到创建题目页面 */}
                <Link to={`/admin/exams/${examId}/questions/new`} className="admin-button primary">
                    创建新题目
                </Link>
            </header>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>题号</th>
                        <th>题干预览</th>
                        <th>类型</th>
                        <th>知识点</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    {questions.map(q => (
                        <tr key={q.id}>
                            <td>{q.order}</td>
                            <td dangerouslySetInnerHTML={{ __html: q.questionText.substring(0, 50) + '...' }} />
                            <td>{q.questionType}</td>
                            <td>
                                {/* 将知识点标签显示出来 */}
                                {q.knowledgePoints.map(kp => (
                                    <span key={kp.id} className="admin-tag">{kp.name}</span>
                                ))}
                            </td>
                            <td>
                                <button className="admin-button">编辑</button>
                                <button onClick={() => handleDelete(q.id)} className="admin-button danger">删除</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminExamQuestions;