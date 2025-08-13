// backend/src/controllers/subjectController.js
const prisma = require('../config/prismaClient');

const createSubject = async (req, res) => {
    try {
        const { name, examBoardId } = req.body;
        if (!name || !examBoardId) {
            return res.status(400).json({ error: '学科名称 (name) 和考试局ID (examBoardId) 不能为空' });
        }
        const newSubject = await prisma.subject.create({
            data: {
                name: name,
                examBoardId: parseInt(examBoardId),
            },
        });
        res.status(201).json(newSubject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '创建学科时发生错误' });
    }
};

// --- 核心修改：升级 getAllSubjects 函数以支持筛选 ---
const getAllSubjects = async (req, res) => {
    try {
        const { examBoardId } = req.query; // 从 URL query 中获取 examBoardId

        // 创建一个查询条件对象
        const whereClause = {};
        if (examBoardId) {
            // 如果提供了 examBoardId，就将其加入查询条件
            whereClause.examBoardId = parseInt(examBoardId);
        }

        const subjects = await prisma.subject.findMany({
            where: whereClause, // 应用查询条件
            include: {
                examBoard: true,
            },
        });
        res.status(200).json(subjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '获取学科列表时发生错误' });
    }
};

module.exports = {
    createSubject,
    getAllSubjects,
};