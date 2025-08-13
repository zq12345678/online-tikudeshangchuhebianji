// backend/src/server.js (最终完整版)

// 在所有代码之前，首先加载 .env 文件中的环境变量
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { protect, isAdmin } = require('./middleware/authMiddleware');

// 导入所有路由文件
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const adminExamRoutes = require('./routes/adminExamRoutes');
const adminKnowledgePointRoutes = require('./routes/adminKnowledgePointRoutes');
const adminQuestionTaggingRoutes = require('./routes/adminQuestionTaggingRoutes');
const adminQuestionRoutes = require('./routes/adminQuestionRoutes');
const adminSubjectRoutes = require('./routes/adminSubjectRoutes');
const adminExamBoardRoutes = require('./routes/adminExamBoardRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- 公共 API (无需登录即可访问) ---
app.use('/api/auth', authRoutes);

// --- 学生端 API ---
app.use('/api/exams', examRoutes);
app.use('/api/submissions', submissionRoutes);

// --- 管理员专用 API (需要登录且必须是管理员) ---
const adminMiddlewares = [protect, isAdmin];
app.use('/api/admin/exams', adminMiddlewares, adminExamRoutes);
app.use('/api/admin/knowledge-points', adminMiddlewares, adminKnowledgePointRoutes);
app.use('/api/admin/question-tags', adminMiddlewares, adminQuestionTaggingRoutes);
app.use('/api/admin/questions', adminMiddlewares, adminQuestionRoutes);
app.use('/api/admin/subjects', adminMiddlewares, adminSubjectRoutes);
app.use('/api/admin/examboards', adminMiddlewares, adminExamBoardRoutes);

app.listen(PORT, () => {
    console.log(`后端服务器正在 http://localhost:${PORT} 上运行`);
});