// frontend/src/pages/admin/AdminKnowledgePoints.jsx
import React, { useState, useEffect } from 'react';
// 核心修正：确保导入的是 getAllKnowledgePoints (它在 api.js 中已经是 admin 版本)
import { getAllKnowledgePoints } from '../../services/api';
import { Link } from 'react-router-dom'; // 导入 Link
import './Admin.css';

const AdminKnowledgePoints = () => {
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPoints = async () => {
            try {
                const response = await getAllKnowledgePoints();
                setPoints(response.data);
            } catch (err) {
                if (err.response && (err.response.status === 403 || err.response.status === 401)) {
                    setError('权限不足，请确保您以管理员身份登录。');
                } else {
                    setError('获取知识点列表失败，请检查后端服务是否运行。');
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPoints();
    }, []);

    if (loading) {
        return <div className="admin-container"><h1>正在加载...</h1></div>;
    }

    if (error) {
        return <div className="admin-container"><h1 className="error-message">{error}</h1></div>;
    }

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>知识点管理</h1>
                <button className="admin-button primary">创建新知识点</button>
            </header>
            {/* 新增面包屑导航 */}
            <p className="admin-breadcrumb"><Link to="/admin">仪表盘</Link> &gt; 知识点管理</p>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>名称</th>
                        <th>所属学科 ID</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    {points.map(point => (
                        <tr key={point.id}>
                            <td>{point.id}</td>
                            <td>{point.name}</td>
                            <td>{point.subjectId}</td>
                            <td>
                                <button className="admin-button">编辑</button>
                                <button className="admin-button danger">删除</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminKnowledgePoints;