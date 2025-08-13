// backend/src/controllers/adminQuestionController.js
const prisma = require('../config/prismaClient');

/**
 * 获取题库中的所有题目 (可按学科筛选)
 */
const getAllQuestions = async (req, res) => {
    try {
        const { subjectId } = req.query; // 允许通过 URL query 参数进行筛选，例如 /questions?subjectId=1

        const whereClause = subjectId ? { subjectId: parseInt(subjectId) } : {};

        const questions = await prisma.question.findMany({
            where: whereClause,
            include: { subject: true, knowledgePoints: true },
            orderBy: { id: 'asc' },
        });
        res.status(200).json(questions);
    } catch (error) {
        console.error("获取题库列表失败:", error);
        res.status(500).json({ error: '获取题库列表失败' });
    }
};

/**
 * 在题库中创建一道新题目
 */
const createQuestion = async (req, res) => {
    try {
        // 核心修改：不再从 URL params 获取 examId
        const {
            subjectId,
            questionText,
            stimulusText,
            questionType,
            layoutType,
            explanation,
            isRealExam,
            realExamYear,
            realExamMonth,
            options,
            knowledgePointIds
        } = req.body;

        if (!subjectId || !questionText || !questionType) {
            return res.status(400).json({ error: '学科ID, 题干和题目类型不能为空' });
        }

        const newQuestion = await prisma.question.create({
            data: {
                subjectId: parseInt(subjectId),
                questionText,
                stimulusText,
                questionType,
                layoutType,
                explanation,
                isRealExam,
                realExamYear: realExamYear ? parseInt(realExamYear) : null,
                realExamMonth: realExamMonth ? parseInt(realExamMonth) : null,
                multipleChoiceOptions: questionType === 'MULTIPLE_CHOICE' && options ? {
                    create: options.map(opt => ({ text: opt.text, isCorrect: opt.isCorrect })),
                } : undefined,
                knowledgePoints: knowledgePointIds && knowledgePointIds.length > 0 ? {
                    connect: knowledgePointIds.map(id => ({ id: parseInt(id) })),
                } : undefined,
            },
            include: { multipleChoiceOptions: true, knowledgePoints: true },
        });
        res.status(201).json(newQuestion);
    } catch (error) {
        console.error("创建题目失败:", error);
        res.status(500).json({ error: '创建题目失败' });
    }
};

/**
 * 更新题库中的一道题目
 */
const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            subjectId,
            questionText,
            stimulusText,
            questionType,
            layoutType,
            explanation,
            isRealExam,
            realExamYear,
            realExamMonth,
            options,
            knowledgePointIds
        } = req.body;

        const updatedQuestion = await prisma.question.update({
            where: { id },
            data: {
                subjectId: subjectId ? parseInt(subjectId) : undefined,
                questionText,
                stimulusText,
                questionType,
                layoutType,
                explanation,
                isRealExam,
                realExamYear: realExamYear ? parseInt(realExamYear) : undefined,
                realExamMonth: realExamMonth ? parseInt(realExamMonth) : undefined,
                knowledgePoints: knowledgePointIds ? {
                    set: knowledgePointIds.map(kid => ({ id: parseInt(kid) })),
                } : undefined,
            },
            include: { knowledgePoints: true, multipleChoiceOptions: true },
        });

        // 此处简化了选项更新，实际项目可能需要更复杂的事务
        res.status(200).json(updatedQuestion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '更新题目失败' });
    }
};

/**
 * 从题库中删除一道题目
 */
const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.question.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: '删除题目失败' });
    }
};

// 我们还需要一个获取单个题目的函数，用于编辑
const getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await prisma.question.findUnique({
            where: { id },
            include: { knowledgePoints: true, multipleChoiceOptions: true },
        });
        if (!question) {
            return res.status(404).json({ error: "题目未找到" });
        }
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ error: '获取题目详情失败' });
    }
}


module.exports = {
    getAllQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
};