const express = require('express'); // 引入 express 模块
const path = require('path'); // 引入 path 模块
const cookieParser = require('cookie-parser'); // 引入 cookie-parser 模块
const logger = require('morgan'); // 引入 morgan 模块
const bodyParser = require('body-parser');
const cors = require('cors');



require('dotenv').config(); // 引入 .env 文件

const indexRouter = require('./routes/index'); // 引入 index 路由模块
const usersRouter = require('./routes/users'); // 引入 users 路由模块
const adminArticlesRouter = require('./routes/admin/articles'); // 引入 admin 文章路由模块
const followRoutes = require('./routes/follow');
const itemRouter = require('./routes/item');
const likeRoutes = require('./routes/like');
const authRouter = require('./routes/auth');

const app = express(); // 创建 express 应用实例

app.use(cors()); // 允许跨域请求

app.use(logger('dev')); // 使用 morgan 中间件，日志模式为 'dev'
app.use(express.json()); // 使用 express 内置中间件解析 JSON 请求体
app.use(express.urlencoded({ extended: false })); // 使用 express 内置中间件解析 URL 编码的请求体
app.use(cookieParser()); // 使用 cookie-parser 中间件解析 cookie
app.use(bodyParser.json());

// 提供静态文件服务
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads/avatars')));
app.use(express.static(path.join(__dirname, 'public'))); // 提供 public 文件夹中的静态文件

app.use('/', indexRouter); // 挂载 index 路由到根路径
app.use('/users', usersRouter); // 挂载 users 路由到 '/users' 路径
app.use('/admin/articles', adminArticlesRouter); // 挂载 admin 文章路由到 '/admin/articles' 路径
app.use('/follow', followRoutes);
app.use('/items', itemRouter);
app.use('/like', likeRoutes);
app.use('/login', authRouter);



const port = process.env.PORT || 3001; // 从环境变量中获取端口，如果没有则使用默认端口 3000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app; // 导出 express 应用实例
