// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const prisma = require('../config/prismaClient');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // --- 新增诊断日志 ---
            console.log("准备验证Token，使用的密钥是:", process.env.JWT_SECRET);

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, email: true, name: true, role: true }
            });

            if (!req.user) {
                return res.status(401).json({ error: '身份验证失败，用户不存在' });
            }
            next();
        } catch (error) {
            console.error('Token 验证过程中发生错误:', error.message);
            return res.status(401).json({ error: '身份验证失败，Token 无效或已过期' });
        }
    }
    if (!token) {
        return res.status(401).json({ error: '身份验证失败，未提供 Token' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ error: '权限不足，需要管理员角色' });
    }
};

module.exports = { protect, isAdmin };