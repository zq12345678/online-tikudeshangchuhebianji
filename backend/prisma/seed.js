// backend/prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('开始填充初始数据...');

    // 1. 创建默认的管理员账户
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    const adminUser = await prisma.user.upsert({
        where: { email: '554639616@qq.com' },
        update: {
            name: 'Edric',
            passwordHash: hashedPassword,
            role: 'ADMIN',
        },
        create: {
            email: '554639616@qq.com',
            name: 'Edric',
            passwordHash: hashedPassword,
            role: 'ADMIN',
        },
    });
    console.log(`✅ 已创建或确认管理员账户: ${adminUser.email}`);

    // 2. 创建基础考试局
    const apBoard = await prisma.examBoard.upsert({
        where: { name: 'AP' },
        update: {},
        create: { name: 'AP' },
    });
    console.log(`✅ 已创建或确认考试局: ${apBoard.name}`);

    const alevelBoard = await prisma.examBoard.upsert({
        where: { name: 'A-Level' },
        update: {},
        create: { name: 'A-Level' },
    });
    console.log(`✅ 已创建或确认考试局: ${alevelBoard.name}`);

    // 3. 创建示例学科并关联到AP考试局
    const csaSubject = await prisma.subject.upsert({
        where: { name: 'AP Computer Science A' },
        update: {},
        create: {
            name: 'AP Computer Science A',
            examBoardId: apBoard.id,
        },
    });
    console.log(`✅ 已创建或确认学科: ${csaSubject.name}`);

    console.log('🎉 初始数据填充完成！');
}

main()
    .catch((e) => {
        console.error('❌ 填充数据时发生错误:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });