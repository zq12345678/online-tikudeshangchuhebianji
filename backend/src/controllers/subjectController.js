// backend/src/controllers/subjectController.js (稳定版)
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

const getAllSubjects = async (req, res) => {
    try {
        const { examBoardId } = req.query;

        const whereClause = {};
        if (examBoardId) {
            whereClause.examBoardId = parseInt(examBoardId);
        }

        const subjects = await prisma.subject.findMany({
            where: whereClause,
            include: {
                examBoard: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
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