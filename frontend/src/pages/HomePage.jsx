// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect, useContext } from 'react'; // 1. 导入 useContext
import { fetchAllExams } from '../services/api.js';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 2. 导入 AuthContext
import './HomePage.css';

const HomePage = () => {
    // 3. 从 Context 中获取 user 和 logout 函数
    const { user, logout } = useContext(AuthContext);

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getExams = async () => {
            try {
                const response = await fetchAllExams();
                setExams(response.data);
            } catch (err) {
                setError('无法加载试卷列表，请确认后端服务是否正在运行。');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getExams();
    }, []);

    if (loading) return <div className="homepage-container"><h1>正在加载...</h1></div>;
    if (error) return <div className="homepage-container"><h1 style={{ color: 'red' }}>{error}</h1></div>;

    return (
        <div className="homepage-container">
            {/* --- 核心修改：动态渲染右上角链接 --- */}
            <div className="auth-links">
                {user ? (
                    // 如果用户已登录
                    <>
                        <span className="welcome-message">欢迎你, {user.name}</span>
                        <button onClick={logout} className="auth-link logout">退出登录</button>
                    </>
                ) : (
                    // 如果用户未登录
                    <>
                        <Link to="/login" className="auth-link">登录</Link>
                        <Link to="/register" className="auth-link register">注册</Link>
                    </>
                )}
            </div>
            {/* --- 修改结束 --- */}

            <h1>在线模拟考试</h1>
            <h2>请选择一份试卷开始</h2>

            <div className="exam-list">
                {exams.length > 0 ? (
                    exams.map(exam => (
                        <Link to={`/exam/${exam.id}`} key={exam.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="exam-card">
                                <h3>{exam.title}</h3>
                                <p>{exam.subject?.examBoard?.name || '未知考试板块'} - {exam.subject?.name || '未知科目'}</p>
                                <span>时长：{exam.durationMinutes} 分钟</span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>当前没有可用的试卷。</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;