// frontend/src/pages/admin/AdminQuestionBank.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// 1. 导入删除题目的API函数
import { adminGetAllQuestions, adminDeleteQuestion } from '../../services/api';
import './Admin.css';

const AdminQuestionBank = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. 将获取数据的逻辑封装到一个可复用的函数中
    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const response = await adminGetAllQuestions();
            setQuestions(response.data);
        } catch (err) {
            setError('获取题库列表失败，请确保您以管理员身份登录。');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    // 3. 新增处理删除操作的函数
    const handleDelete = async (questionId) => {
        // 弹出确认框
        if (window.confirm('您确定要永久删除这道题吗？此操作无法撤销。')) {
            try {
                await adminDeleteQuestion(questionId);
                alert('题目删除成功！');
                // 删除成功后，重新加载列表
                fetchQuestions();
            } catch (err) {
                alert('删除失败，请稍后重试。');
                console.error(err);
            }
        }
    };

    if (loading) {
        return <div className="admin-container"><h1>正在加载题库...</h1></div>;
    }

    if (error) {
        return <div className="admin-container"><h1 className="error-message">{error}</h1></div>;
    }

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>题库管理</h1>
                <Link to="/admin/questions/new" className="admin-button primary">
                    创建新题目
                </Link>
            </header>
            <p className="admin-breadcrumb"><Link to="/admin">仪表盘</Link> &gt; 题库管理</p>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>题干预览</th>
                        <th>类型</th>
                        <th>所属学科</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    {questions.map(q => (
                        <tr key={q.id}>
                            <td>{q.id}</td>
                            <td dangerouslySetInnerHTML={{ __html: q.questionText.substring(0, 70) + '...' }} />
                            <td>{q.questionType}</td>
                            <td>{q.subject?.name || '未指定'}</td>
                            <td>
                                <Link to={`/admin/questions/edit/${q.id}`} className="admin-button">
                                    编辑
                                </Link>
                                {/* 4. 将 handleDelete 函数绑定到按钮的 onClick 事件 */}
                                <button onClick={() => handleDelete(q.id)} className="admin-button danger">
                                    删除
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminQuestionBank;