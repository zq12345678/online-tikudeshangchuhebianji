// frontend/src/pages/admin/AdminExams.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { adminGetAllExams, adminCreateExam } from '../../services/api';
import './Admin.css';

// --- 核心修正：将 CreateExamModal 组件从 AdminExams 内部“搬家”到外面 ---
// 现在它是一个独立的、顶级的组件，不再会被父组件的渲染所影响。
const CreateExamModal = ({ subjectId, onClose, onExamCreated }) => {
    const [title, setTitle] = useState('');
    const [durationMinutes, setDurationMinutes] = useState(90);
    const [examType, setExamType] = useState('PRACTICE');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !durationMinutes) {
            setError('所有字段都不能为空。');
            return;
        }
        try {
            const examData = {
                title,
                durationMinutes: parseInt(durationMinutes),
                examType,
                subjectId: parseInt(subjectId)
            };
            await adminCreateExam(examData);
            onExamCreated();
        } catch (err) {
            setError('创建失败，请重试。');
        }
    };

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                <h2>创建新试卷</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">试卷标题</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="例如: 第一单元 基础语法练习"
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="durationMinutes">考试时长 (分钟)</label>
                        <input
                            type="number"
                            id="durationMinutes"
                            value={durationMinutes}
                            onChange={(e) => setDurationMinutes(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="examType">试卷类型</label>
                        <select
                            id="examType"
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                        >
                            <option value="PRACTICE">单元练习</option>
                            <option value="MOCK_EXAM">模拟考试</option>
                        </select>
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


// AdminExams 组件现在只负责自己的逻辑，不再包含 CreateExamModal 的定义
const AdminExams = () => {
    const [searchParams] = useSearchParams();
    const subjectId = searchParams.get('subjectId');

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadExams = useCallback(async () => {
        if (!subjectId) {
            setError("未指定学科ID。");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await adminGetAllExams(subjectId);
            setExams(response.data);
        } catch (err) {
            setError('获取试卷列表失败。');
        } finally {
            setLoading(false);
        }
    }, [subjectId]);

    useEffect(() => {
        loadExams();
    }, [loadExams]);

    const handleExamCreated = useCallback(() => {
        setIsModalOpen(false);
        loadExams();
    }, [loadExams]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const practiceExams = exams.filter(e => e.examType === 'PRACTICE');
    const mockExams = exams.filter(e => e.examType === 'MOCK_EXAM');

    if (loading) return <div className="admin-container"><h1>正在加载...</h1></div>;
    if (error) return <div className="admin-container"><h1 className="error-message">{error}</h1></div>;

    return (
        <>
            <div className="admin-container">
                <header className="admin-header">
                    <h1>第三步：请选择一个试卷</h1>
                    <button onClick={() => setIsModalOpen(true)} className="admin-button primary">创建新试卷</button>
                </header>
                <p className="admin-breadcrumb">
                    <Link to="/admin">仪表盘</Link> &gt;
                    <Link to="/admin/examboards">考试局</Link> &gt;
                    <Link to={`/admin/subjects?examBoardId=${exams[0]?.subject.examBoardId || ''}`}>学科</Link> &gt; 试卷
                </p>

                <div className="admin-section">
                    <h2>单元练习</h2>
                    <div className="dashboard-grid">
                        {practiceExams.map(exam => (
                            <Link to={`/admin/exams/${exam.id}/questions`} key={exam.id} className="dashboard-card">
                                <h2>{exam.title}</h2>
                                <p>时长: {exam.durationMinutes} 分钟</p>
                            </Link>
                        ))}
                        {practiceExams.length === 0 && <p>该学科下暂无单元练习。</p>}
                    </div>
                </div>

                <div className="admin-section">
                    <h2>模拟考试</h2>
                    <div className="dashboard-grid">
                        {mockExams.map(exam => (
                            <Link to={`/admin/exams/${exam.id}/questions`} key={exam.id} className="dashboard-card">
                                <h2>{exam.title}</h2>
                                <p>时长: {exam.durationMinutes} 分钟</p>
                            </Link>
                        ))}
                        {mockExams.length === 0 && <p>该学科下暂无模拟考试。</p>}
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <CreateExamModal
                    subjectId={subjectId}
                    onClose={handleCloseModal}
                    onExamCreated={handleExamCreated}
                />
            )}
        </>
    );
};

export default AdminExams;