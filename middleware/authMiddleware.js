const jwt = require('jsonwebtoken');
const { User } = require('../models'); // 引入用户模型

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // 从请求头中获取token
    if (!token) {
      return res.status(401).json({
        status: false,
        message: '未提供认证token',
        data: null,
        errors: ['未提供认证token']
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET); // 验证token
    const user = await User.findByPk(decoded.userId); // 根据token中的用户ID查找用户

    if (!user) {
      return res.status(401).json({
        status: false,
        message: '用户不存在',
        data: null,
        errors: ['用户不存在']
      });
    }

    req.user = user; // 将用户信息附加到请求对象上
    next(); // 继续处理请求
  } catch (error) {
    res.status(401).json({
      status: false,
      message: '无效的token',
      data: null,
      errors: [error.message]
    });
  }
};

module.exports = authMiddleware;
