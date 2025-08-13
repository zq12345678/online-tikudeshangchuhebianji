// backend/src/controllers/adminExamController.js
const prisma = require('../config/prismaClient');

// --- 核心修改：升级 getAllExams 函数以支持筛选 ---
const getAllExams = async (req, res) => {
    try {
        const { subjectId } = req.query; // 从 URL query 中获取 subjectId

        const whereClause = {};
        if (subjectId) {
            whereClause.subjectId = parseInt(subjectId);
        }

        const exams = await prisma.exam.findMany({
            where: whereClause,
            include: { subject: true },
            orderBy: { title: 'asc' },
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

const createExam = async (req, res) => {
    try {
        const { title, durationMinutes, subjectId, examType } = req.body;
        const newExam = await prisma.exam.create({
            data: {
                title,
                durationMinutes: parseInt(durationMinutes),
                subjectId: parseInt(subjectId),
                examType: examType || 'PRACTICE',
            },
        });
        res.status(201).json(newExam);
    } catch (error) {
        res.status(500).json({ error: '创建试卷失败' });
    }
};

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