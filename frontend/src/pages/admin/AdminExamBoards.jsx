// frontend/src/pages/admin/AdminExamBoards.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
// 核心修改：导入 adminCreateExamBoard 函数
import { adminGetAllExamBoards, adminCreateExamBoard } from '../../services/api';
import './Admin.css';

// 这是一个新的组件，专门用于创建考试局的模态框
const CreateExamBoardModal = ({ onClose, onExamBoardCreated }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('考试局名称不能为空。');
            return;
        }
        try {
            await adminCreateExamBoard({ name });
            onExamBoardCreated(); // 通知父组件刷新列表
        } catch (err) {
            setError('创建失败，请重试。');
        }
    };

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                <h2>创建新考试局</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">考试局名称</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="例如: AP"
                            autoFocus
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <div className="modal-actions">
                        <button type="button" className="admin-button" onClick={onClose}>取消</button>
                        <button type="submit" className="admin-button primary">创建</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const AdminExamBoards = () => {
    const [examBoards, setExamBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // 核心修改：增加控制模态框显示/隐藏的状态
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadExamBoards = useCallback(async () => {
        try {
            setLoading(true);
            const response = await adminGetAllExamBoards();
            setExamBoards(response.data);
        } catch (err) {
            setError('获取考试局列表失败。');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadExamBoards();
    }, [loadExamBoards]);

    // 创建成功后的回调函数
    const handleExamBoardCreated = useCallback(() => {
        setIsModalOpen(false);
        loadExamBoards();
    }, [loadExamBoards]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    if (loading) return <div className="admin-container"><h1>正在加载...</h1></div>;
    if (error) return <div className="admin-container"><h1 className="error-message">{error}</h1></div>;

    return (
        <>
            <div className="admin-container">
                <header className="admin-header">
                    <h1>第一步：请选择一个考试局</h1>
                    {/* 核心修改：让按钮能够打开模态框 */}
                    <button onClick={() => setIsModalOpen(true)} className="admin-button primary">创建新考试局</button>
                </header>
                <p className="admin-breadcrumb"><Link to="/admin">仪表盘</Link> &gt; 考试局</p>
                <div className="dashboard-grid">
                    {examBoards.map(board => (
                        <Link to={`/admin/subjects?examBoardId=${board.id}`} key={board.id} className="dashboard-card">
                            <h2>{board.name}</h2>
                            <p>点击进入，管理该考试局下的所有学科和试卷。</p>
                        </Link>
                    ))}
                    {examBoards.length === 0 && <p>暂无考试局，请先创建一个。</p>}
                </div>
            </div>
            {/* 核心修改：根据状态决定是否渲染模态框 */}
            {isModalOpen && (
                <CreateExamBoardModal
                    onClose={handleCloseModal}
                    onExamBoardCreated={handleExamBoardCreated}
                />
            )}
        </>
    );
};

export default AdminExamBoards;