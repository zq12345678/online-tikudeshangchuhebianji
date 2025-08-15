// backend/src/controllers/examController.js (临时回退版本)
const prisma = require('../config/prismaClient');

const createExam = async (req, res) => {
    try {
        // 在回退版本中，我们只处理最基本的数据
        const { title, durationMinutes, subjectId } = req.body;

        if (!title || !durationMinutes || !subjectId) {
            return res.status(400).json({ error: '标题(title), 时长(durationMinutes), 和学科ID(subjectId)均不能为空' });
        }

        const newExam = await prisma.exam.create({
            data: {
                title: title,
                durationMinutes: parseInt(durationMinutes),
                subjectId: parseInt(subjectId),
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
        // --- 核心修改：移除所有复杂的 include 和 orderBy，只进行最基础的查询 ---
        const exams = await prisma.exam.findMany();
        res.status(200).json(exams);
    } catch (error) {
        console.error("获取试卷列表失败 (回退模式):", error);
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
            // 在回退版本中，也简化查询
            include: {
                questions: {
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