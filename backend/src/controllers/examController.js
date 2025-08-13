// backend/src/controllers/examController.js
const prisma = require('../config/prismaClient');

const createExam = async (req, res) => {
    try {
        const { title, durationMinutes, subjectId, examType } = req.body; // 添加 examType

        if (!title || !durationMinutes || !subjectId) {
            return res.status(400).json({ error: '标题、时长和学科ID均不能为空' });
        }

        const newExam = await prisma.exam.create({
            data: {
                title: title,
                durationMinutes: parseInt(durationMinutes),
                subjectId: parseInt(subjectId),
                examType: examType || 'PRACTICE', // 如果没提供，默认为 PRACTICE
            },
        });

        res.status(201).json(newExam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '创建试卷时发生错误' });
    }
};

const getAllExams = async (req, res) => {
    try {
        const exams = await prisma.exam.findMany({
            include: {
                subject: {
                    include: {
                        examBoard: true,
                    },
                },
            },
        });
        res.status(200).json(exams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '获取试卷列表时发生错误' });
    }
};

const getExamById = async (req, res) => {
    try {
        const { examId } = req.params;
        const exam = await prisma.exam.findUnique({
            where: {
                id: examId,
            },
            include: {
                questions: {
                    orderBy: {
                        // 注意：Question 模型上已没有 order 字段，这里需要调整
                        // 暂时按 id 排序
                        id: 'asc',
                    },
                    include: {
                        multipleChoiceOptions: true,
                    },
                },
            },
        });

        if (!exam) {
            return res.status(404).json({ error: '找不到指定ID的试卷' });
        }

        res.status(200).json(exam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '获取试卷详情时发生错误' });
    }
};

module.exports = {
    createExam,
    getAllExams,
    getExamById,
};