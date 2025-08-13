/**
 * adminKnowledgePointRoutes.js
 * 定义所有与“知识点”自身增删改查相关的 API 路由。
 */

const express = require('express');
const router = express.Router();

// 从控制器中导入需要用到的所有函数
const {
    getAllKnowledgePoints,
    getKnowledgePointById,
    createKnowledgePoint,
    updateKnowledgePoint, // 导入新函数
    deleteKnowledgePoint,
} = require('../controllers/adminKnowledgePointController.js');

// 规则一: 获取所有知识点列表 (GET /)
router.get('/', getAllKnowledgePoints);

// 规则二: 获取单个知识点 (GET /:id)
router.get('/:id', getKnowledgePointById);

// 规则三: 创建知识点 (POST /)
router.post('/', createKnowledgePoint);

// 规则四 (新增): 根据 ID 更新知识点 (PUT /:id)
router.put('/:id', updateKnowledgePoint);

// 规则五: 根据 ID 删除知识点 (DELETE /:id)
router.delete('/:id', deleteKnowledgePoint);


module.exports = router;