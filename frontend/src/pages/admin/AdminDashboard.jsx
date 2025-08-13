// frontend/src/pages/admin/AdminDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

const AdminDashboard = () => {
    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>管理员仪表盘</h1>
            </header>
            <div className="dashboard-grid">
                <Link to="/admin/examboards" className="dashboard-card">
                    <h2>试卷与题库管理</h2>
                    {/* 核心修正：将 -> 替换为 &gt; */}
                    <p>按考试局 &gt; 学科 &gt; 试卷的流程管理题目内容。</p>
                </Link>
                <Link to="/admin/knowledge-points" className="dashboard-card">
                    <h2>知识点管理</h2>
                    <p>创建、编辑和删除系统中的所有知识点标签。</p>
                </Link>
                <div className="dashboard-card disabled">
                    <h2>用户管理</h2>
                    <p>管理学生和管理员账户 (待开发)。</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;