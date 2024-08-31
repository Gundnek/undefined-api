
```markdown
# undefined-api

## 项目描述

此项目是基于 Node.js 和 Express 构建的 RESTful API 服务器。实现了以下功能：

- 用户注册
- 用户登录
- 获取用户信息
- 创建项目
- 获取项目列表
- 获取项目详情
- 删除项目
- 创建文章
- 用户关注
- 取消关注
- 点赞项目
- 取消点赞

## 项目结构

### 1. `app.js`
- **功能**: 定义和配置 Express 应用程序的主文件。
- **示例内容**: 引入路由、中间件配置、错误处理等。

### 2. `package.json` （无需变动）
- **功能**: 包含项目的元数据和应用程序所需的依赖项列表。
- **示例内容**: 定义项目名称、版本、依赖项等。

### 3. `package-lock.json`（无需变动）
- **功能**: 确保在不同环境中安装相同版本的依赖项。

### 4. `.env`
- **功能**: 存储环境变量的配置文件，出于安全原因将其保存在代码库之外。
- **示例内容**:
  ```dotenv
  DB_HOST=localhost
  DB_USER=root
  DB_PASS=password
  ```

### 5. `/bin`（无需变动）
- **功能**: 通常包含可执行文件，例如启动服务器的脚本。
- **示例文件**: `www`（启动 Express 服务器的脚本）

### 6. `/config`
- **功能**: 存放配置文件，定义应用程序或其组件的行为。包含 MySQL 数据库连接配置、全局配置等。
- **示例文件**: 
  - `database.js`（数据库连接配置）
  - `config.js`（全局配置）

### 7. `/controllers`（无需变动）
- **功能**: 处理用户输入、处理请求并返回响应，属于 MVC（模型-视图-控制器）架构的一部分。
- **示例文件**: 
  - `userController.js`
  - `postController.js`

### 8. `/migrations`
- **功能**: 包含数据库架构的变更，允许对数据库设置进行版本控制。使用 Sequelize 进行数据库迁移。
- **示例文件**: 
  - `20230101000000-create-user.js`
  - `20230201000000-add-column-to-post.js`

### 9. `/models`
- **功能**: 表示数据结构，通常在代码中镜像数据库表，是 MVC 架构的一部分。使用 Sequelize 定义模型。
- **示例文件**: 
  - `user.js`
  - `post.js`

### 10. `/node_modules`（无需变动）
- **功能**: 存放通过 npm（Node 包管理器）安装的所有 Node.js 模块（包）。

### 11. `/public`
- **功能**: 存放静态资源文件，如 CSS、JavaScript 和图像文件。
- **子文件夹**:
  - **stylesheets**: 存放 CSS 样式文件。

### 12. `/routes`
- **功能**: 定义 URI（统一资源标识符）及其对应的函数，将 HTTP 请求映射到服务器端函数。
- **示例文件**: 
  - `index.js`
  - `users.js`

### 13. `/uploads`
- **功能**: 用于存储用户上传的文件。
- **子文件夹**:
  - **avatars**: 存储用户上传的头像图片。

## 技术栈

- **Node.js**: 后端运行环境。
- **Express**: 后端框架，用于构建 API 和 Web 应用。
- **MySQL**: 数据库，通过 Docker 部署。
- **Sequelize**: ORM 工具，用于数据库管理和迁移。
- **Apifox**: API 测试工具，用于测试和调试 API 接口。

## 安装指南

1. 安装 Node.js（版本：v22.3.0）和 MySQL。
2. 安装 Sequelize。
3. 安装 Nodemon。
4. 安装 Apifox。
5. 克隆项目代码。
6. 安装依赖项：
   ```bash
   npm install
   ```
7. 配置 MySQL 数据库：
   - 在 `.env` 文件中配置数据库连接信息。
8. 运行项目：
   ```bash
   npm start
   ```

## 使用说明

### 第一次使用

1. 使用 Docker 运行 MySQL 数据库以及 phpMyAdmin。
2. 在 `config` 文件夹中配置数据库连接信息。
3. 在 MySQL 中创建数据库。
4. 运行迁移命令创建表：
   ```bash
   npx sequelize-cli db:migrate
   ```
5. 进入项目根目录，运行：
   ```bash
   npm start
   ```
   默认运行在 3001 端口。

### 后续使用

1. 启动 Docker 运行 MySQL 数据库以及 phpMyAdmin。
2. 进入项目根目录，运行：
   ```bash
   npm start
   ```

使用 API 测试工具（如 Apifox）进行接口测试和调试。

## API 文档地址

[Apifox API 文档](https://apifox.com/apidoc/shared-6e95fde3-0987-4621-b6d3-40d9358c7aea)

## 联系方式

如有后续问题，请联系作者：

- **QQ**: 1989954512

