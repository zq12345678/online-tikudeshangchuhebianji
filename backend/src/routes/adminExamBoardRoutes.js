// backend/src/routes/adminExamBoardRoutes.js
const express = require('express');
const router = express.Router();
const { createExamBoard, getAllExamBoards } = require('../controllers/examBoardController');

// POST /api/admin/examboards - 创建一个新的考试局
router.post('/', createExamBoard);

// GET /api/admin/examboards - 获取所有考试局
router.get('/', getAllExamBoards);

// 未来可以添加更新和删除的功能
// router.put('/:id', updateExamBoard);
// router.delete('/:id', deleteExamBoard);

module.exports = router;