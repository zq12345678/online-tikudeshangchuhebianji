/**
 * adminKnowledgePointController.js
 * 负责处理知识点（KnowledgePoint）的增删改查（CRUD）操作。
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * 获取所有知识点的列表
 */
const getAllKnowledgePoints = async (req, res) => {
    try {
        const knowledgePoints = await prisma.knowledgePoint.findMany({
            orderBy: { id: 'asc' },
        });
        res.status(200).json(knowledgePoints);
    } catch (error) {
        console.error("❌ 获取知识点列表失败:", error);
        res.status(500).json({ error: "获取知识点列表时发生服务器内部错误。" });
    }
};

/**
 * 根据 ID 获取单个知识点
 */
const getKnowledgePointById = async (req, res) => {
    try {
        const knowledgePointId = parseInt(req.params.id, 10);
        if (isNaN(knowledgePointId)) {
            return res.status(400).json({ error: '无效的ID格式。' });
        }
        const knowledgePoint = await prisma.knowledgePoint.findUnique({
            where: { id: knowledgePointId },
        });
        if (!knowledgePoint) {
            return res.status(404).json({ error: `ID 为 ${knowledgePointId} 的知识点不存在。` });
        }
        res.status(200).json(knowledgePoint);
    } catch (error) {
        console.error(`❌ 获取ID为 ${req.params.id} 的知识点失败:`, error);
        res.status(500).json({ error: "获取单个知识点时发生服务器内部错误。" });
    }
};

/**
 * 创建一个新的知识点
 */
const createKnowledgePoint = async (req, res) => {
    try {
        const { name, subjectId } = req.body;
        if (!name || !subjectId) {
            return res.status(400).json({ error: "请求参数不完整，需要提供 name 和 subjectId。" });
        }
        const newKnowledgePoint = await prisma.knowledgePoint.create({
            data: {
                name: name,
                subject: { connect: { id: subjectId } },
            },
        });
        res.status(201).json(newKnowledgePoint);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: `关联失败，ID 为 ${req.body.subjectId} 的 Subject 不存在。` });
        }
        console.error("❌ 在 createKnowledgePoint 函数中发生错误:", error);
        res.status(500).json({ error: "创建知识点时发生服务器内部错误。" });
    }
};

/**
 * 新增功能：根据 ID 更新一个知识点
 */
const updateKnowledgePoint = async (req, res) => {
    try {
        const knowledgePointId = parseInt(req.params.id, 10);
        if (isNaN(knowledgePointId)) {
            return res.status(400).json({ error: '无效的ID格式。' });
        }

        const { name, subjectId } = req.body;
        // 验证请求体中是否包含要更新的数据
        if (!name && !subjectId) {
            return res.status(400).json({ error: '请求体中至少需要提供 name 或 subjectId 来进行更新。' });
        }

        const updatedKnowledgePoint = await prisma.knowledgePoint.update({
            where: { id: knowledgePointId },
            data: {
                name: name, // 如果 name 未提供，则为 undefined，Prisma 会忽略它
                subjectId: subjectId ? parseInt(subjectId, 10) : undefined, // 如果 subjectId 提供了，确保是数字
            },
        });
        res.status(200).json(updatedKnowledgePoint);

    } catch (error) {
        // 检查是否是因为记录不存在而导致的更新失败
        if (error.code === 'P2025') {
            return res.status(404).json({ error: `ID 为 ${req.params.id} 的知识点不存在，无法更新。` });
        }
        console.error(`❌ 更新ID为 ${req.params.id} 的知识点失败:`, error);
        res.status(500).json({ error: "更新知识点时发生服务器内部错误。" });
    }
};


/**
 * 根据 ID 删除一个知识点
 */
const deleteKnowledgePoint = async (req, res) => {
    try {
        const knowledgePointId = parseInt(req.params.id, 10);
        if (isNaN(knowledgePointId)) {
            return res.status(400).json({ error: '无效的ID格式。' });
        }
        await prisma.knowledgePoint.delete({
            where: { id: knowledgePointId },
        });
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: `ID 为 ${req.params.id} 的知识点不存在，无法删除。` });
        }
        console.error("❌ 在 deleteKnowledgePoint 函数中发生错误:", error);
        res.status(500).json({ error: "删除知识点时发生服务器内部错误。" });
    }
};

// 确保所有函数都被导出
module.exports = {
    getAllKnowledgePoints,
    getKnowledgePointById,
    createKnowledgePoint,
    updateKnowledgePoint, // 导出新函数
    deleteKnowledgePoint,
};