# 产品需求文档 (PRD) - 程序员专用

**项目名称**: 业主自治宝 (Owner Self-Governance Treasure)  
**技术方案**: HTML5 + Vue3 + 移动端适配  
**版本**: v1.0.0  
**日期**: 2026-03-08  
**作者**: 惊蛰

---

## 1. 技术架构

### 1.1 技术栈选型

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **前端框架** | Vue 3 | 3.4+ | Composition API |
| **构建工具** | Vite | 5.x | 快速开发 |
| **UI组件库** | Vant 4 | 4.x | 移动端组件库 |
| **状态管理** | Pinia | 2.x | 替代Vuex |
| **路由** | Vue Router | 4.x | 前端路由 |
| **HTTP请求** | Axios | 1.x | API通信 |
| **CSS预处理器** | SCSS | - | 样式管理 |
| **移动端适配** | vw/vh + flexible | - | 响应式布局 |
| **地图** | 高德地图JS API | 2.0 | 位置服务 |
| **支付** | 微信支付JSAPI | - | 微信支付 |

### 1.2 项目结构

```
owner-self-governance/
├── public/                    # 静态资源
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── api/                   # API接口
│   │   ├── user.js            # 用户相关
│   │   ├── community.js       # 小区相关
│   │   ├── vote.js            # 表决相关
│   │   ├── law.js             # 法律相关
│   │   └── index.js           # 统一导出
│   ├── assets/                # 静态资源
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │       ├── variables.scss # SCSS变量
│   │       ├── mixins.scss    # SCSS混入
│   │       └── index.scss     # 全局样式
│   ├── components/            # 公共组件
│   │   ├── Navbar.vue         # 导航栏
│   │   ├── Tabbar.vue         # 底部标签栏
│   │   ├── OwnerCard.vue      # 业主卡片
│   │   ├── VoteItem.vue       # 表决项
│   │   └── Loading.vue        # 加载组件
│   ├── composables/           # 组合式函数
│   │   ├── useUser.js         # 用户相关
│   │   ├── useCommunity.js    # 小区相关
│   │   ├── useVote.js         # 表决相关
│   │   └── useAuth.js         # 认证相关
│   ├── layouts/               # 布局组件
│   │   ├── DefaultLayout.vue  # 默认布局
│   │   └── AuthLayout.vue     # 认证布局
│   ├── router/                # 路由配置
│   │   └── index.js
│   ├── stores/                # Pinia状态
│   │   ├── userStore.js       # 用户状态
│   │   ├── communityStore.js  # 小区状态
│   │   └── voteStore.js       # 表决状态
│   ├── utils/                 # 工具函数
│   │   ├── request.js         # 请求封装
│   │   ├── storage.js         # 本地存储
│   │   ├── validate.js        # 表单验证
│   │   ├── constants.js       # 常量定义
│   │   └── helpers.js         # 辅助函数
│   ├── views/                 # 页面视图
│   │   ├── home/              # 首页
│   │   ├── auth/              # 认证相关
│   │   ├── owner/             # 业主相关
│   │   ├── law/               # 法律库
│   │   ├── vote/              # 表决系统
│   │   ├── forum/             # 议事圈
│   │   ├── profile/           # 个人中心
│   │   └── ...
│   ├── App.vue                # 根组件
│   └── main.js                # 入口文件
├── .env                       # 环境变量
├── .env.development
├── .env.production
├── vite.config.js             # Vite配置
├── package.json
└── README.md
```

### 1.3 响应式断点

```scss
// variables.scss
// 移动端适配 - 以iPhone 375px为基准
$design-width: 375;

// 断点定义
$bp-xs: 320px;    // 小屏手机
$bp-sm: 375px;    // 标准iPhone
$bp-md: 414px;    // Plus/Max
$bp-lg: 768px;    // iPad
$bp-xl: 1024px;   // iPad Pro

// 使用vw进行适配
@function vw($px) {
  @return ($px / $design-width) * 100vw;
}
```

---

## 2. 数据库设计

### 2.1 ER图概览

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    User      │     │   Community  │     │    Owner     │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id           │◄────┤ id           │     │ id           │
│ openid       │     │ name         │     │ user_id      │◄──┐
│ nickname     │     │ address      │     │ community_id │◄──┼──┐
│ avatar       │     │ city         │     │ real_name    │   │  │
│ phone        │     │ district     │     │ building     │   │  │
│ created_at   │     │ created_at   │     │ room_number  │   │  │
└──────────────┘     └──────────────┘     │ id_card      │   │  │
                                          │ status       │   │  │
                                          │ created_at   │   │  │
                                          └──────────────┘   │  │
                                                               │  │
┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │  │
│   Payment    │     │    Vote      │     │  VoteRecord  │    │  │
├──────────────┤     ├──────────────┤     ├──────────────┤    │  │
│ id           │     │ id           │     │ id           │    │  │
│ user_id      │◄────┤ community_id │◄────┤ vote_id      │◄───┘  │
│ community_id │◄────┤ creator_id   │◄────┤ owner_id     │◄──────┘
│ amount       │     │ title        │     │ choice       │
│ status       │     │ content      │     │ voted_at     │
│ expires_at   │     │ options      │     └──────────────┘
│ created_at   │     │ status       │
└──────────────┘     │ start_time   │
                     │ end_time     │
                     │ created_at   │
                     └──────────────┘
```

### 2.2 数据表详细设计

#### 2.2.1 用户表 (users)

```sql
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `openid` varchar(100) NOT NULL COMMENT '微信openid',
  `unionid` varchar(100) DEFAULT NULL COMMENT '微信unionid',
  `nickname` varchar(50) DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(500) DEFAULT NULL COMMENT '头像URL',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用 1-正常',
  `last_login_at` datetime DEFAULT NULL COMMENT '最后登录时间',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_openid` (`openid`),
  KEY `idx_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

#### 2.2.2 小区表 (communities)

```sql
CREATE TABLE `communities` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '小区名称',
  `address` varchar(200) DEFAULT NULL COMMENT '详细地址',
  `province` varchar(50) DEFAULT NULL COMMENT '省',
  `city` varchar(50) DEFAULT NULL COMMENT '市',
  `district` varchar(50) DEFAULT NULL COMMENT '区/县',
  `longitude` decimal(10,7) DEFAULT NULL COMMENT '经度',
  `latitude` decimal(10,7) DEFAULT NULL COMMENT '纬度',
  `total_buildings` int DEFAULT NULL COMMENT '总楼栋数',
  `total_units` int DEFAULT NULL COMMENT '总户数',
  `property_company` varchar(100) DEFAULT NULL COMMENT '物业公司',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态',
  `created_by` bigint unsigned DEFAULT NULL COMMENT '创建人ID',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_city` (`city`),
  KEY `idx_location` (`longitude`,`latitude`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='小区表';
```

#### 2.2.3 业主表 (owners)

```sql
CREATE TABLE `owners` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL COMMENT '用户ID',
  `community_id` bigint unsigned NOT NULL COMMENT '小区ID',
  `real_name` varchar(50) NOT NULL COMMENT '真实姓名',
  `building` varchar(20) NOT NULL COMMENT '楼栋号',
  `unit` varchar(10) DEFAULT NULL COMMENT '单元号',
  `room_number` varchar(20) NOT NULL COMMENT '房号',
  `area` decimal(8,2) DEFAULT NULL COMMENT '房屋面积(平方米)',
  `id_card` varchar(100) DEFAULT NULL COMMENT '身份证号(加密存储)',
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `verify_method` tinyint NOT NULL DEFAULT '1' COMMENT '认证方式：1-房产证 2-物业证明 3-邻居担保',
  `verify_images` json DEFAULT NULL COMMENT '认证图片URL数组',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '状态：0-待认证 1-已认证 2-已拒绝',
  `reject_reason` varchar(200) DEFAULT NULL COMMENT '拒绝原因',
  `verified_at` datetime DEFAULT NULL COMMENT '认证通过时间',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_community_room` (`community_id`,`building`,`room_number`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='业主表';
```

#### 2.2.4 缴费记录表 (payments)

```sql
CREATE TABLE `payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `community_id` bigint unsigned NOT NULL,
  `order_no` varchar(64) NOT NULL COMMENT '订单号',
  `amount` decimal(10,2) NOT NULL DEFAULT '1.00' COMMENT '金额',
  `pay_method` tinyint DEFAULT '1' COMMENT '支付方式：1-微信支付',
  `transaction_id` varchar(100) DEFAULT NULL COMMENT '微信支付流水号',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '状态：0-待支付 1-已支付 2-已退款',
  `start_date` date NOT NULL COMMENT '有效期开始',
  `end_date` date NOT NULL COMMENT '有效期结束',
  `paid_at` datetime DEFAULT NULL COMMENT '支付时间',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_community` (`user_id`,`community_id`),
  KEY `idx_end_date` (`end_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='缴费记录表';
```

#### 2.2.5 表决表 (votes)

```sql
CREATE TABLE `votes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `community_id` bigint unsigned NOT NULL,
  `creator_id` bigint unsigned NOT NULL COMMENT '发起人ID',
  `title` varchar(200) NOT NULL COMMENT '表决标题',
  `content` text COMMENT '详细内容',
  `type` tinyint NOT NULL DEFAULT '1' COMMENT '类型：1-普通事项 2-重大事项',
  `options` json NOT NULL COMMENT '选项：["支持","反对","弃权"]',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '状态：0-待开始 1-进行中 2-已结束 3-已取消',
  `start_time` datetime NOT NULL COMMENT '开始时间',
  `end_time` datetime NOT NULL COMMENT '结束时间',
  `min_participation` tinyint DEFAULT '50' COMMENT '最低参与率(%)',
  `result` tinyint DEFAULT NULL COMMENT '结果：1-通过 2-未通过',
  `result_summary` json DEFAULT NULL COMMENT '结果统计',
  `view_count` int unsigned DEFAULT '0' COMMENT '浏览量',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_community_status` (`community_id`,`status`),
  KEY `idx_time` (`start_time`,`end_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='表决表';
```

#### 2.2.6 投票记录表 (vote_records)

```sql
CREATE TABLE `vote_records` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `vote_id` bigint unsigned NOT NULL,
  `owner_id` bigint unsigned NOT NULL,
  `choice` tinyint NOT NULL COMMENT '选择：1-支持 2-反对 3-弃权',
  `ip_address` varchar(50) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `voted_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_vote_owner` (`vote_id`,`owner_id`),
  KEY `idx_voted_at` (`voted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='投票记录表';
```

#### 2.2.7 法律法条表 (laws)

```sql
CREATE TABLE `laws` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category` varchar(50) NOT NULL COMMENT '分类：宪法/民法典/行政法规/地方法规',
  `title` varchar(200) NOT NULL COMMENT '法规名称',
  `chapter` varchar(100) DEFAULT NULL COMMENT '章节',
  `article` varchar(50) DEFAULT NULL COMMENT '条款',
  `content` text NOT NULL COMMENT '内容',
  `keywords` varchar(500) DEFAULT NULL COMMENT '关键词',
  `reference` varchar(500) DEFAULT NULL COMMENT '引用来源',
  `effective_date` date DEFAULT NULL COMMENT '生效日期',
  `status` tinyint DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  FULLTEXT KEY `ft_content` (`content`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='法律法条表';
```

#### 2.2.8 帖子表 (posts)

```sql
CREATE TABLE `posts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `community_id` bigint unsigned NOT NULL,
  `author_id` bigint unsigned NOT NULL,
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `images` json DEFAULT NULL COMMENT '图片数组',
  `type` tinyint DEFAULT '1' COMMENT '类型：1-讨论 2-通知 3-求助',
  `is_urgent` tinyint DEFAULT '0' COMMENT '是否紧急',
  `is_top` tinyint DEFAULT '0' COMMENT '是否置顶',
  `view_count` int unsigned DEFAULT '0',
  `like_count` int unsigned DEFAULT '0',
  `comment_count` int unsigned DEFAULT '0',
  `status` tinyint DEFAULT '1' COMMENT '状态：0-待审核 1-正常 2-拒绝',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_community_type` (`community_id`,`type`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='帖子表';
```

---

## 3. API接口设计

### 3.1 接口规范

**基础URL**: `https://api.owner-governance.com/v1`

**请求格式**:
```
Content-Type: application/json
Authorization: Bearer {token}
```

**响应格式**:
```json
{
  "code": 0,
  "message": "success",
  "data": { }
}
```

**错误码**:
| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录/Token无效 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

### 3.2 接口列表

#### 3.2.1 用户认证

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 微信登录 | POST | `/auth/login` | 微信code换token |
| 获取用户信息 | GET | `/auth/userinfo` | 获取当前用户信息 |
| 更新用户信息 | PUT | `/auth/userinfo` | 更新昵称/头像 |
| 绑定手机号 | POST | `/auth/phone` | 绑定手机号 |

**微信登录请求**:
```json
POST /auth/login
{
  "code": "微信登录code",
  "invite_code": "邀请码(可选)"
}
```

**微信登录响应**:
```json
{
  "code": 0,
  "data": {
    "token": "jwt_token",
    "expires_in": 7200,
    "user": {
      "id": 1,
      "nickname": "微信用户",
      "avatar": "头像URL",
      "phone": null,
      "is_verified": false
    }
  }
}
```

#### 3.2.2 小区管理

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 搜索小区 | GET | `/communities/search` | 按名称/地址搜索 |
| 获取小区详情 | GET | `/communities/{id}` | 小区详情 |
| 创建小区 | POST | `/communities` | 创建新小区 |
| 加入小区 | POST | `/communities/{id}/join` | 申请加入小区 |
| 获取我的小区 | GET | `/communities/my` | 我加入的小区列表 |

**搜索小区请求**:
```
GET /communities/search?keyword=xxx&city=xxx&page=1&size=20
```

#### 3.2.3 业主认证

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 提交认证 | POST | `/owners/verify` | 提交业主认证 |
| 获取认证状态 | GET | `/owners/status` | 查询认证状态 |
| 重新提交认证 | PUT | `/owners/verify` | 重新提交 |

**提交认证请求**:
```json
POST /owners/verify
{
  "community_id": 1,
  "real_name": "张三",
  "building": "1栋",
  "unit": "2单元",
  "room_number": "301",
  "area": 89.5,
  "phone": "13800138000",
  "verify_method": 1,
  "verify_images": ["url1", "url2"]
}
```

#### 3.2.4 缴费管理

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 创建订单 | POST | `/payments/order` | 创建缴费订单 |
| 查询订单 | GET | `/payments/{order_no}` | 查询订单状态 |
| 获取支付配置 | GET | `/payments/config` | 获取微信支付参数 |
| 支付回调 | POST | `/payments/callback` | 微信支付回调 |
| 我的缴费记录 | GET | `/payments/history` | 缴费历史 |

**创建订单请求**:
```json
POST /payments/order
{
  "community_id": 1
}
```

**创建订单响应**:
```json
{
  "code": 0,
  "data": {
    "order_no": "P20240308123456",
    "amount": 1.00,
    "community_name": "xx小区",
    "pay_params": {
      "appId": "wx...",
      "timeStamp": "1234567890",
      "nonceStr": "random",
      "package": "prepay_id=xxx",
      "signType": "RSA",
      "paySign": "xxx"
    }
  }
}
```

#### 3.2.5 表决系统

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 创建表决 | POST | `/votes` | 发起新表决 |
| 获取表决列表 | GET | `/votes` | 表决列表 |
| 获取表决详情 | GET | `/votes/{id}` | 表决详情 |
| 参与投票 | POST | `/votes/{id}/vote` | 提交投票 |
| 获取投票结果 | GET | `/votes/{id}/result` | 投票结果 |
| 取消表决 | PUT | `/votes/{id}/cancel` | 取消表决 |

**创建表决请求**:
```json
POST /votes
{
  "community_id": 1,
  "title": "关于要求物业整改小区卫生的表决",
  "content": "详细说明...",
  "type": 1,
  "options": ["支持", "反对", "弃权"],
  "start_time": "2026-03-08 10:00:00",
  "end_time": "2026-03-15 10:00:00",
  "min_participation": 50
}
```

**参与投票请求**:
```json
POST /votes/1/vote
{
  "choice": 1
}
```

#### 3.2.6 法律库

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取法律分类 | GET | `/laws/categories` | 法律分类列表 |
| 搜索法律 | GET | `/laws/search` | 关键词搜索 |
| 获取法律详情 | GET | `/laws/{id}` | 法条详情 |
| 获取维权场景 | GET | `/laws/scenarios` | 侵权场景列表 |
| 获取场景法条 | GET | `/laws/scenarios/{id}/laws` | 场景相关法条 |

#### 3.2.7 议事圈

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取帖子列表 | GET | `/posts` | 帖子列表 |
| 发布帖子 | POST | `/posts` | 发布新帖 |
| 获取帖子详情 | GET | `/posts/{id}` | 帖子详情 |
| 点赞帖子 | POST | `/posts/{id}/like` | 点赞 |
| 评论帖子 | POST | `/posts/{id}/comments` | 评论 |

#### 3.2.8 文件上传

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取上传签名 | GET | `/upload/signature` | 获取OSS上传签名 |
| 上传回调 | POST | `/upload/callback` | 上传成功回调 |

---

## 4. 页面设计

### 4.1 页面清单

| 页面路径 | 名称 | 说明 | 权限 |
|----------|------|------|------|
| `/` | 首页 | 入口页，引导登录/选择小区 | 公开 |
| `/auth/login` | 登录页 | 微信授权登录 | 公开 |
| `/auth/phone` | 绑定手机号 | 手机号绑定 | 登录 |
| `/community/search` | 搜索小区 | 搜索/选择小区 | 登录 |
| `/community/create` | 创建小区 | 创建新小区 | 登录 |
| `/owner/verify` | 业主认证 | 提交认证资料 | 登录 |
| `/owner/status` | 认证状态 | 查看审核状态 | 登录 |
| `/payment/order` | 支付订单 | 1元缴费 | 认证通过 |
| `/home` | 小区首页 | 功能入口 | 缴费完成 |
| `/law/index` | 法律库首页 | 法律分类 | 缴费完成 |
| `/law/detail/:id` | 法条详情 | 法条内容 | 缴费完成 |
| `/law/scenario/:id` | 维权场景 | 场景匹配 | 缴费完成 |
| `/vote/index` | 表决列表 | 全部表决 | 缴费完成 |
| `/vote/create` | 创建表决 | 发起表决 | 缴费完成 |
| `/vote/detail/:id` | 表决详情 | 参与投票 | 缴费完成 |
| `/vote/result/:id` | 表决结果 | 查看结果 | 缴费完成 |
| `/forum/index` | 议事圈 | 帖子列表 | 缴费完成 |
| `/forum/post/:id` | 帖子详情 | 详情/评论 | 缴费完成 |
| `/forum/create` | 发布帖子 | 发布新帖 | 缴费完成 |
| `/profile` | 个人中心 | 我的信息 | 登录 |
| `/profile/communities` | 我的小区 | 小区切换 | 登录 |
| `/profile/payments` | 缴费记录 | 历史记录 | 登录 |

### 4.2 关键页面原型

#### 4.2.1 首页 (`/`)

```
┌─────────────────────────────────────┐
│          业主自治宝                  │
│     无业委会也能维权                 │
├─────────────────────────────────────┤
│                                     │
│     ┌─────────────────────────┐     │
│     │                         │     │
│     │      小区搜索框         │     │
│     │    🔍 输入小区名称...    │     │
│     │                         │     │
│     └─────────────────────────┘     │
│                                     │
│   ┌──────────────┐ ┌──────────────┐ │
│   │   📚 法律库   │ │   🗳️ 表决    │ │
│   │   查法条     │ │  集体决策    │ │
│   └──────────────┘ └──────────────┘ │
│   ┌──────────────┐ ┌──────────────┐ │
│   │   💬 议事圈   │ │   👥 通讯录  │ │
│   │  业主交流    │ │  快速联络    │ │
│   └──────────────┘ └──────────────┘ │
│                                     │
│   ┌───────────────────────────────┐ │
│   │      💡 维权指南               │ │
│   │  物业乱收费怎么办？            │ │
│   │  查看维权步骤 →               │ │
│   └───────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│  🏠 首页  │  📚 法律  │  💬 议事  │  👤 我的 │
└─────────────────────────────────────┘
```

#### 4.2.2 业主认证页 (`/owner/verify`)

```
┌─────────────────────────────────────┐
│  ← 返回          业主认证            │
├─────────────────────────────────────┤
│                                     │
│  请选择认证方式：                    │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ○ 房产证认证                 │   │
│  │   上传房产证照片             │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ ○ 物业证明                   │   │
│  │   上传物业开具的证明         │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ ○ 邻居担保                   │   │
│  │   2户以上业主确认            │   │
│  └─────────────────────────────┘   │
│                                     │
│  真实姓名                           │
│  ┌─────────────────────────────┐   │
│  │ 请输入真实姓名               │   │
│  └─────────────────────────────┘   │
│                                     │
│  楼栋房号                           │
│  ┌─────────────┐ ┌─────────────┐   │
│  │ 1栋         │ │ 301室       │   │
│  └─────────────┘ └─────────────┘   │
│                                     │
│  上传证明图片                       │
│  ┌────┐ ┌────┐ ┌────┐             │
│  │ +  │ │ +  │ │ +  │             │
│  └────┘ └────┘ └────┘             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │        提交认证              │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

#### 4.2.3 表决详情页 (`/vote/detail/:id`)

```
┌─────────────────────────────────────┐
│  ← 返回         表决详情             │
├─────────────────────────────────────┤
│                                     │
│  【进行中】                          │
│  关于要求物业整改小区卫生的表决       │
│  发起时间：2026-03-08               │
│  结束时间：2026-03-15               │
│                                     │
│  ─────────────────────────────────  │
│  详细说明：                          │
│  近期小区卫生状况堪忧，垃圾清理不     │
│  及时，要求物业立即整改...           │
│                                     │
│  ─────────────────────────────────  │
│  实时投票数据：                      │
│  参与率：45% (45/100户)             │
│                                     │
│  支持 ████████████████░░░ 52% (23) │
│  反对 ██████░░░░░░░░░░░░░ 18% (8)  │
│  弃权 ███████░░░░░░░░░░░░ 20% (9)  │
│  未投 ░░░░░░░░░░░░░░░░░░░ 10% (5)  │
│                                     │
│  ─────────────────────────────────  │
│  请选择您的投票：                    │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  ○ 支持                     │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  ○ 反对                     │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  ○ 弃权                     │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │        确认投票              │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## 5. 开发任务清单

### Phase 1: 基础架构 (1周)
- [ ] 项目初始化（Vue3 + Vite + Vant）
- [ ] 移动端适配配置
- [ ] 路由配置
- [ ] 状态管理（Pinia）
- [ ] 请求封装（Axios）
- [ ] 微信登录集成
- [ ] 后端基础框架搭建

### Phase 2: 用户系统 (1周)
- [ ] 微信登录页面
- [ ] 手机号绑定
- [ ] 小区搜索/选择
- [ ] 业主认证页面
- [ ] 认证审核后台
- [ ] 1元支付功能
- [ ] 个人中心

### Phase 3: 核心功能 (2周)
- [ ] 法律库首页
- [ ] 法条搜索/详情
- [ ] 维权场景匹配
- [ ] 表决系统（创建/列表/详情/投票）
- [ ] 实时投票结果
- [ ] 表决报告生成

### Phase 4: 社区功能 (1周)
- [ ] 议事圈帖子列表
- [ ] 发布帖子
- [ ] 帖子详情/评论
- [ ] 业主通讯录
- [ ] 紧急通知

### Phase 5: 测试上线 (1周)
- [ ] 功能测试
- [ ] 性能优化
- [ ] 安全测试
- [ ] 微信审核
- [ ] 上线部署

---

## 6. 部署方案

### 6.1 服务器配置

| 环境 | 配置 | 说明 |
|------|------|------|
| **生产环境** | 2核4G + 50G SSD | 主力服务器 |
| **数据库** | 2核4G + 100G SSD | MySQL主库 |
| **静态资源** | CDN | 图片/文件加速 |
| **域名** | owner-governance.com | 主域名 |

### 6.2 部署流程

```
开发环境 → 测试环境 → 预发布 → 生产环境
   ↓           ↓          ↓         ↓
 本地开发    测试服务器   线上仿真   正式生产
```

---

## 7. 安全规范

### 7.1 前端安全
- HTTPS强制
- XSS防护（输入过滤、输出编码）
- CSRF防护
- 敏感信息不存本地

### 7.2 后端安全
- SQL注入防护（参数化查询）
- 接口鉴权（JWT Token）
- 接口限流
- 敏感数据加密存储

### 7.3 数据安全
- 身份证号AES加密
- 手机号部分脱敏
- 操作日志记录
- 定期备份

---

**PRD v1.0 完成，等待开发启动。**
