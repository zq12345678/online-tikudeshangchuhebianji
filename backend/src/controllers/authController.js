// backend/src/controllers/authController.js
const prisma = require('../config/prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ... registerUser 函数保持不变 ...
const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: '邮箱、密码和姓名均不能为空' });
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: '该邮箱已被注册' });
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = await prisma.user.create({
            data: { email, name, passwordHash, role: 'STUDENT' },
            select: { id: true, email: true, name: true, role: true, createdAt: true }
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error("注册失败:", error);
        res.status(500).json({ error: '注册过程中发生内部错误' });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: '邮箱和密码不能为空' });
        }
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!user) {
            return res.status(401).json({ error: '无效的邮箱或密码' });
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: '无效的邮箱或密码' });
        }

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        // --- 新增诊断日志 ---
        console.log("准备签发Token，使用的密钥是:", process.env.JWT_SECRET);

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            message: '登录成功',
            token: token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error("登录失败:", error);
        res.status(500).json({ error: '登录过程中发生内部错误' });
    }
};

module.exports = {
    registerUser,
    loginUser,
};