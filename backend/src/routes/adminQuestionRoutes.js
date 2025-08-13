// backend/src/routes/adminQuestionRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAllQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion
} = require('../controllers/adminQuestionController');

// GET /api/admin/questions - 获取题库所有题目 (可加 ?subjectId=1 筛选)
router.get('/', getAllQuestions);

// POST /api/admin/questions - 在题库中创建新题目
router.post('/', createQuestion);

// GET /api/admin/questions/:id - 获取题库中单个题目的详情
router.get('/:id', getQuestionById);

// PUT /api/admin/questions/:id - 更新题库中的题目
router.put('/:id', updateQuestion);

// DELETE /api/admin/questions/:id - 从题库中删除题目
router.delete('/:id', deleteQuestion);

module.exports = router;