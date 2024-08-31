// d:\node\undefined-api\routes\auth.js

const express = require('express');
const router = express.Router();
const { User } = require('../models/');
const jwt = require('jsonwebtoken');

// 登录路由
router.post('/', async function(req, res) {
  try {
    const { login, password } = req.body;

    // 检查凭证类型（邮箱或ID）
    let user;
    if (login.includes('@')) {
      // 如果凭证包含 '@'，则认为是邮箱
      user = await User.findOne({
        where: {
          email: login
        }
      });
    } else {
      // 否则认为是ID
      user = await User.findOne({
        where: {
          id: login
        }
      });
    }

    if (!user) {
      return res.status(401).json({
        status: false,
        message: '邮箱或密码错误',
        data: null,
        errors: ['邮箱或密码错误']
      });
    }

    // 检查密码是否正确
    if (password !== user.password) {
      return res.status(401).json({
        status: false,
        message: '邮箱或密码错误',
        data: null,
        errors: ['邮箱或密码错误']
      });
    }

    // 生成 JWT 令牌
    const token = jwt.sign({ userId: user.id}, process.env.SECRET, {
      expiresIn: '60d' // 令牌有效期
    });

    res.json({
      status: true,
      message: '登录成功',
      data: { token }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: '服务器错误',
      data: null,
      errors: [error.message]
    });
  }
});

module.exports = router;
