// backend/src/routes/adminSubjectRoutes.js
const express = require('express');
const router = express.Router();
const { createSubject, getAllSubjects } = require('../controllers/subjectController');

// POST /api/admin/subjects - 创建一个新学科
router.post('/', createSubject);

// GET /api/admin/subjects - 获取所有学科
router.get('/', getAllSubjects);

// 未来我们可以在这里添加 PUT 和 DELETE 路由
// router.put('/:id', updateSubject);
// router.delete('/:id', deleteSubject);

module.exports = router;