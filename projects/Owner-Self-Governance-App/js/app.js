/** 业主自治宝 - 纯HTML5版 */

// 初始化用户数据
UserStore.init();

// 路由配置
const routes = {
    '/': 'landing',
    '/auth/login': 'login',
    '/community/select': 'selectCommunity',
    '/owner/verify': 'ownerVerify',
    '/owner/status': 'verifyStatus',
    '/payment': 'payment',
    '/home': 'home',
    '/law': 'law',
    '/law/detail/:id': 'lawDetail',
    '/vote': 'vote',
    '/vote/detail/:id': 'voteDetail',
    '/vote/create': 'voteCreate',
    '/forum': 'forum',
    '/forum/detail/:id': 'forumDetail',
    '/forum/create': 'forumCreate',
    '/profile': 'profile',
    '/profile/payments': 'payments',
    '/contacts': 'contacts'
};

// 路由守卫
function checkAuth(page) {
    const publicPages = ['landing', 'login'];
    if (publicPages.includes(page)) return true;

    if (!UserStore.isLoggedIn()) {
        navigate('/auth/login');
        return false;
    }

    if (page !== 'selectCommunity' && !UserStore.hasCommunity()) {
        navigate('/community/select');
        return false;
    }

    if (page !== 'ownerVerify' && page !== 'verifyStatus' && !UserStore.isVerified() && UserStore.hasCommunity()) {
        navigate('/owner/verify');
        return false;
    }

    if (page !== 'payment' && !UserStore.isPaid() && UserStore.isVerified()) {
        navigate('/payment');
        return false;
    }

    return true;
}

// 导航函数
function navigate(path) {
    window.location.hash = path;
    render();
}

// Toast提示
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// 渲染页面
function render() {
    const hash = window.location.hash.slice(1) || '/';
    const app = document.getElementById('app');
    const bottomNav = document.getElementById('bottom-nav');

    // 匹配路由
    let page = 'landing';
    for (const [route, pageName] of Object.entries(routes)) {
        if (route.includes(':id')) {
            const pattern = route.replace(/:id/g, '\\d+');
            if (new RegExp('^' + pattern + '$').test(hash)) {
                page = pageName;
                break;
            }
        } else if (route === hash) {
            page = pageName;
            break;
        }
    }

    // 检查权限
    if (!checkAuth(page)) return;

    // 显示/隐藏底部导航
    const needNav = ['home', 'law', 'vote', 'forum', 'profile'].includes(page);
    bottomNav.style.display = needNav ? 'flex' : 'none';

    // 更新导航状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });

    // 渲染页面
    const pageContent = pages[page] ? pages[page](hash) : pages.landing();
    app.innerHTML = pageContent;

    // 绑定事件
    bindEvents();
}

// 页面模板
const pages = {
    // 引导页
    landing() {
        return `
            <div class="page active">
                <div style="background: linear-gradient(135deg, #1989fa 0%, #39b9fa 100%); padding: 60px 20px 40px; text-align: center; color: #fff;">
                    <div style="font-size: 80px; margin-bottom: 20px;">🏠</div>
                    <h1 style="font-size: 28px; margin-bottom: 8px;">业主自治宝</h1>
                    <p style="opacity: 0.9; margin-bottom: 30px;">无业委会也能维权，1元自治守好家园</p>
                    <div style="display: flex; justify-content: center; gap: 30px; margin-bottom: 20px;">
                        <div style="text-align: center;"><div style="font-size: 32px; margin-bottom: 4px;">📚</div><div style="font-size: 12px;">法律武器</div></div>
                        <div style="text-align: center;"><div style="font-size: 32px; margin-bottom: 4px;">🗳️</div><div style="font-size: 12px;">集体表决</div></div>
                        <div style="text-align: center;"><div style="font-size: 32px; margin-bottom: 4px;">💬</div><div style="font-size: 12px;">业主联络</div></div>
                    </div>
                </div>

                <div class="content">
                    <div class="card">
                        <div class="search-box" style="padding: 0; margin-bottom: 12px;">
                            <input type="text" class="search-input" placeholder="请输入小区名称" id="search-input">
                        </div>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            <span class="tag tag-primary">附近小区</span>
                            <span class="tag tag-primary">热门小区</span>
                            <span class="tag tag-primary">最近浏览</span>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">核心功能</h3>
                        <div class="grid">
                            <div class="grid-item" onclick="showToast('请先登录')">
                                <div class="grid-icon blue">📚</div>
                                <div class="grid-title">法律武器库</div>
                                <div class="grid-desc">维权法规一键查</div>
                            </div>
                            <div class="grid-item" onclick="showToast('请先登录')">
                                <div class="grid-icon green">🗳️</div>
                                <div class="grid-title">集体表决</div>
                                <div class="grid-desc">一户一票做决定</div>
                            </div>
                            <div class="grid-item" onclick="showToast('请先登录')">
                                <div class="grid-icon orange">💬</div>
                                <div class="grid-title">议事圈</div>
                                <div class="grid-desc">业主交流讨论</div>
                            </div>
                            <div class="grid-item" onclick="showToast('请先登录')">
                                <div class="grid-icon purple">👥</div>
                                <div class="grid-title">业主通讯录</div>
                                <div class="grid-desc">快速联络邻居</div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">维权指南</h3>
                        <div class="list-item" onclick="showToast('请先登录')">
                            <div class="list-item-content">
                                <div class="list-item-title">物业乱收费怎么办？</div>
                                <div class="list-item-desc">查看处理步骤 →</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                        <div class="list-item" onclick="showToast('请先登录')">
                            <div class="list-item-content">
                                <div class="list-item-title">公共收益被侵占？</div>
                                <div class="list-item-desc">查看维权依据 →</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                    </div>

                    <div class="card price-card">
                        <div class="price">1<span class="price-unit">元/年</span></div>
                        <div style="opacity: 0.9; margin-bottom: 16px;">单个小区全年无限次使用全部功能</div>
                        <div style="display: flex; justify-content: center; gap: 12px; font-size: 12px;">
                            <span>✓ 法律查询</span>
                            <span>✓ 集体表决</span>
                            <span>✓ 业主联络</span>
                            <span>✓ 维权跟踪</span>
                        </div>
                    </div>
                </div>

                <div style="position: fixed; bottom: 0; left: 0; right: 0; padding: 16px; background: #fff; box-shadow: 0 -2px 10px rgba(0,0,0,0.05);">
                    <button class="btn btn-primary" onclick="navigate('/auth/login')">微信一键登录</button>
                    <p style="text-align: center; font-size: 12px; color: #969799; margin-top: 8px;">登录后即可使用全部功能</p>
                </div>
            </div>
        `;
    },

    // 登录页
    login() {
        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <a href="#/" class="back-btn">‹</a>
                        <h1>微信登录</h1>
                        <span></span>
                    </div>
                </div>

                <div class="content" style="padding: 40px 24px;">
                    <div style="text-align: center; margin-bottom: 48px;">
                        <div style="font-size: 80px; margin-bottom: 16px;">🏠</div>
                        <h2 style="font-size: 24px; margin-bottom: 8px;">业主自治宝</h2>
                        <p style="color: #969799;">无业委会也能维权</p>
                    </div>

                    <div style="margin-bottom: 48px;">
                        <label style="display: flex; align-items: center; margin-bottom: 24px; font-size: 12px;">
                            <input type="checkbox" id="agreement" style="margin-right: 8px;">
                            我已阅读并同意《用户协议》和《隐私政策》
                        </label>

                        <button class="btn btn-primary" onclick="handleLogin()">
                            <span style="margin-right: 8px;">💬</span> 微信一键登录
                        </button>
                        <p style="text-align: center; font-size: 12px; color: #969799; margin-top: 16px;">微信授权登录，安全可靠</p>
                    </div>

                    <div style="display: flex; justify-content: space-around; color: #969799; font-size: 12px;">
                        <div style="text-align: center;"><div style="font-size: 24px; margin-bottom: 8px;">🛡️</div><div>实名认证</div></div>
                        <div style="text-align: center;"><div style="font-size: 24px; margin-bottom: 8px;">🔒</div><div>隐私保护</div></div>
                        <div style="text-align: center;"><div style="font-size: 24px; margin-bottom: 8px;">✓</div><div>合法合规</div></div>
                    </div>
                </div>
            </div>
        `;
    },

    // 选择小区
    selectCommunity() {
        const communitiesHtml = MockData.communities.map(c => `
            <div class="card" style="cursor: pointer;" onclick="selectCommunity(${c.id})">
                <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">${c.name}</div>
                <div style="font-size: 13px; color: #646566; margin-bottom: 8px;">${c.address}</div>
                <div style="display: flex; gap: 16px; font-size: 12px; color: #969799;">
                    <span>${c.totalBuildings}栋</span>
                    <span>${c.totalUnits}户</span>
                    <span style="color: #07c160;">已认证业主 ${c.verifiedCount}人</span>
                </div>
            </div>
        `).join('');

        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <a href="javascript:history.back()" class="back-btn">‹</a>
                        <h1>选择小区</h1>
                        <span></span>
                    </div>
                </div>

                <div class="content">
                    <div class="search-box" style="background: transparent; padding: 0 0 12px 0;">
                        <input type="text" class="search-input" placeholder="请输入小区名称或地址">
                    </div>

                    <h3 style="font-size: 14px; margin-bottom: 12px; padding-left: 4px;">热门小区</h3>
                    ${communitiesHtml}

                    <div style="text-align: center; margin-top: 32px;">
                        <div style="border-top: 1px solid #ebedf0; margin-bottom: 16px;"></div>
                        <button class="btn btn-default" style="width: auto; padding: 10px 24px;">创建新小区</button>
                    </div>
                </div>
            </div>
        `;
    },

    // 业主认证
    ownerVerify() {
        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <a href="javascript:history.back()" class="back-btn">‹</a>
                        <h1>业主认证</h1>
                        <span></span>
                    </div>
                </div>

                <div class="content">
                    <div class="card">
                        <div style="margin-bottom: 16px;">
                            <div style="font-size: 12px; color: #969799; margin-bottom: 4px;">当前选择小区</div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div style="font-size: 16px; font-weight: 600;">${UserStore.data.currentCommunity?.name || '幸福家园小区'}</div>
                                <a href="#/community/select" style="font-size: 12px; color: #1989fa;">更换小区 →</a>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">选择认证方式</h3>
                        <div class="checkbox-group">
                            <label class="checkbox-item active" onclick="selectVerifyMethod(this, 1)">
                                <div class="checkbox-radio"></div>
                                <div>
                                    <div style="font-weight: 600;">📄 房产证认证</div>
                                    <div style="font-size: 12px; color: #969799;">上传房产证照片，审核最快</div>
                                </div>
                            </label>
                            <label class="checkbox-item" onclick="selectVerifyMethod(this, 2)">
                                <div class="checkbox-radio"></div>
                                <div>
                                    <div style="font-weight: 600;">🏢 物业证明</div>
                                    <div style="font-size: 12px; color: #969799;">上传物业开具的业主证明</div>
                                </div>
                            </label>
                            <label class="checkbox-item" onclick="selectVerifyMethod(this, 3)">
                                <div class="checkbox-radio"></div>
                                <div>
                                    <div style="font-weight: 600;">👥 邻居担保</div>
                                    <div style="font-size: 12px; color: #969799;">2户以上已认证业主确认</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div class="card">
                        <div class="input-group">
                            <label>真实姓名</label>
                            <input type="text" class="input" placeholder="请输入真实姓名" id="realName">
                        </div>
                        <div class="input-group">
                            <label>手机号</label>
                            <input type="tel" class="input" placeholder="请输入手机号" id="phone">
                        </div>
                        <div class="input-group">
                            <label>楼栋号</label>
                            <input type="text" class="input" placeholder="如：1栋" id="building">
                        </div>
                        <div class="input-group">
                            <label>房号</label>
                            <input type="text" class="input" placeholder="如：301室" id="roomNumber">
                        </div>
                    </div>

                    <button class="btn btn-primary" onclick="submitVerify()">提交认证</button>
                    <p style="text-align: center; font-size: 12px; color: #969799; margin-top: 12px;">提交后我们将在24小时内完成审核</p>
                </div>
            </div>
        `;
    },

    // 认证状态
    verifyStatus() {
        const status = UserStore.data.ownerStatus;
        if (status === 'verified') {
            return `
                <div class="page active">
                    <div class="header">
                        <div class="header-content">
                            <a href="javascript:history.back()" class="back-btn">‹</a>
                            <h1>认证状态</h1>
                            <span></span>
                        </div>
                    </div>

                    <div class="content">
                        <div class="status-card">
                            <div class="status-icon success">✓</div>
                            <div class="status-title">认证已通过</div>
                            <div class="status-desc">您已成为认证业主，可以使用全部功能</div>
                        </div>

                        <div class="card">
                            <h3 class="card-title">认证信息</h3>
                            <div class="list-item">
                                <span>真实姓名</span>
                                <span style="color: #969799;">张三</span>
                            </div>
                            <div class="list-item">
                                <span>手机号</span>
                                <span style="color: #969799;">138****1234</span>
                            </div>
                            <div class="list-item">
                                <span>房号</span>
                                <span style="color: #969799;">1栋301室</span>
                            </div>
                        </div>

                        <button class="btn btn-primary" onclick="navigate('/payment')">下一步：支付年费</button>
                    </div>
                </div>
            `;
        } else if (status === 'pending') {
            return `
                <div class="page active">
                    <div class="header">
                        <div class="header-content">
                            <a href="javascript:history.back()" class="back-btn">‹</a>
                            <h1>认证状态</h1>
                            <span></span>
                        </div>
                    </div>

                    <div class="content">
                        <div class="status-card">
                            <div class="status-icon pending">⏳</div>
                            <div class="status-title">认证审核中</div>
                            <div class="status-desc">您的认证信息已提交，预计24小时内完成审核</div>
                            <div style="color: #ff976a; font-size: 14px; margin-top: 8px;">剩余 18 小时 32 分</div>
                        </div>

                        <button class="btn btn-default" onclick="checkStatus()">刷新状态</button>
                    </div>
                </div>
            `;
        }
    },

    // 支付页
    payment() {
        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <a href="javascript:history.back()" class="back-btn">‹</a>
                        <h1>支付年费</h1>
                        <span></span>
                    </div>
                </div>

                <div class="content">
                    <div class="card price-card">
                        <div class="price">1<span class="price-unit">元/年</span></div>
                        <div style="opacity: 0.9;">${UserStore.data.currentCommunity?.name || '幸福家园小区'}</div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">支付方式</h3>
                        <div class="list-item" style="padding-left: 0; padding-right: 0;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <span style="font-size: 24px;">💬</span>
                                <span>微信支付</span>
                            </div>
                            <div class="checkbox-radio" style="background: #07c160; border-color: #07c160;">
                                <div style="width: 8px; height: 8px; background: #fff; border-radius: 50%;"></div>
                            </div>
                        </div>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="display: flex; align-items: center; font-size: 12px;">
                            <input type="checkbox" checked style="margin-right: 8px;">
                            同意 <span style="color: #1989fa;">《服务协议》</span>
                        </label>
                    </div>

                    <button class="btn btn-primary" onclick="handlePay()">确认支付</button>
                </div>
            </div>
        `;
    },

    // 首页
    home() {
        const latestVotes = MockData.votes.slice(0, 2);
        const hotPosts = MockData.posts.slice(0, 2);

        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <div>
                            <div style="font-size: 20px; font-weight: 600;">${UserStore.data.currentCommunity?.name || '幸福家园小区'}</div>
                            <div style="font-size: 12px; opacity: 0.9;">
                                <span>认证业主 280人</span>
                                <span style="margin: 0 8px;">|</span>
                                <span>有效期至 2027-03-01</span>
                            </div>
                        </div>
                        <div style="width: 48px; height: 48px; border-radius: 50%; background: rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; font-size: 24px; border: 2px solid rgba(255,255,255,0.5); cursor: pointer;" onclick="navigate('/profile')">
                            👤
                        </div>
                    </div>
                </div>

                <div class="content">
                    <div class="grid">
                        <div class="grid-item" onclick="navigate('/law')">
                            <div class="grid-icon blue">📚</div>
                            <div class="grid-title">法律武器库</div>
                            <div class="grid-desc">维权法规一键查</div>
                        </div>
                        <div class="grid-item" onclick="navigate('/vote')">
                            <div class="grid-icon green">🗳️</div>
                            <div class="grid-title">集体表决</div>
                            <div class="grid-desc">一户一票做决定</div>
                        </div>
                        <div class="grid-item" onclick="navigate('/forum')">
                            <div class="grid-icon orange">💬</div>
                            <div class="grid-title">议事圈</div>
                            <div class="grid-desc">业主交流讨论</div>
                        </div>
                        <div class="grid-item" onclick="navigate('/contacts')">
                            <div class="grid-icon purple">👥</div>
                            <div class="grid-title">业主通讯录</div>
                            <div class="grid-desc">快速联络邻居</div>
                        </div>
                    </div>

                    <div class="card">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <h3 class="card-title" style="margin: 0;">最新表决</h3>
                            <a href="#/vote" style="font-size: 13px; color: #1989fa;">更多 →</a>
                        </div>
                        ${latestVotes.map(v => `
                            <div class="vote-item" onclick="navigate('/vote/detail/${v.id}')">
                                <div class="vote-header">
                                    <span class="tag ${v.status === 'ongoing' ? 'tag-primary' : 'tag-default'}">${v.status === 'ongoing' ? '进行中' : '已结束'}</span>
                                </div>
                                <div class="vote-title">${v.title}</div>
                                <div class="vote-stats">
                                    <span>参与 ${v.participated}人</span>
                                    <span>支持 ${v.support}票</span>
                                    <span>剩余 ${Math.ceil((new Date(v.endTime) - new Date()) / (1000 * 60 * 60 * 24))}天</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="card">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <h3 class="card-title" style="margin: 0;">热门讨论</h3>
                            <a href="#/forum" style="font-size: 13px; color: #1989fa;">更多 →</a>
                        </div>
                        ${hotPosts.map(p => `
                            <div class="post-item" onclick="navigate('/forum/detail/${p.id}')">
                                <div class="post-header">
                                    <div class="post-avatar">👤</div>
                                    <div class="post-info">
                                        <div class="post-author">${p.authorName}</div>
                                        <div class="post-time">${p.createdAt}</div>
                                    </div>
                                </div>
                                <div class="post-title">${p.title}</div>
                                <div class="post-content">${p.content.substring(0, 50)}...</div>
                                <div class="post-footer">
                                    <span>${p.viewCount}浏览</span>
                                    <span>${p.likeCount}赞</span>
                                    <span>${p.commentCount}回复</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    // 法律库
    law() {
        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <h1>法律武器库</h1>
                        <span></span>
                    </div>
                </div>

                <div class="content">
                    <div class="search-box" style="background: transparent; padding: 0 0 12px 0;">
                        <input type="text" class="search-input" placeholder="搜索法律条文、关键词">
                    </div>

                    <div class="card">
                        <h3 class="card-title">维权场景</h3>
                        ${MockData.scenarios.map(s => `
                            <div class="list-item" onclick="showToast('查看详情')">
                                <div class="list-item-content">
                                    <div class="list-item-title">${s.title}</div>
                                    <div class="list-item-desc">${s.description}</div>
                                </div>
                                <div class="list-item-arrow">›</div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="card">
                        <h3 class="card-title">常用法条</h3>
                        ${MockData.laws.map(l => `
                            <div class="list-item" onclick="showToast('查看详情')">
                                <div class="list-item-content">
                                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                        <span class="tag tag-primary">${l.category}</span>
                                        <span class="text-small text-gray">${l.article}</span>
                                    </div>
                                    <div class="list-item-desc" style="-webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden;">${l.content.substring(0, 60)}...</div>
                                </div>
                                <div class="list-item-arrow">›</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    // 表决
    vote() {
        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <h1>集体表决</h1>
                        <a href="#/vote/create" class="right-btn">+ 发起表决</a>
                    </div>
                </div>

                <div class="content">
                    ${MockData.votes.map(v => `
                        <div class="vote-item" onclick="navigate('/vote/detail/${v.id}')">
                            <div class="vote-header">
                                <span class="tag ${v.status === 'ongoing' ? 'tag-primary' : 'tag-default'}">${v.status === 'ongoing' ? '进行中' : '已结束'}</span>
                                <span class="text-small text-gray">${v.type}</span>
                            </div>
                            <div class="vote-title">${v.title}</div>
                            <div class="post-content" style="margin-bottom: 12px;">${v.content.substring(0, 60)}...</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${(v.participated / 280 * 100).toFixed(0)}%"></div>
                            </div>
                            <div class="vote-stats">
                                <span>参与 ${v.participated}人</span>
                                <span>支持 ${v.support}票</span>
                                <span>${v.status === 'ongoing' ? `剩余 ${Math.ceil((new Date(v.endTime) - new Date()) / (1000 * 60 * 60 * 24))}天` : '已结束'}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // 论坛
    forum() {
        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <h1>议事圈</h1>
                        <a href="#/forum/create" class="right-btn">+ 发布</a>
                    </div>
                </div>

                <div class="content">
                    ${MockData.posts.map(p => `
                        <div class="post-item" onclick="navigate('/forum/detail/${p.id}')">
                            <div class="post-header">
                                <div class="post-avatar">👤</div>
                                <div class="post-info">
                                    <div class="post-author">${p.authorName}</div>
                                    <div class="post-time">${p.createdAt}</div>
                                </div>
                                ${p.isTop ? '<span class="tag tag-danger">置顶</span>' : ''}
                                ${p.isUrgent ? '<span class="tag tag-warning">紧急</span>' : ''}
                            </div>
                            <div class="post-title">${p.title}</div>
                            <div class="post-content">${p.content.substring(0, 80)}...</div>
                            <div class="post-footer">
                                <span>${p.viewCount}浏览</span>
                                <span>${p.likeCount}赞</span>
                                <span>${p.commentCount}回复</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // 个人中心
    profile() {
        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <h1>个人中心</h1>
                        <span></span>
                    </div>
                </div>

                <div class="content">
                    <div class="card">
                        <div style="display: flex; align-items: center; gap: 16px;">
                            <div style="width: 64px; height: 64px; border-radius: 50%; background: #e3f2fd; display: flex; align-items: center; justify-content: center; font-size: 32px;">👤</div>
                            <div>
                                <div style="font-size: 18px; font-weight: 600;">${UserStore.data.nickname}</div>
                                <div style="font-size: 13px; color: #969799;">${UserStore.data.currentCommunity?.name || '幸福家园小区'}</div>
                                <div style="margin-top: 4px;">
                                    <span class="tag tag-success">已认证</span>
                                    <span class="tag tag-primary">已缴费</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">我的服务</h3>
                        <div class="list-item" onclick="navigate('/profile/payments')">
                            <div class="list-item-content">
                                <div class="list-item-title">缴费记录</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                        <div class="list-item" onclick="showToast('功能开发中')">
                            <div class="list-item-content">
                                <div class="list-item-title">我的小区</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                        <div class="list-item" onclick="showToast('功能开发中')">
                            <div class="list-item-content">
                                <div class="list-item-title">认证信息</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">设置</h3>
                        <div class="list-item" onclick="showToast('功能开发中')">
                            <div class="list-item-content">
                                <div class="list-item-title">账号安全</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                        <div class="list-item" onclick="showToast('功能开发中')">
                            <div class="list-item-content">
                                <div class="list-item-title">关于我们</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                    </div>

                    <button class="btn btn-default" style="margin-top: 24px;" onclick="handleLogout()">退出登录</button>
                </div>
            </div>
        `;
    },

    // 缴费记录
    payments() {
        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <a href="javascript:history.back()" class="back-btn">‹</a>
                        <h1>缴费记录</h1>
                        <span></span>
                    </div>
                </div>

                <div class="content">
                    ${MockData.payments.map(p => `
                        <div class="card">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                <div>
                                    <div style="font-weight: 600;">${p.communityName}</div>
                                    <div style="font-size: 12px; color: #969799;">订单号：${p.orderNo}</div>
                                </div>
                                <div style="font-size: 20px; font-weight: 600; color: #07c160;">¥${p.amount}</div>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #969799;">
                                <span>有效期：${p.startDate} 至 ${p.endDate}</span>
                                <span>${p.paidAt}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // 法律详情
    lawDetail(hash) {
        const id = parseInt(hash.split('/').pop());
        const law = MockData.laws.find(l => l.id === id);
        if (!law) {
            return `<div class="page active"><div class="content"><div class="card">法条不存在</div></div></div>`;
        }

        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <a href="javascript:history.back()" class="back-btn">‹</a>
                        <h1>法律详情</h1>
                        <span></span>
                    </div>
                </div>

                <div class="content">
                    <div class="card">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                            <span class="tag tag-primary">${law.category}</span>
                            <span class="text-small text-gray">${law.article}</span>
                        </div>
                        <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 12px;">${law.title}</h2>
                        <div style="font-size: 14px; color: #646566; margin-bottom: 8px;">${law.chapter}</div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">法条内容</h3>
                        <div style="font-size: 15px; line-height: 1.8; color: #323233;">${law.content}</div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">适用场景</h3>
                        ${law.scenarios.map(sid => {
                            const scenario = MockData.scenarios.find(s => s.id === sid);
                            return scenario ? `
                                <div class="list-item" style="padding-left: 0; padding-right: 0; cursor: pointer;" onclick="showToast('场景详情')">
                                    <div class="list-item-content">
                                        <div class="list-item-title">${scenario.title}</div>
                                        <div class="list-item-desc">${scenario.description}</div>
                                    </div>
                                    <div class="list-item-arrow">›</div>
                                </div>
                            ` : '';
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    // 论坛帖子详情
    forumDetail(hash) {
        const id = parseInt(hash.split('/').pop());
        const post = MockData.posts.find(p => p.id === id);
        if (!post) {
            return `<div class="page active"><div class="content"><div class="card">帖子不存在</div></div></div>`;
        }

        // 获取类型标签
        const typeLabels = { discussion: '讨论', notice: '通知', knowledge: '知识', complaint: '投诉' };
        const typeLabel = typeLabels[post.type] || '讨论';

        // 渲染评论
        function renderComment(comment, isReply = false) {
            return `
                <div class="${isReply ? 'reply-item' : 'comment-item'}" style="padding: 12px 0; ${!isReply ? 'border-bottom: 1px solid #ebedf0;' : 'padding-left: 44px; margin-top: 8px;'}"
                    <div style="display: flex; gap: 12px;">
                        <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #1989fa, #39b9fa); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; font-weight: 600; flex-shrink: 0;">
                            ${comment.authorName.charAt(0)}
                        </div>
                        <div style="flex: 1;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-weight: 600; font-size: 14px;">${comment.authorName}</span>
                                <span style="font-size: 12px; color: #969799;">${comment.createdAt}</span>
                            </div>
                            <div style="margin: 8px 0; font-size: 14px; line-height: 1.6; color: #323233;">${comment.content}</div>
                            <div style="display: flex; gap: 16px; font-size: 13px; color: #969799;">
                                <span onclick="showToast('点赞成功')" style="cursor: pointer;">👍 ${comment.likeCount}</span>
                                ${!isReply ? `<span onclick="showToast('回复功能开发中')" style="cursor: pointer;">💬 回复</span>` : ''}
                            </div>
                            ${!isReply && comment.replies && comment.replies.length > 0 ? `
                                <div style="margin-top: 8px; background: #f7f8fa; border-radius: 8px; padding: 8px 12px;">
                                    ${comment.replies.map(r => renderComment(r, true)).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }

        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <a href="javascript:history.back()" class="back-btn">‹</a>
                        <h1>帖子详情</h1>
                        <span></span>
                    </div>
                </div>

                <div class="content" style="padding-bottom: 80px;">
                    <!-- 帖子内容 -->
                    <div class="card">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                            <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #1989fa, #39b9fa); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px; font-weight: 600;">
                                ${post.authorName.charAt(0)}
                            </div>
                            <div>
                                <div style="font-weight: 600; font-size: 15px;">${post.authorName}</div>
                                <div style="font-size: 12px; color: #969799;">${post.createdAt}</div>
                            </div>
                            <div style="margin-left: auto;">
                                ${post.isTop ? '<span class="tag tag-danger">置顶</span>' : ''}
                                ${post.isUrgent ? '<span class="tag tag-warning">紧急</span>' : ''}
                                <span class="tag tag-primary">${typeLabel}</span>
                            </div>
                        </div>

                        <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; line-height: 1.4;">${post.title}</h2>

                        <div style="font-size: 15px; line-height: 1.8; color: #323233; white-space: pre-wrap; margin-bottom: 16px;">${post.content}</div>

                        ${post.images && post.images.length > 0 ? `
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px;">
                                ${post.images.map(img => `
                                    <div style="aspect-ratio: 1; background: #f5f5f5; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #969799; font-size: 12px;">
                                        📷 ${img}
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}

                        <div style="display: flex; justify-content: space-around; padding-top: 16px; border-top: 1px solid #ebedf0;">
                            <div style="text-align: center; color: #969799; font-size: 13px; cursor: pointer;" onclick="showToast('浏览统计')">
                                <div style="font-size: 20px; margin-bottom: 4px;">👁️</div>
                                ${post.viewCount}
                            </div>
                            <div style="text-align: center; color: #969799; font-size: 13px; cursor: pointer;" onclick="showToast('点赞成功')">
                                <div style="font-size: 20px; margin-bottom: 4px;">👍</div>
                                ${post.likeCount}
                            </div>
                            <div style="text-align: center; color: #969799; font-size: 13px; cursor: pointer;" onclick="showToast('分享成功')">
                                <div style="font-size: 20px; margin-bottom: 4px;">📤</div>
                                分享
                            </div>
                            <div style="text-align: center; color: #969799; font-size: 13px; cursor: pointer;" onclick="showToast('已举报')">
                                <div style="font-size: 20px; margin-bottom: 4px;">⚠️</div>
                                举报
                            </div>
                        </div>
                    </div>

                    <!-- 评论区 -->
                    <div class="card">
                        <h3 class="card-title">评论 (${post.comments ? post.comments.length : 0})</h3>
                        ${post.comments && post.comments.length > 0 ? `
                            <div>
                                ${post.comments.map(c => renderComment(c)).join('')}
                            </div>
                        ` : `
                            <div style="text-align: center; padding: 40px; color: #969799;">
                                <div style="font-size: 48px; margin-bottom: 12px;">💬</div>
                                <div>暂无评论，快来抢沙发吧~</div>
                            </div>
                        `}
                    </div>

                    <!-- 相关推荐 -->
                    <div class="card">
                        <h3 class="card-title">相关推荐</h3>
                        ${MockData.posts.filter(p => p.id !== post.id).slice(0, 2).map(p => `
                            <div class="list-item" style="padding-left: 0; padding-right: 0; cursor: pointer;" onclick="navigate('/forum/detail/${p.id}')">
                                <div class="list-item-content">
                                    <div class="list-item-title" style="-webkit-line-clamp: 1;">${p.title}</div>
                                    <div class="list-item-desc">${p.authorName} · ${p.viewCount}浏览</div>
                                </div>
                                <div class="list-item-arrow">›</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- 评论输入框（固定在底部） -->
                <div style="position: fixed; bottom: 0; left: 0; right: 0; background: #fff; border-top: 1px solid #ebedf0; padding: 12px 16px; display: flex; gap: 12px; align-items: center; z-index: 100;">
                    <input type="text" placeholder="写评论..." style="flex: 1; height: 40px; border: 1px solid #ebedf0; border-radius: 20px; padding: 0 16px; font-size: 14px; outline: none;" id="commentInput">
                    <button class="btn btn-primary" style="width: auto; padding: 10px 20px;" onclick="showToast('评论功能开发中')">发送</button>
                </div>
            </div>
        `;
    },

    // 表决详情
    voteDetail(hash) {
        const id = parseInt(hash.split('/').pop());
        const vote = MockData.votes.find(v => v.id === id);
        if (!vote) {
            return `<div class="page active"><div class="content"><div class="card">表决不存在</div></div></div>`;
        }

        const supportPercent = Math.round(vote.support / vote.participated * 100) || 0;
        const opposePercent = Math.round(vote.oppose / vote.participated * 100) || 0;
        const abstainPercent = Math.round(vote.abstain / vote.participated * 100) || 0;
        const participationRate = Math.round(vote.participated / 280 * 100);
        const daysLeft = Math.ceil((new Date(vote.endTime) - new Date()) / (1000 * 60 * 60 * 24));

        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <a href="javascript:history.back()" class="back-btn">‹</a>
                        <h1>表决详情</h1>
                        <span></span>
                    </div>
                </div>

                <div class="content">
                    <div class="card">
                        <div class="vote-header">
                            <span class="tag ${vote.status === 'ongoing' ? 'tag-primary' : 'tag-default'}">${vote.status === 'ongoing' ? '进行中' : '已结束'}</span>
                            <span class="text-small text-gray">${vote.type}</span>
                        </div>
                        <h2 style="font-size: 18px; font-weight: 600; margin: 12px 0;">${vote.title}</h2>
                        <div style="font-size: 14px; color: #646566; line-height: 1.6;">${vote.content}</div>
                        <div style="margin-top: 12px; font-size: 12px; color: #969799;">
                            表决时间：${vote.startTime} 至 ${vote.endTime}
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">参与情况</h3>
                        <div style="margin-bottom: 12px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <span>参与率</span>
                                <span>${participationRate}% (${vote.participated}/280户)</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${participationRate}%"></div>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-around; text-align: center; padding-top: 12px; border-top: 1px solid #ebedf0;">
                            <div>
                                <div style="font-size: 24px; font-weight: 600; color: #07c160;">${vote.support}</div>
                                <div style="font-size: 12px; color: #969799;">支持</div>
                            </div>
                            <div>
                                <div style="font-size: 24px; font-weight: 600; color: #ee0a24;">${vote.oppose}</div>
                                <div style="font-size: 12px; color: #969799;">反对</div>
                            </div>
                            <div>
                                <div style="font-size: 24px; font-weight: 600; color: #ff976a;">${vote.abstain}</div>
                                <div style="font-size: 12px; color: #969799;">弃权</div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">投票分布</h3>
                        <div style="margin-bottom: 12px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <span style="color: #07c160;">支持 ${supportPercent}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${supportPercent}%; background: linear-gradient(90deg, #07c160, #07c160);"></div>
                            </div>
                        </div>
                        <div style="margin-bottom: 12px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <span style="color: #ee0a24;">反对 ${opposePercent}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${opposePercent}%; background: linear-gradient(90deg, #ee0a24, #ee0a24);"></div>
                            </div>
                        </div>
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <span style="color: #ff976a;">弃权 ${abstainPercent}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${abstainPercent}%; background: linear-gradient(90deg, #ff976a, #ff976a);"></div>
                            </div>
                        </div>
                    </div>

                    ${vote.status === 'ongoing' ? `
                        <div class="card">
                            <div style="text-align: center; padding: 16px;">
                                <div style="font-size: 14px; color: #969799; margin-bottom: 16px;">剩余 ${daysLeft > 0 ? daysLeft : 0} 天</div>
                                <div style="display: flex; gap: 12px;">
                                    <button class="btn btn-primary" style="flex: 1; background: #07c160;" onclick="showToast('投票成功：支持')">支持</button>
                                    <button class="btn btn-default" style="flex: 1;" onclick="showToast('投票成功：反对')">反对</button>
                                    <button class="btn btn-default" style="flex: 1;" onclick="showToast('投票成功：弃权')">弃权</button>
                                </div>
                            </div>
                        </div>
                    ` : `
                        <div class="card">
                            <div style="text-align: center; padding: 16px; color: #969799;">
                                该表决已结束
                            </div>
                        </div>
                    `}
                </div>
            </div>
        `;
    },

    // 发起表决
    voteCreate() {
        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <a href="javascript:history.back()" class="back-btn">‹</a>
                        <h1>发起表决</h1>
                        <span></span>
                    </div>
                </div>

                <div class="content" style="padding-bottom: 100px;">
                    <!-- 表决标题 -->
                    <div class="card">
                        <div class="input-group">
                            <label>表决标题 <span style="color: #ee0a24;">*</span></label>
                            <input type="text" class="input" placeholder="请输入表决标题，如：关于选聘新物业公司的表决" id="voteTitle" maxlength="50" oninput="updateVoteCharCount('title')">
                            <div style="text-align: right; font-size: 12px; color: #969799; margin-top: 4px;">
                                <span id="titleCount">0</span>/50
                            </div>
                        </div>
                    </div>

                    <!-- 表决内容 -->
                    <div class="card">
                        <div class="input-group">
                            <label>表决内容 <span style="color: #ee0a24;">*</span></label>
                            <textarea class="input" style="min-height: 120px; resize: none;" placeholder="请详细描述表决事项的背景、原因和具体内容..." id="voteContent" maxlength="500" oninput="updateVoteCharCount('content')"></textarea>
                            <div style="text-align: right; font-size: 12px; color: #969799; margin-top: 4px;">
                                <span id="contentCount">0</span>/500
                            </div>
                        </div>
                    </div>

                    <!-- 表决类型 -->
                    <div class="card">
                        <h3 class="card-title">表决类型</h3>
                        <div class="checkbox-group">
                            <label class="checkbox-item active" onclick="selectVoteType(this, 'normal')">
                                <div class="checkbox-radio"></div>
                                <div>
                                    <div style="font-weight: 600;">普通表决</div>
                                    <div style="font-size: 12px; color: #969799;">一般事项，需1/2参与率</div>
                                </div>
                            </label>
                            <label class="checkbox-item" onclick="selectVoteType(this, 'major')">
                                <div class="checkbox-radio"></div>
                                <div>
                                    <div style="font-weight: 600;">重大事项</div>
                                    <div style="font-size: 12px; color: #969799;">选聘物业、维修资金等，需2/3参与率</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- 截止时间 -->
                    <div class="card">
                        <div class="input-group">
                            <label>截止时间 <span style="color: #ee0a24;">*</span></label>
                            <input type="datetime-local" class="input" id="voteEndTime">
                            <div style="font-size: 12px; color: #969799; margin-top: 4px;">
                                建议设置7-15天，让业主有充足时间参与
                            </div>
                        </div>
                    </div>

                    <!-- 选项设置 -->
                    <div class="card">
                        <h3 class="card-title">投票选项</h3>
                        <div style="display: flex; gap: 12px; margin-bottom: 12px;">
                            <div style="flex: 1; padding: 12px; background: #e8f5e9; border-radius: 8px; text-align: center; color: #07c160; font-weight: 600;">支持</div>
                            <div style="flex: 1; padding: 12px; background: #ffebee; border-radius: 8px; text-align: center; color: #ee0a24; font-weight: 600;">反对</div>
                            <div style="flex: 1; padding: 12px; background: #fff3e0; border-radius: 8px; text-align: center; color: #ff976a; font-weight: 600;">弃权</div>
                        </div>
                        <div style="font-size: 12px; color: #969799;">默认三选项，暂不支持自定义</div>
                    </div>

                    <!-- 其他设置 -->
                    <div class="card">
                        <h3 class="card-title">其他设置</h3>
                        <div class="list-item" style="padding-left: 0; padding-right: 0;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span>匿名表决</span>
                                <span style="font-size: 12px; color: #969799;">(投票人身份仅管理员可见)</span>
                            </div>
                            <label class="switch" style="position: relative; display: inline-block; width: 50px; height: 28px;">
                                <input type="checkbox" id="voteAnonymous" style="opacity: 0; width: 0; height: 0;">
                                <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; border-radius: 28px; transition: .3s;"></span>
                            </label>
                        </div>
                    </div>

                    <!-- 提示信息 -->
                    <div class="card" style="background: #e3f2fd; border: none;">
                        <div style="font-size: 13px; color: #1989fa; line-height: 1.6;">
                            💡 <strong>提示：</strong><br>
                            1. 表决发起后不可修改内容<br>
                            2. 普通表决需超过50%参与率才有效<br>
                            3. 重大事项需超过2/3参与率才有效<br>
                            4. 每人每天最多发起3个表决
                        </div>
                    </div>
                </div>

                <!-- 底部按钮 -->
                <div style="position: fixed; bottom: 0; left: 0; right: 0; background: #fff; border-top: 1px solid #ebedf0; padding: 12px 16px; display: flex; gap: 12px; z-index: 100;">
                    <button class="btn btn-default" style="flex: 1;" onclick="history.back()">取消</button>
                    <button class="btn btn-primary" style="flex: 2;" onclick="submitVote()">提交表决</button>
                </div>
            </div>
        `;
    },

    // 发起帖子
    forumCreate() {
        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <a href="javascript:history.back()" class="back-btn">‹</a>
                        <h1>发布帖子</h1>
                        <span></span>
                    </div>
                </div>

                <div class="content" style="padding-bottom: 100px;">
                    <!-- 帖子类型 -->
                    <div class="card">
                        <h3 class="card-title">帖子类型</h3>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;" id="postTypeGroup">
                            <span class="tag tag-primary active" onclick="selectPostType(this, 'discussion')" data-type="discussion">💬 讨论</span>
                            <span class="tag tag-primary" onclick="selectPostType(this, 'suggestion')" data-type="suggestion">💡 建议</span>
                            <span class="tag tag-primary" onclick="selectPostType(this, 'complaint')" data-type="complaint">⚠️ 投诉</span>
                            <span class="tag tag-primary" onclick="selectPostType(this, 'knowledge')" data-type="knowledge">📚 知识</span>
                        </div>
                    </div>

                    <!-- 帖子标题 -->
                    <div class="card">
                        <div class="input-group">
                            <label>标题 <span style="color: #ee0a24;">*</span></label>
                            <input type="text" class="input" placeholder="请输入帖子标题" id="postTitle" maxlength="50" oninput="updatePostCharCount('title')">
                            <div style="text-align: right; font-size: 12px; color: #969799; margin-top: 4px;">
                                <span id="postTitleCount">0</span>/50
                            </div>
                        </div>
                    </div>

                    <!-- 帖子内容 -->
                    <div class="card">
                        <div class="input-group">
                            <label>内容 <span style="color: #ee0a24;">*</span></label>
                            <textarea class="input" style="min-height: 150px; resize: none;" placeholder="请详细描述您的问题、建议或想法..." id="postContent" maxlength="1000" oninput="updatePostCharCount('content')"></textarea>
                            <div style="text-align: right; font-size: 12px; color: #969799; margin-top: 4px;">
                                <span id="postContentCount">0</span>/1000
                            </div>
                        </div>
                    </div>

                    <!-- 标签选择 -->
                    <div class="card">
                        <h3 class="card-title">标签（最多3个）</h3>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;" id="postTagsGroup">
                            <span class="tag tag-primary" onclick="togglePostTag(this)" data-tag="物业">物业</span>
                            <span class="tag tag-primary" onclick="togglePostTag(this)" data-tag="设施">设施</span>
                            <span class="tag tag-primary" onclick="togglePostTag(this)" data-tag="安全">安全</span>
                            <span class="tag tag-primary" onclick="togglePostTag(this)" data-tag="环境">环境</span>
                            <span class="tag tag-primary" onclick="togglePostTag(this)" data-tag="停车">停车</span>
                            <span class="tag tag-primary" onclick="togglePostTag(this)" data-tag="噪音">噪音</span>
                            <span class="tag tag-primary" onclick="togglePostTag(this)" data-tag="其他">其他</span>
                        </div>
                    </div>

                    <!-- 图片上传 -->
                    <div class="card">
                        <h3 class="card-title">添加图片（最多9张）</h3>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;" id="postImagesContainer">
                            <div style="aspect-ratio: 1; border: 2px dashed #ddd; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #969799; cursor: pointer;" onclick="showToast('图片上传功能开发中')">
                                <div style="font-size: 24px; margin-bottom: 4px;">📷</div>
                                <div style="font-size: 12px;">添加</div>
                            </div>
                        </div>
                    </div>

                    <!-- 其他设置 -->
                    <div class="card">
                        <h3 class="card-title">其他设置</h3>
                        <div class="list-item" style="padding-left: 0; padding-right: 0;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span>🔴 标记为紧急</span>
                                <span style="font-size: 12px; color: #969799;">(紧急帖子将优先展示)</span>
                            </div>
                            <input type="checkbox" id="postUrgent">
                        </div>
                        <div class="list-item" style="padding-left: 0; padding-right: 0;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span>🥷 匿名发布</span>
                                <span style="font-size: 12px; color: #969799;">(其他人无法看到您的身份)</span>
                            </div>
                            <input type="checkbox" id="postAnonymous">
                        </div>
                    </div>

                    <!-- 提示信息 -->
                    <div class="card" style="background: #fff3e0; border: none;">
                        <div style="font-size: 13px; color: #ff976a; line-height: 1.6;">
                            💡 <strong>发帖规范：</strong><br>
                            1. 请遵守法律法规，文明发言<br>
                            2. 投诉类帖子建议先与物业沟通<br>
                            3. 紧急事项请同时联系物业电话<br>
                            4. 虚假信息将被删除并封号
                        </div>
                    </div>
                </div>

                <!-- 底部按钮 -->
                <div style="position: fixed; bottom: 0; left: 0; right: 0; background: #fff; border-top: 1px solid #ebedf0; padding: 12px 16px; display: flex; gap: 12px; z-index: 100;">
                    <button class="btn btn-default" style="flex: 1;" onclick="history.back()">取消</button>
                    <button class="btn btn-primary" style="flex: 2;" onclick="submitPost()">发布帖子</button>
                </div>
            </div>
        `;
    },

    // 业主通讯录
    contacts() {
        // 按楼栋分组
        const grouped = {};
        MockData.contacts.forEach(c => {
            if (!grouped[c.building]) {
                grouped[c.building] = [];
            }
            grouped[c.building].push(c);
        });

        // 楼栋排序
        const sortedBuildings = Object.keys(grouped).sort((a, b) => parseInt(a) - parseInt(b));

        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <a href="javascript:history.back()" class="back-btn">‹</a>
                        <h1>业主通讯录</h1>
                        <span style="font-size: 13px; color: #1989fa;">${MockData.contacts.length}人</span>
                    </div>
                </div>

                <div class="content">
                    <!-- 搜索栏 -->
                    <div class="search-box" style="background: transparent; padding: 0 0 12px 0;">
                        <input type="text" class="search-input" placeholder="搜索楼栋、房号或姓名" id="contactSearch" oninput="filterContacts(this.value)">
                    </div>

                    <!-- 筛选标签 -->
                    <div class="card" style="padding: 12px;">
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;" id="buildingFilter">
                            <span class="tag tag-primary active" onclick="filterByBuilding('all', this)" data-building="all">全部</span>
                            ${sortedBuildings.map(b => `<span class="tag tag-primary" onclick="filterByBuilding('${b}', this)" data-building="${b}">${b}栋</span>`).join('')}
                        </div>
                    </div>

                    <!-- 业主列表 -->
                    <div id="contactsList">
                        ${sortedBuildings.map(building => `
                            <div class="card building-group" data-building="${building}">
                                <div style="font-size: 14px; font-weight: 600; color: #1989fa; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #ebedf0;">
                                    ${building}栋 (${grouped[building].length}户)
                                </div>
                                ${grouped[building].sort((a, b) => parseInt(a.room) - parseInt(b.room)).map(c => `
                                    <div class="list-item contact-item" style="padding-left: 0; padding-right: 0;" data-name="${c.name}" data-room="${c.room}" data-building="${c.building}">
                                        <div style="display: flex; align-items: center; gap: 12px;">
                                            <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #1989fa, #39b9fa); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px; font-weight: 600;">
                                                ${c.name}
                                            </div>
                                            <div>
                                                <div style="font-weight: 600; font-size: 15px;">${c.building}-${c.room} 业主</div>
                                                <div style="font-size: 13px; color: #969799;">
                                                    <span style="margin-right: 12px;">📞 ${c.phone}</span>
                                                    <span class="tag tag-success" style="font-size: 11px;">已认证</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button class="btn btn-primary" style="width: auto; padding: 8px 16px; font-size: 13px;" onclick="showToast('呼叫功能开发中')">呼叫</button>
                                    </div>
                                `).join('')}
                            </div>
                        `).join('')}
                    </div>

                    <!-- 空状态 -->
                    <div id="emptyState" class="card" style="display: none; text-align: center; padding: 40px;">
                        <div style="font-size: 48px; margin-bottom: 12px;">🔍</div>
                        <div style="color: #969799;">未找到匹配的业主</div>
                    </div>
                </div>
            </div>
        `;
    }
};

// 通讯录筛选功能
function filterContacts(keyword) {
    const items = document.querySelectorAll('.contact-item');
    const groups = document.querySelectorAll('.building-group');
    const emptyState = document.getElementById('emptyState');
    let hasVisible = false;

    keyword = keyword.toLowerCase().trim();

    items.forEach(item => {
        const name = item.dataset.name.toLowerCase();
        const room = item.dataset.room;
        const building = item.dataset.building;
        const match = name.includes(keyword) || room.includes(keyword) || building.includes(keyword);
        item.style.display = match ? 'flex' : 'none';
        if (match) hasVisible = true;
    });

    // 隐藏空分组
    groups.forEach(group => {
        const visibleItems = group.querySelectorAll('.contact-item:not([style*="display: none"])');
        group.style.display = visibleItems.length > 0 ? 'block' : 'none';
    });

    emptyState.style.display = hasVisible ? 'none' : 'block';
}

function filterByBuilding(building, el) {
    // 更新标签状态
    document.querySelectorAll('#buildingFilter .tag').forEach(tag => tag.classList.remove('active'));
    el.classList.add('active');

    const groups = document.querySelectorAll('.building-group');
    const searchInput = document.getElementById('contactSearch');

    groups.forEach(group => {
        if (building === 'all') {
            group.style.display = 'block';
            // 恢复所有子项
            group.querySelectorAll('.contact-item').forEach(item => item.style.display = 'flex');
        } else {
            group.style.display = group.dataset.building === building ? 'block' : 'none';
        }
    });

    // 清空搜索框
    if (searchInput) searchInput.value = '';
}

// 事件处理函数
function handleLogin() {
    const agreed = document.getElementById('agreement');
    if (!agreed || !agreed.checked) {
        showToast('请先同意用户协议和隐私政策');
        return;
    }

    UserStore.login({ nickname: '微信用户' + Math.floor(Math.random() * 1000) });
    showToast('登录成功');

    setTimeout(() => {
        if (!UserStore.hasCommunity()) {
            navigate('/community/select');
        } else {
            navigate('/home');
        }
    }, 500);
}

function handleLogout() {
    if (confirm('确定要退出登录吗？')) {
        UserStore.logout();
        showToast('已退出登录');
        navigate('/');
    }
}

function selectCommunity(id) {
    const community = MockData.communities.find(c => c.id === id);
    if (community) {
        UserStore.setCommunity(community);
        showToast('已选择 ' + community.name);
        setTimeout(() => navigate('/owner/verify'), 500);
    }
}

function selectVerifyMethod(el, method) {
    document.querySelectorAll('.checkbox-item').forEach(item => {
        item.classList.remove('active');
    });
    el.classList.add('active');
}

function submitVerify() {
    const realName = document.getElementById('realName')?.value;
    const phone = document.getElementById('phone')?.value;
    const building = document.getElementById('building')?.value;
    const roomNumber = document.getElementById('roomNumber')?.value;

    if (!realName) { showToast('请输入真实姓名'); return; }
    if (!phone) { showToast('请输入手机号'); return; }
    if (!building) { showToast('请输入楼栋号'); return; }
    if (!roomNumber) { showToast('请输入房号'); return; }

    UserStore.setOwnerStatus('pending');
    showToast('提交成功，等待审核');
    setTimeout(() => navigate('/owner/status'), 500);
}

function checkStatus() {
    showToast('状态已更新');
    // 模拟审核通过
    if (Math.random() > 0.5) {
        UserStore.setOwnerStatus('verified');
        setTimeout(() => render(), 1000);
    }
}

function handlePay() {
    if (confirm('确认支付1元年费？')) {
        UserStore.setPaid(true);
        showToast('支付成功');
        setTimeout(() => navigate('/home'), 500);
    }
}

// 表决相关函数
function updateVoteCharCount(field) {
    if (field === 'title') {
        const count = document.getElementById('voteTitle')?.value.length || 0;
        const el = document.getElementById('titleCount');
        if (el) el.textContent = count;
    } else if (field === 'content') {
        const count = document.getElementById('voteContent')?.value.length || 0;
        const el = document.getElementById('contentCount');
        if (el) el.textContent = count;
    }
}

function selectVoteType(el, type) {
    document.querySelectorAll('.checkbox-item').forEach(item => {
        item.classList.remove('active');
    });
    el.classList.add('active');
}

function submitVote() {
    const title = document.getElementById('voteTitle')?.value.trim();
    const content = document.getElementById('voteContent')?.value.trim();
    const endTime = document.getElementById('voteEndTime')?.value;
    const isAnonymous = document.getElementById('voteAnonymous')?.checked || false;

    if (!title) { showToast('请输入表决标题'); return; }
    if (title.length < 5) { showToast('标题至少5个字'); return; }
    if (!content) { showToast('请输入表决内容'); return; }
    if (content.length < 20) { showToast('内容至少20个字'); return; }
    if (!endTime) { showToast('请选择截止时间'); return; }

    const endDate = new Date(endTime);
    const now = new Date();
    if (endDate <= now) { showToast('截止时间必须大于当前时间'); return; }

    const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    if (daysLeft > 30) { showToast('截止时间不能超过30天'); return; }

    if (confirm(`确认提交表决？\n\n标题：${title}\n截止：${endTime}\n匿名：${isAnonymous ? '是' : '否'}`)) {
        // 添加到模拟数据
        const newVote = {
            id: MockData.votes.length + 1,
            title: title,
            content: content,
            type: document.querySelector('.checkbox-item.active')?.textContent.includes('重大') ? '重大事项' : '普通表决',
            status: 'ongoing',
            startTime: now.toISOString().split('T')[0],
            endTime: endTime.split('T')[0],
            viewCount: 0,
            participated: 0,
            support: 0,
            oppose: 0,
            abstain: 0
        };
        MockData.votes.unshift(newVote);
        showToast('表决发起成功！');
        setTimeout(() => navigate('/vote'), 500);
    }
}

// 帖子相关函数
function updatePostCharCount(field) {
    if (field === 'title') {
        const count = document.getElementById('postTitle')?.value.length || 0;
        const el = document.getElementById('postTitleCount');
        if (el) el.textContent = count;
    } else if (field === 'content') {
        const count = document.getElementById('postContent')?.value.length || 0;
        const el = document.getElementById('postContentCount');
        if (el) el.textContent = count;
    }
}

function selectPostType(el, type) {
    document.querySelectorAll('#postTypeGroup .tag').forEach(tag => {
        tag.classList.remove('active');
    });
    el.classList.add('active');
}

function togglePostTag(el) {
    const selectedCount = document.querySelectorAll('#postTagsGroup .tag.active').length;
    if (el.classList.contains('active')) {
        el.classList.remove('active');
    } else if (selectedCount < 3) {
        el.classList.add('active');
    } else {
        showToast('最多选择3个标签');
    }
}

function submitPost() {
    const title = document.getElementById('postTitle')?.value.trim();
    const content = document.getElementById('postContent')?.value.trim();
    const isUrgent = document.getElementById('postUrgent')?.checked || false;
    const isAnonymous = document.getElementById('postAnonymous')?.checked || false;
    
    const selectedType = document.querySelector('#postTypeGroup .tag.active')?.dataset.type || 'discussion';
    const selectedTags = Array.from(document.querySelectorAll('#postTagsGroup .tag.active')).map(t => t.dataset.tag);

    if (!title) { showToast('请输入帖子标题'); return; }
    if (title.length < 5) { showToast('标题至少5个字'); return; }
    if (!content) { showToast('请输入帖子内容'); return; }
    if (content.length < 10) { showToast('内容至少10个字'); return; }

    if (confirm('确认发布帖子？')) {
        const now = new Date();
        const newPost = {
            id: MockData.posts.length + 1,
            authorName: isAnonymous ? '匿名业主' : (UserStore.data.nickname || '热心业主'),
            title: title,
            content: content,
            type: selectedType,
            isUrgent: isUrgent,
            isTop: false,
            viewCount: 0,
            likeCount: 0,
            commentCount: 0,
            createdAt: now.toISOString().split('T')[0] + ' ' + now.toTimeString().slice(0, 5),
            images: [],
            tags: selectedTags,
            comments: []
        };
        MockData.posts.unshift(newPost);
        showToast('帖子发布成功！');
        setTimeout(() => navigate('/forum'), 500);
    }
}

// 绑定事件
function bindEvents() {
    // 底部导航点击事件
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            const path = '/' + page;
            navigate(path);
        });
    });
}

// 监听hash变化
window.addEventListener('hashchange', render);

// 初始化
window.addEventListener('DOMContentLoaded', () => {
    render();
});

// 暴露全局函数
window.navigate = navigate;
window.showToast = showToast;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.selectCommunity = selectCommunity;
window.selectVerifyMethod = selectVerifyMethod;
window.submitVerify = submitVerify;
window.checkStatus = checkStatus;
window.handlePay = handlePay;
window.filterContacts = filterContacts;
window.filterByBuilding = filterByBuilding;
window.updateVoteCharCount = updateVoteCharCount;
window.selectVoteType = selectVoteType;
window.submitVote = submitVote;
window.updatePostCharCount = updatePostCharCount;
window.selectPostType = selectPostType;
window.togglePostTag = togglePostTag;
window.submitPost = submitPost;
