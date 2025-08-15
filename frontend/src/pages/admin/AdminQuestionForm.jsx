// frontend/src/pages/admin/AdminQuestionForm.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// 1. 导入 adminUpdateQuestion API 函数
import { adminGetAllSubjects, adminCreateQuestion, adminGetQuestionById, adminUpdateQuestion } from '../../services/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Admin.css';
import './AdminQuestionForm.css';

const AdminQuestionForm = () => {
    const { questionId } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(questionId);

    const [formData, setFormData] = useState({
        subjectId: '',
        questionText: '',
        stimulusText: '',
        questionType: 'MULTIPLE_CHOICE',
        layoutType: 'STACKED',
        explanation: '',
        isRealExam: false,
        realExamYear: '',
        realExamMonth: '',
        options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
        ],
        knowledgePointIds: []
    });

    const [subjects, setSubjects] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setPageLoading(true);
                setError(null);

                const subjectsPromise = adminGetAllSubjects();

                if (isEditing) {
                    const questionPromise = adminGetQuestionById(questionId);
                    const [subjectsResponse, questionResponse] = await Promise.all([subjectsPromise, questionPromise]);

                    const sortedSubjects = subjectsResponse.data.sort((a, b) => {
                        const boardA = a.examBoard?.name || '';
                        const boardB = b.examBoard?.name || '';
                        if (boardA.localeCompare(boardB) !== 0) return boardA.localeCompare(boardB);
                        return a.name.localeCompare(b.name);
                    });
                    setSubjects(sortedSubjects);

                    const questionData = questionResponse.data;
                    setFormData({
                        subjectId: questionData.subjectId,
                        questionText: questionData.questionText,
                        stimulusText: questionData.stimulusText || '',
                        questionType: questionData.questionType,
                        layoutType: questionData.layoutType,
                        explanation: questionData.explanation || '',
                        isRealExam: questionData.isRealExam,
                        realExamYear: questionData.realExamYear || '',
                        realExamMonth: questionData.realExamMonth || '',
                        options: questionData.multipleChoiceOptions.length > 0 ? questionData.multipleChoiceOptions : [{ text: '', isCorrect: false }],
                        knowledgePointIds: questionData.knowledgePoints.map(kp => kp.id)
                    });

                } else {
                    const subjectsResponse = await subjectsPromise;
                    const sortedSubjects = subjectsResponse.data.sort((a, b) => {
                        const boardA = a.examBoard?.name || '';
                        const boardB = b.examBoard?.name || '';
                        if (boardA.localeCompare(boardB) !== 0) return boardA.localeCompare(boardB);
                        return a.name.localeCompare(b.name);
                    });
                    setSubjects(sortedSubjects);
                }

            } catch (err) {
                setError('加载页面基础数据失败，请稍后重试。');
                console.error(err);
            } finally {
                setPageLoading(false);
            }
        };
        loadInitialData();
    }, [questionId, isEditing]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'isRealExam') {
            setFormData(prev => ({ ...prev, isRealExam: value === 'true' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const handleQuillChange = (content, fieldName) => {
        setFormData(prev => ({ ...prev, [fieldName]: content }));
    };

    const handleOptionChange = (index, field, value) => {
        const newOptions = formData.options.map(opt => ({ ...opt }));
        if (field === 'isCorrect') {
            newOptions.forEach((option, i) => { option.isCorrect = (i === index); });
        } else {
            newOptions[index][field] = value;
        }
        setFormData(prev => ({ ...prev, options: newOptions }));
    };

    const addOption = () => {
        setFormData(prev => ({ ...prev, options: [...prev.options, { text: '', isCorrect: false }] }));
    };

    const removeOption = (index) => {
        if (formData.options.length <= 2) return;
        setFormData(prev => ({ ...prev, options: prev.options.filter((_, i) => i !== index) }));
    };

    // 2. 实现完整的创建与更新逻辑
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.questionType === 'MULTIPLE_CHOICE') {
            if (!formData.options.some(opt => opt.isCorrect)) {
                setError('错误：请为选择题勾选一个正确答案。');
                return;
            }
            if (formData.options.some(opt => !opt.text || opt.text === '<p><br></p>')) {
                setError('错误：所有选项内容都不能为空。');
                return;
            }
        }

        setFormSubmitting(true);
        try {
            const questionData = {
                subjectId: parseInt(formData.subjectId),
                questionText: formData.questionText,
                stimulusText: formData.stimulusText || null,
                questionType: formData.questionType,
                layoutType: formData.layoutType,
                explanation: formData.explanation || null,
                isRealExam: formData.isRealExam,
                realExamYear: formData.isRealExam && formData.realExamYear ? parseInt(formData.realExamYear) : null,
                realExamMonth: formData.isRealExam && formData.realExamMonth ? parseInt(formData.realExamMonth) : null,
                options: formData.questionType === 'MULTIPLE_CHOICE' ? formData.options : [],
                knowledgePointIds: formData.knowledgePointIds.map(id => parseInt(id))
            };

            if (isEditing) {
                // 编辑模式：调用更新API
                await adminUpdateQuestion(questionId, questionData);
                alert('题目更新成功！');
            } else {
                // 创建模式：调用创建API
                await adminCreateQuestion(questionData);
                alert('题目创建成功！');
            }
            navigate('/admin/questions'); // 操作成功后返回题库列表

        } catch (err) {
            setError(err.response?.data?.error || `${isEditing ? '更新' : '创建'}题目失败，请检查所有必填项。`);
        } finally {
            setFormSubmitting(false);
        }
    };

    if (pageLoading) {
        return <div className="admin-container"><h1>正在加载...</h1></div>;
    }

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>{isEditing ? '编辑题目' : '创建新题目'}</h1>
            </header>
            <p className="admin-breadcrumb">
                <Link to="/admin">仪表盘</Link> &gt;
                <Link to="/admin/questions">题库管理</Link> &gt;
                {isEditing ? ' 编辑题目' : ' 创建新题目'}
            </p>

            <form onSubmit={handleSubmit} className="admin-form">
                {/* 第一部分：核心内容 */}
                <div className="form-section">
                    <div className="form-group">
                        <label htmlFor="subjectId">所属学科 *</label>
                        <select id="subjectId" name="subjectId" value={formData.subjectId} onChange={handleChange} required>
                            <option value="">-- 请选择学科 --</option>
                            {subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>{subject.examBoard?.name} - {subject.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>题干内容 *</label>
                        <ReactQuill theme="snow" value={formData.questionText} onChange={(content) => handleQuillChange(content, 'questionText')} />
                    </div>
                    <div className="form-group">
                        <label>附加材料 (可选)</label>
                        <ReactQuill theme="snow" value={formData.stimulusText} onChange={(content) => handleQuillChange(content, 'stimulusText')} />
                    </div>
                </div>

                {/* 第二部分：题目属性 */}
                <div className="form-section">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="questionType">题目类型 *</label>
                            <select id="questionType" name="questionType" value={formData.questionType} onChange={handleChange} required>
                                <option value="MULTIPLE_CHOICE">单项选择题</option>
                                <option value="FREE_RESPONSE">简答题</option>
                                <option value="PROGRAMMING">编程题</option>
                                <option value="MATCHING">匹配题</option>
                                <option value="DIAGRAM">图表题</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="layoutType">布局方式 *</label>
                            <select id="layoutType" name="layoutType" value={formData.layoutType} onChange={handleChange}>
                                <option value="STACKED">堆叠式 (材料在上，题目在下)</option>
                                <option value="SPLIT">分栏式 (材料在左，题目在右)</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="knowledgePointIds">知识点 (可选)</label>
                        <select id="knowledgePointIds" name="knowledgePointIds" value={formData.knowledgePointIds} onChange={handleChange} multiple>
                        </select>
                        <small>按住 Command (Mac) 或 Ctrl (Windows) 来选择多个。</small>
                    </div>
                </div>

                {/* 第三部分：真题信息 */}
                <div className="form-section">
                    <div className="form-group">
                        <label>是否为真题 *</label>
                        <div className="radio-group">
                            <div className="radio-option">
                                <input type="radio" id="isRealExam_false" name="isRealExam" value="false" checked={!formData.isRealExam} onChange={handleChange} />
                                <label htmlFor="isRealExam_false">这不是一道真题</label>
                            </div>
                            <div className="radio-option">
                                <input type="radio" id="isRealExam_true" name="isRealExam" value="true" checked={formData.isRealExam} onChange={handleChange} />
                                <label htmlFor="isRealExam_true">这是一道真题</label>
                            </div>
                        </div>
                    </div>

                    {formData.isRealExam && (
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="realExamYear">年份</label>
                                <input type="number" id="realExamYear" name="realExamYear" value={formData.realExamYear} onChange={handleChange} placeholder="例如: 2023" min="1990" max="2100" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="realExamMonth">月份</label>
                                <input type="number" id="realExamMonth" name="realExamMonth" value={formData.realExamMonth} onChange={handleChange} placeholder="例如: 5" min="1" max="12" />
                            </div>
                        </div>
                    )}
                </div>

                {/* 第四部分：答案与解析 */}
                <div className="form-section">
                    {formData.questionType === 'MULTIPLE_CHOICE' && (
                        <div className="form-group">
                            <label className="form-label-bold">选项 (请勾选一个作为正确答案) *</label>
                            <div className="options-container">
                                {formData.options.map((option, index) => (
                                    <div key={option.id || index} className="option-item-editor">
                                        <input type="radio" name="correct-option" checked={option.isCorrect} onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)} className="option-radio" />
                                        <label className="option-label">{String.fromCharCode(65 + index)}:</label>
                                        <div className="option-input-quill-wrapper">
                                            <ReactQuill theme="snow" value={option.text} onChange={(content) => handleOptionChange(index, 'text', content)} className="option-input-quill" />
                                        </div>
                                        <button type="button" onClick={() => removeOption(index)} className="admin-button danger-icon" disabled={formData.options.length <= 2}>&times;</button>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={addOption} className="admin-button add-option-button">+ 添加选项</button>
                        </div>
                    )}
                    <div className="form-group">
                        <label>答案解析 (可选)</label>
                        <ReactQuill theme="snow" value={formData.explanation} onChange={(content) => handleQuillChange(content, 'explanation')} />
                    </div>
                </div>

                {error && <p className="error-message">{error}</p>}
                <div className="form-actions">
                    <button type="button" className="admin-button" onClick={() => navigate('/admin/questions')}>取消</button>
                    <button type="submit" className="admin-button primary" disabled={formSubmitting}>{formSubmitting ? '保存中...' : '保存题目'}</button>
                </div>
            </form>
        </div>
    );
};

export default AdminQuestionForm;