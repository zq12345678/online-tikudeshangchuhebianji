// backend/src/controllers/adminExamController.js
const prisma = require('../config/prismaClient');

// ... getAllExams, getExamById 函数保持不变 ...
const getAllExams = async (req, res) => {
    try {
        const { subjectId } = req.query;
        const whereClause = {};
        if (subjectId) {
            whereClause.subjectId = parseInt(subjectId);
        }
        const exams = await prisma.exam.findMany({
            where: whereClause,
            include: {
                subject: true,
                createdBy: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ error: '获取试卷列表失败' });
    }
};
const getExamById = async (req, res) => {
    try {
        const { id } = req.params;
        const exam = await prisma.exam.findUnique({ where: { id } });
        if (!exam) return res.status(404).json({ error: '试卷未找到' });
        res.status(200).json(exam);
    } catch (error) {
        res.status(500).json({ error: '获取试卷详情失败' });
    }
};

// --- 核心修改：为 createExam 函数增加详细的诊断日志 ---
const createExam = async (req, res) => {
    console.log('--- 诊断: 进入 createExam 函数 ---');
    try {
        console.log('诊断 (1/5): 成功进入 try 代码块');

        const { title, durationMinutes, subjectId, examType } = req.body;
        console.log('诊断 (2/5): 从 req.body 获取的数据:', { title, durationMinutes, subjectId, examType });

        // 这是最关键的诊断点
        console.log('诊断 (3/5): 检查 req.user 对象:', req.user);
        if (!req.user || !req.user.id) {
            console.error('致命错误: req.user 或 req.user.id 不存在！');
            return res.status(500).json({ error: '服务器内部错误：无法识别用户信息' });
        }
        const creatorId = req.user.id;
        console.log(`诊断 (4/5): 成功获取到创建者 ID: ${creatorId}`);

        const newExam = await prisma.exam.create({
            data: {
                title,
                durationMinutes: parseInt(durationMinutes),
                subjectId: parseInt(subjectId),
                examType: examType || 'PRACTICE',
                createdById: creatorId,
            },
        });

        console.log('诊断 (5/5): 数据库创建成功！');
        res.status(201).json(newExam);

    } catch (error) {
        // 如果程序能运行到这里，我们就能看到详细的 Prisma 错误
        console.error("--- 捕获到错误! ---");
        console.error("详细错误信息:", error);
        res.status(500).json({ error: '创建试卷失败' });
    }
};

// ... updateExam, deleteExam 函数保持不变 ...
const updateExam = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, durationMinutes, subjectId, examType } = req.body;
        const updatedExam = await prisma.exam.update({
            where: { id },
            data: {
                title,
                durationMinutes: parseInt(durationMinutes),
                subjectId: parseInt(subjectId),
                examType,
            },
        });
        res.status(200).json(updatedExam);
    } catch (error) {
        res.status(500).json({ error: '更新试卷失败' });
    }
};
const deleteExam = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.exam.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: '删除试卷失败' });
    }
};


module.exports = {
    getAllExams,
    getExamById,
    createExam,
    updateExam,
    deleteExam,
};