const express = require('express');
const router = express.Router();

/* GET home page. */
// 处理根路径的GET请求
router.get('/', function(req, res, next) {
  res.json({ message: 'ciallo world' });
});

// 导出路由模块
module.exports = router;
