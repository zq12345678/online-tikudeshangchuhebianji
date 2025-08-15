// frontend/src/pages/admin/AdminSubjects.jsx (稳定版)
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { adminGetAllSubjects, adminCreateSubject } from '../../services/api';
import './Admin.css';

const CreateSubjectModal = ({ examBoardId, onClose, onSubjectCreated }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('学科名称不能为空。');
            return;
        }
        try {
            const subjectData = { name, examBoardId: parseInt(examBoardId) };
            await adminCreateSubject(subjectData);
            onSubjectCreated();
        } catch (err) {
            setError('创建失败，请重试。');
        }
    };

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                <h2>创建新学科</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">学科名称</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="例如: AP Computer Science A"
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

const AdminSubjects = () => {
    const [searchParams] = useSearchParams();
    const examBoardId = searchParams.get('examBoardId');

    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadSubjects = useCallback(async () => {
        if (!examBoardId) {
            setError("未指定考试局ID。");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await adminGetAllSubjects(examBoardId);
            setSubjects(response.data);
        } catch (err) {
            setError('获取学科列表失败。');
        } finally {
            setLoading(false);
        }
    }, [examBoardId]);

    useEffect(() => {
        loadSubjects();
    }, [loadSubjects]);

    const handleSubjectCreated = useCallback(() => {
        setIsModalOpen(false);
        loadSubjects();
    }, [loadSubjects]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    if (loading) return <div className="admin-container"><h1>正在加载...</h1></div>;
    if (error) return <div className="admin-container"><h1 className="error-message">{error}</h1></div>;

    return (
        <>
            <div className="admin-container">
                <header className="admin-header">
                    <h1>第二步：请选择一个学科</h1>
                    <button onClick={() => setIsModalOpen(true)} className="admin-button primary">创建新学科</button>
                </header>
                <p className="admin-breadcrumb">
                    <Link to="/admin">仪表盘</Link> &gt;
                    <Link to="/admin/examboards">考试局</Link> &gt; 学科
                </p>

                <div className="dashboard-grid">
                    {subjects.map(subject => (
                        <Link to={`/admin/exams?subjectId=${subject.id}`} key={subject.id} className="dashboard-card">
                            <h2>{subject.name}</h2>
                            <p>点击进入，管理该学科下的所有试卷。</p>
                        </Link>
                    ))}
                </div>
            </div>
            {isModalOpen && (
                <CreateSubjectModal
                    examBoardId={examBoardId}
                    onClose={handleCloseModal}
                    onSubjectCreated={handleSubjectCreated}
                />
            )}
        </>
    );
};

export default AdminSubjects;