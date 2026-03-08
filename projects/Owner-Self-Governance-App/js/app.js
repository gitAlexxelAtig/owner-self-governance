/** 业主自治宝 - 纯HTML5版 */

// 初始化用户数据
UserStore.init();
// 初始化交互数据存储
InteractionStore.init && InteractionStore.init();

// 当前帖子ID（用于评论功能）
let currentPostId = null;

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
    '/scenario/detail/:id': 'scenarioDetail',
    '/vote': 'vote',
    '/vote/detail/:id': 'voteDetail',
    '/vote/create': 'voteCreate',
    '/forum': 'forum',
    '/forum/detail/:id': 'forumDetail',
    '/forum/create': 'forumCreate',
    '/profile': 'profile',
    '/profile/payments': 'payments',
    '/profile/community': 'myCommunity',
    '/profile/verify': 'verifyInfo',
    '/profile/security': 'accountSecurity',
    '/profile/about': 'aboutUs',
    '/agreement/user': 'userAgreement',
    '/agreement/privacy': 'privacyPolicy',
    '/agreement/community': 'communityRules',
    '/contacts': 'contacts',
    '/notifications': 'notifications',
    '/search': 'search',
    '/statistics': 'statistics'
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

// 显示加载动画
function showLoading(text = '加载中...') {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.querySelector('.loading-text').textContent = text;
        loading.style.display = 'flex';
    }
}

// 隐藏加载动画
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
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
        const unreadCount = MockData.notifications.filter(n => !n.isRead).length;

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
                        <div style="display: flex; gap: 12px;">
                            <div style="width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; font-size: 20px; border: 2px solid rgba(255,255,255,0.5); cursor: pointer; position: relative;" onclick="navigate('/notifications')">
                                🔔
                                ${unreadCount > 0 ? `<span style="position: absolute; top: -2px; right: -2px; width: 18px; height: 18px; background: #ee0a24; border-radius: 50%; font-size: 11px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600;">${unreadCount}</span>` : ''}
                            </div>
                            <div style="width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; font-size: 20px; border: 2px solid rgba(255,255,255,0.5); cursor: pointer;" onclick="navigate('/profile')">
                                👤
                            </div>
                        </div>
                    </div>
                </div>

                <div class="content">
                    <!-- 搜索栏 -->
                    <div class="card" style="padding: 12px; cursor: pointer;" onclick="navigate('/search')">
                        <div style="display: flex; align-items: center; gap: 8px; background: #f5f5f5; border-radius: 8px; padding: 10px 12px;">
                            <span style="color: #969799;">🔍</span>
                            <span style="color: #969799; font-size: 14px;">搜索法律、表决、帖子...</span>
                        </div>
                    </div>

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

                    <!-- 数据统计入口 -->
                    <div class="card" onclick="navigate('/statistics')" style="cursor: pointer; background: linear-gradient(135deg, #1989fa 0%, #39b9fa 100%); color: #fff;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h3 style="margin: 0 0 4px 0; font-size: 16px;">📊 小区数据看板</h3>
                                <div style="font-size: 13px; opacity: 0.9;">查看小区表决、论坛活跃度统计</div>
                            </div>
                            <div style="font-size: 24px;">›</div>
                        </div>
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
                            <div class="list-item" onclick="navigate('/scenario/detail/${s.id}')">
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
                            <div class="list-item" onclick="navigate('/law/detail/${l.id}')">
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
        const unreadCount = MockData.notifications.filter(n => !n.isRead).length;

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
                                <div class="list-item-title">💳 缴费记录</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                        <div class="list-item" onclick="navigate('/notifications')">
                            <div class="list-item-content" style="display: flex; justify-content: space-between; align-items: center;">
                                <div class="list-item-title">🔔 消息通知</div>
                                ${unreadCount > 0 ? `<span style="background: #ee0a24; color: #fff; font-size: 11px; padding: 2px 8px; border-radius: 10px;">${unreadCount}未读</span>` : ''}
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                        <div class="list-item" onclick="navigate('/statistics')">
                            <div class="list-item-content">
                                <div class="list-item-title">📊 数据统计</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                        <div class="list-item" onclick="navigate('/search')">
                            <div class="list-item-content">
                                <div class="list-item-title">🔍 搜索</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                        <div class="list-item" onclick="navigate('/profile/community')">
                            <div class="list-item-content">
                                <div class="list-item-title">🏘️ 我的小区</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                        <div class="list-item" onclick="navigate('/profile/verify')">
                            <div class="list-item-content">
                                <div class="list-item-title">📝 认证信息</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <h3 class="card-title">设置</h3>
                        <div class="list-item" onclick="navigate('/profile/security')">
                            <div class="list-item-content">
                                <div class="list-item-title">🔒 账号安全</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                        <div class="list-item" onclick="navigate('/profile/about')">
                            <div class="list-item-content">
                                <div class="list-item-title">ℹ️ 关于我们</div>
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

    // 我的小区页面
    myCommunity() {
        const community = UserStore.data.currentCommunity || MockData.communities[0];
        const mockPropertyCompany = {
            name: '幸福物业服务有限公司',
            contact: '400-888-1234',
            address: '幸福路1号物业服务中心',
            manager: '王经理',
            serviceHours: '9:00-18:00'
        };

        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <a href="javascript:history.back()" class="back-btn">‹</a>
                        <h1>我的小区</h1>
                        <span></span>
                    </div>
                </div>

                <div class="content">
                    <!-- 小区基本信息 -->
                    <div class="card">
                        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                            <div style="width: 64px; height: 64px; border-radius: 12px; background: linear-gradient(135deg, #1989fa 0%, #39b9fa 100%); display: flex; align-items: center; justify-content: center; font-size: 32px;">🏘️</div>
                            <div style="flex: 1;">
                                <div style="font-size: 18px; font-weight: 600;">${community.name}</div>
                                <div style="font-size: 13px; color: #969799; margin-top: 4px;">${community.address}</div>
                            </div>
                        </div>
                        <button class="btn btn-default" style="width: 100%;" onclick="navigate('/community/select')">🔄 切换小区</button>
                    </div>

                    <!-- 小区统计数据 -->
                    <div class="card">
                        <h3 class="card-title">小区概况</h3>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                            <div style="text-align: center; padding: 16px; background: #f7f8fa; border-radius: 8px;">
                                <div style="font-size: 28px; font-weight: 600; color: #1989fa;">${community.totalBuildings}</div>
                                <div style="font-size: 13px; color: #969799; margin-top: 4px;">总楼栋数</div>
                            </div>
                            <div style="text-align: center; padding: 16px; background: #f7f8fa; border-radius: 8px;">
                                <div style="font-size: 28px; font-weight: 600; color: #07c160;">${community.totalUnits}</div>
                                <div style="font-size: 13px; color: #969799; margin-top: 4px;">总户数</div>
                            </div>
                            <div style="text-align: center; padding: 16px; background: #f7f8fa; border-radius: 8px;">
                                <div style="font-size: 28px; font-weight: 600; color: #ff976a;">${community.verifiedCount}</div>
                                <div style="font-size: 13px; color: #969799; margin-top: 4px;">已认证人数</div>
                            </div>
                            <div style="text-align: center; padding: 16px; background: #f7f8fa; border-radius: 8px;">
                                <div style="font-size: 28px; font-weight: 600; color: #ee0a24;">${Math.round(community.verifiedCount / community.totalUnits * 100)}%</div>
                                <div style="font-size: 13px; color: #969799; margin-top: 4px;">认证率</div>
                            </div>
                        </div>
                    </div>

                    <!-- 物业服务公司信息 -->
                    <div class="card">
                        <h3 class="card-title">🏢 物业服务公司</h3>
                        <div class="list-item" style="padding-left: 0; padding-right: 0;">
                            <span style="color: #969799;">公司名称</span>
                            <span style="font-weight: 600;">${mockPropertyCompany.name}</span>
                        </div>
                        <div class="list-item" style="padding-left: 0; padding-right: 0;">
                            <span style="color: #969799;">联系电话</span>
                            <span style="font-weight: 600; color: #1989fa;" onclick="showToast('拨打客服电话：${mockPropertyCompany.contact}')">${mockPropertyCompany.contact}</span>
                        </div>
                        <div class="list-item" style="padding-left: 0; padding-right: 0;">
                            <span style="color: #969799;">物业地址</span>
                            <span>${mockPropertyCompany.address}</span>
                        </div>
                        <div class="list-item" style="padding-left: 0; padding-right: 0;">
                            <span style="color: #969799;">物业经理</span>
                            <span>${mockPropertyCompany.manager}</span>
                        </div>
                        <div class="list-item" style="padding-left: 0; padding-right: 0;">
                            <span style="color: #969799;">服务时间</span>
                            <span>${mockPropertyCompany.serviceHours}</span>
                        </div>
                    </div>

                    <!-- 小区有效期 -->
                    <div class="card" style="background: linear-gradient(135deg, #07c160 0%, #07c160 100%); color: #fff;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 4px;">服务有效期至</div>
                                <div style="font-size: 20px; font-weight: 600;">2027-03-01</div>
                            </div>
                            <div style="font-size: 48px; opacity: 0.3;">✓</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // 认证信息页面
    verifyInfo() {
        const isVerified = UserStore.data.ownerStatus === 'verified' || UserStore.data.ownerStatus === 'pending';
        const status = UserStore.data.ownerStatus || 'unverified';
        const mockVerifyInfo = {
            realName: '张三',
            phone: '138****1234',
            building: '1栋',
            roomNumber: '301室',
            verifyTime: '2025-03-01 14:30:00',
            verifyMethod: '房产证认证'
        };

        const statusConfig = {
            verified: { icon: '✓', color: '#07c160', text: '已认证', desc: '您已完成业主认证，可使用全部功能' },
            pending: { icon: '⏳', color: '#ff976a', text: '审核中', desc: '您的认证信息正在审核中，请耐心等待' },
            unverified: { icon: '✗', color: '#969799', text: '未认证', desc: '您尚未完成业主认证，请先进行认证' }
        };

        const config = statusConfig[status] || statusConfig.unverified;

        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <a href="javascript:history.back()" class="back-btn">‹</a>
                        <h1>认证信息</h1>
                        <span></span>
                    </div>
                </div>

                <div class="content">
                    <!-- 认证状态卡片 -->
                    <div class="card" style="text-align: center; padding: 32px 24px;">
                        <div style="width: 80px; height: 80px; border-radius: 50%; background: ${config.color}20; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 40px; color: ${config.color};">
                            ${config.icon}
                        </div>
                        <div style="font-size: 20px; font-weight: 600; color: ${config.color}; margin-bottom: 8px;">${config.text}</div>
                        <div style="font-size: 14px; color: #969799;">${config.desc}</div>
                    </div>

                    <!-- 认证信息详情 -->
                    ${isVerified ? `
                    <div class="card">
                        <h3 class="card-title">认证信息</h3>
                        <div class="list-item" style="padding-left: 0; padding-right: 0;">
                            <span style="color: #969799;">真实姓名</span>
                            <span style="font-weight: 600;">${mockVerifyInfo.realName}</span>
                        </div>
                        <div class="list-item" style="padding-left: 0; padding-right: 0;">
                            <span style="color: #969799;">手机号码</span>
                            <span>${mockVerifyInfo.phone}</span>
                        </div>
                        <div class="list-item" style="padding-left: 0; padding-right: 0;">
                            <span style="color: #969799;">楼栋房号</span>
                            <span style="font-weight: 600;">${mockVerifyInfo.building}${mockVerifyInfo.roomNumber}</span>
                        </div>
                        ${status === 'verified' ? `
                        <div class="list-item" style="padding-left: 0; padding-right: 0;">
                            <span style="color: #969799;">认证方式</span>
                            <span>${mockVerifyInfo.verifyMethod}</span>
                        </div>
                        <div class="list-item" style="padding-left: 0; padding-right: 0;">
                            <span style="color: #969799;">认证时间</span>
                            <span>${mockVerifyInfo.verifyTime}</span>
                        </div>
                        ` : ''}
                    </div>
                    ` : ''}

                    <!-- 重新认证按钮 -->
                    <button class="btn btn-primary" onclick="navigate('/owner/verify')">${isVerified ? '🔄 重新认证' : '📝 去认证'}</button>

                    <!-- 认证说明 -->
                    <div class="card" style="background: #f7f8fa; border: none;">
                        <h3 class="card-title">认证说明</h3>
                        <div style="font-size: 13px; color: #646566; line-height: 1.8;">
                            <p>• 业主认证需要验证您的房产信息或业主身份</p>
                            <p>• 支持房产证认证、物业证明、邻居担保三种方式</p>
                            <p>• 认证审核通常在24小时内完成</p>
                            <p>• 认证通过后可使用表决、发帖等全部功能</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // 账号安全页面
    accountSecurity() {
        const mockUserInfo = {
            nickname: UserStore.data.nickname || '微信用户9527',
            phone: '138****1234',
            hasPassword: true
        };

        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <a href="javascript:history.back()" class="back-btn">‹</a>
                        <h1>账号安全</h1>
                        <span></span>
                    </div>
                </div>

                <div class="content">
                    <!-- 账号信息 -->
                    <div class="card">
                        <h3 class="card-title">账号信息</h3>
                        <div class="list-item" style="padding-left: 0; padding-right: 0; cursor: pointer;" onclick="showEditNicknameModal()">
                            <div class="list-item-content">
                                <div class="list-item-title">昵称</div>
                                <div class="list-item-desc">${mockUserInfo.nickname}</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                        <div class="list-item" style="padding-left: 0; padding-right: 0;">
                            <div class="list-item-content">
                                <div class="list-item-title">绑定手机</div>
                                <div class="list-item-desc">${mockUserInfo.phone}</div>
                            </div>
                            <span class="tag tag-success" style="font-size: 11px;">已绑定</span>
                        </div>
                    </div>

                    <!-- 安全设置 -->
                    <div class="card">
                        <h3 class="card-title">安全设置</h3>
                        <div class="list-item" style="padding-left: 0; padding-right: 0; cursor: pointer;" onclick="showChangePasswordModal()">
                            <div class="list-item-content">
                                <div class="list-item-title">🔒 修改密码</div>
                                <div class="list-item-desc">${mockUserInfo.hasPassword ? '已设置登录密码' : '未设置登录密码'}</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                        <div class="list-item" style="padding-left: 0; padding-right: 0; cursor: pointer;" onclick="showChangePhoneModal()">
                            <div class="list-item-content">
                                <div class="list-item-title">📱 更换手机号</div>
                                <div class="list-item-desc">更换账号绑定的手机号码</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                        <div class="list-item" style="padding-left: 0; padding-right: 0; cursor: pointer;" onclick="showBindWechatModal()">
                            <div class="list-item-content">
                                <div class="list-item-title">💬 微信绑定</div>
                                <div class="list-item-desc">已绑定微信，可用于快速登录</div>
                            </div>
                            <span class="tag tag-success" style="font-size: 11px;">已绑定</span>
                        </div>
                    </div>

                    <!-- 账号操作 -->
                    <div class="card">
                        <h3 class="card-title">账号操作</h3>
                        <div class="list-item" style="padding-left: 0; padding-right: 0; cursor: pointer;" onclick="showClearCacheModal()">
                            <div class="list-item-content">
                                <div class="list-item-title">🗑️ 清理缓存</div>
                                <div class="list-item-desc">清理本地缓存数据</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                        <div class="list-item" style="padding-left: 0; padding-right: 0; cursor: pointer;" onclick="showLogoutModal()">
                            <div class="list-item-content">
                                <div class="list-item-title" style="color: #ee0a24;">🚪 退出登录</div>
                                <div class="list-item-desc">退出当前账号</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                        <div class="list-item" style="padding-left: 0; padding-right: 0; cursor: pointer;" onclick="showDeleteAccountModal()">
                            <div class="list-item-content">
                                <div class="list-item-title" style="color: #ee0a24;">⚠️ 注销账号</div>
                                <div class="list-item-desc">永久删除账号及所有数据</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                    </div>

                    <!-- 安全提示 -->
                    <div style="text-align: center; padding: 16px; color: #969799; font-size: 12px;">
                        账号安全等级：<span style="color: #07c160;">高</span>
                    </div>
                </div>
            </div>

            <!-- 修改昵称弹窗 -->
            <div id="editNicknameModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
                <div style="background: #fff; border-radius: 12px; padding: 24px; width: 80%; max-width: 320px;">
                    <h3 style="text-align: center; margin-bottom: 16px;">修改昵称</h3>
                    <input type="text" id="newNickname" class="input" placeholder="请输入新昵称" value="${mockUserInfo.nickname}" maxlength="20" style="margin-bottom: 16px;">
                    <div style="display: flex; gap: 12px;">
                        <button class="btn btn-default" style="flex: 1;" onclick="closeEditNicknameModal()">取消</button>
                        <button class="btn btn-primary" style="flex: 1;" onclick="saveNickname()">保存</button>
                    </div>
                </div>
            </div>

            <!-- 修改密码弹窗 -->
            <div id="changePasswordModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
                <div style="background: #fff; border-radius: 12px; padding: 24px; width: 80%; max-width: 320px;">
                    <h3 style="text-align: center; margin-bottom: 16px;">修改密码</h3>
                    <input type="password" id="oldPassword" class="input" placeholder="请输入原密码" style="margin-bottom: 12px;">
                    <input type="password" id="newPassword" class="input" placeholder="请输入新密码" style="margin-bottom: 12px;">
                    <input type="password" id="confirmPassword" class="input" placeholder="请确认新密码" style="margin-bottom: 16px;">
                    <div style="display: flex; gap: 12px;">
                        <button class="btn btn-default" style="flex: 1;" onclick="closeChangePasswordModal()">取消</button>
                        <button class="btn btn-primary" style="flex: 1;" onclick="savePassword()">保存</button>
                    </div>
                </div>
            </div>
        `;
    },

    // 关于我们页面
    aboutUs() {
        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <a href="javascript:history.back()" class="back-btn">‹</a>
                        <h1>关于我们</h1>
                        <span></span>
                    </div>
                </div>

                <div class="content">
                    <!-- Logo和版本 -->
                    <div class="card" style="text-align: center; padding: 40px 24px;">
                        <div style="width: 80px; height: 80px; border-radius: 20px; background: linear-gradient(135deg, #1989fa 0%, #39b9fa 100%); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 48px; box-shadow: 0 4px 16px rgba(25,137,250,0.3);">🏠</div>
                        <div style="font-size: 22px; font-weight: 600; margin-bottom: 8px;">业主自治宝</div>
                        <div style="font-size: 14px; color: #969799;">版本 v2.0.0</div>
                        <div style="margin-top: 8px;">
                            <span class="tag tag-primary" style="font-size: 11px;">最新版本</span>
                        </div>
                    </div>

                    <!-- 联系方式 -->
                    <div class="card">
                        <h3 class="card-title">📞 联系我们</h3>
                        <div class="list-item" style="padding-left: 0; padding-right: 0; cursor: pointer;" onclick="showToast('客服电话：400-888-9999')">
                            <div class="list-item-content">
                                <div class="list-item-title">客服热线</div>
                                <div class="list-item-desc">400-888-9999</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                        <div class="list-item" style="padding-left: 0; padding-right: 0; cursor: pointer;" onclick="showToast('客服邮箱：support@yezhuzhibao.com')">
                            <div class="list-item-content">
                                <div class="list-item-title">客服邮箱</div>
                                <div class="list-item-desc">support@yezhuzhibao.com</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                        <div class="list-item" style="padding-left: 0; padding-right: 0; cursor: pointer;" onclick="showToast('工作时间：周一至周五 9:00-18:00')">
                            <div class="list-item-content">
                                <div class="list-item-title">工作时间</div>
                                <div class="list-item-desc">周一至周五 9:00-18:00</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                    </div>

                    <!-- 法律协议 -->
                    <div class="card">
                        <h3 class="card-title">📋 法律协议</h3>
                        <div class="list-item" style="padding-left: 0; padding-right: 0; cursor: pointer;" onclick="navigate('/agreement/user')">
                            <div class="list-item-content">
                                <div class="list-item-title">用户协议</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                        <div class="list-item" style="padding-left: 0; padding-right: 0; cursor: pointer;" onclick="navigate('/agreement/privacy')">
                            <div class="list-item-content">
                                <div class="list-item-title">隐私政策</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                        <div class="list-item" style="padding-left: 0; padding-right: 0; cursor: pointer;" onclick="navigate('/agreement/community')">
                            <div class="list-item-content">
                                <div class="list-item-title">社区规范</div>
                            </div>
                            <div class="list-item-arrow">›</div>
                        </div>
                    </div>

                    <!-- 开源声明 -->
                    <div class="card">
                        <h3 class="card-title">🌟 开源声明</h3>
                        <div style="font-size: 13px; color: #646566; line-height: 1.8;">
                            <p>业主自治宝前端部分代码已开源，欢迎社区贡献。</p>
                            <p style="margin-top: 8px;">开源协议：MIT License</p>
                            <p>GitHub：<a href="#" style="color: #1989fa;" onclick="showToast('GitHub链接：github.com/owner-self-governance/app')">github.com/owner-self-governance/app</a></p>
                        </div>
                    </div>

                    <!-- 版权信息 -->
                    <div style="text-align: center; padding: 24px; color: #969799; font-size: 12px;">
                        <p>© 2025 业主自治宝 版权所有</p>
                        <p style="margin-top: 4px;">由 社区自治技术团队 开发和维护</p>
                    </div>
                </div>
            </div>
        `;
    },

    // 用户协议页面
    userAgreement() {
        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <a href="javascript:history.back()" class="back-btn">‹</a>
                        <h1>用户协议</h1>
                        <span></span>
                    </div>
                </div>

                <div class="content">
                    <div class="card">
                        <h3 class="card-title">一、总则</h3>
                        <div style="font-size: 14px; line-height: 1.8; color: #323233;">
                            <p>1.1 本协议是您与业主自治宝之间关于使用本平台服务的协议。</p>
                            <p>1.2 您在使用本平台服务前，应当仔细阅读本协议，并同意遵守本协议所有条款。</p>
                            <p>1.3 如您不同意本协议，请停止使用本平台服务。</p>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">二、账号注册与安全</h3>
                        <div style="font-size: 14px; line-height: 1.8; color: #323233;">
                            <p>2.1 您应当提供真实、准确、完整的个人资料。</p>
                            <p>2.2 您应当妥善保管账号密码，对账号下的一切行为负责。</p>
                            <p>2.3 如发现账号被盗或异常，请立即联系我们。</p>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">三、服务内容与规范</h3>
                        <div style="font-size: 14px; line-height: 1.8; color: #323233;">
                            <p>3.1 本平台提供业主认证、表决投票、法律查询等服务。</p>
                            <p>3.2 您承诺不发布违法、违规、虚假、侵权内容。</p>
                            <p>3.3 您承诺不进行恶意刷票、作弊等行为。</p>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">四、隐私保护</h3>
                        <div style="font-size: 14px; line-height: 1.8; color: #323233;">
                            <p>4.1 我们重视您的隐私保护，详见《隐私政策》。</p>
                            <p>4.2 未经您同意，我们不会向第三方披露您的个人信息。</p>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">五、免责声明</h3>
                        <div style="font-size: 14px; line-height: 1.8; color: #323233;">
                            <p>5.1 本平台提供的法律信息仅供参考，不构成法律建议。</p>
                            <p>5.2 表决结果仅供参考，实际法律效力以法定程序为准。</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // 隐私政策页面
    privacyPolicy() {
        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <a href="javascript:history.back()" class="back-btn">‹</a>
                        <h1>隐私政策</h1>
                        <span></span>
                    </div>
                </div>

                <div class="content">
                    <div class="card">
                        <h3 class="card-title">一、信息收集</h3>
                        <div style="font-size: 14px; line-height: 1.8; color: #323233;">
                            <p>1.1 我们收集的信息包括：</p>
                            <p>• 基本信息：昵称、手机号、头像</p>
                            <p>• 认证信息：真实姓名、房号、身份证（脱敏）</p>
                            <p>• 设备信息：设备型号、操作系统版本</p>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">二、信息使用</h3>
                        <div style="font-size: 14px; line-height: 1.8; color: #323233;">
                            <p>2.1 我们使用您的信息用于：</p>
                            <p>• 身份验证和业主认证</p>
                            <p>• 提供表决投票服务</p>
                            <p>• 向您推送相关通知</p>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">三、信息共享</h3>
                        <div style="font-size: 14px; line-height: 1.8; color: #323233;">
                            <p>3.1 我们不会将您的个人信息出售给第三方。</p>
                            <p>3.2 仅在以下情况下可能共享信息：</p>
                            <p>• 经您明确同意</p>
                            <p>• 应法律法规要求</p>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">四、信息安全</h3>
                        <div style="font-size: 14px; line-height: 1.8; color: #323233;">
                            <p>4.1 我们采用加密技术保护您的数据安全。</p>
                            <p>4.2 您的密码经过加密存储，我们不会以明文保存。</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // 社区规范页面
    communityRules() {
        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <a href="javascript:history.back()" class="back-btn">‹</a>
                        <h1>社区规范</h1>
                        <span></span>
                    </div>
                </div>

                <div class="content">
                    <div class="card">
                        <h3 class="card-title">一、总则</h3>
                        <div style="font-size: 14px; line-height: 1.8; color: #323233;">
                            <p>为维护良好的社区环境，特制定本规范。所有用户在使用本平台时，均应遵守本规范。</p>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">二、禁止行为</h3>
                        <div style="font-size: 14px; line-height: 1.8; color: #323233;">
                            <p>2.1 禁止发布违法违规内容</p>
                            <p>2.2 禁止发布虚假信息、造谣传谣</p>
                            <p>2.3 禁止人身攻击、侮辱谩骂</p>
                            <p>2.4 禁止恶意刷票、作弊行为</p>
                            <p>2.5 禁止发布广告、垃圾信息</p>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">三、内容规范</h3>
                        <div style="font-size: 14px; line-height: 1.8; color: #323233;">
                            <p>3.1 发帖应当真实、客观、有价值</p>
                            <p>3.2 鼓励分享维权经验、法律知识</p>
                            <p>3.3 理性讨论，尊重不同观点</p>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">四、违规处理</h3>
                        <div style="font-size: 14px; line-height: 1.8; color: #323233;">
                            <p>4.1 违规内容将被删除</p>
                            <p>4.2 多次违规将被限制发帖</p>
                            <p>4.3 严重违规将被永久封号</p>
                        </div>
                    </div>
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
                                <div class="list-item" style="padding-left: 0; padding-right: 0; cursor: pointer;" onclick="navigate('/scenario/detail/${scenario.id}')">
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
        currentPostId = id; // 保存当前帖子ID
        const post = MockData.posts.find(p => p.id === id);
        if (!post) {
            return `<div class="page active"><div class="content"><div class="card">帖子不存在</div></div></div>`;
        }

        // 检查帖子是否已点赞
        const isPostLiked = InteractionStore.isPostLiked(id);

        // 获取类型标签
        const typeLabels = { discussion: '讨论', notice: '通知', knowledge: '知识', complaint: '投诉' };
        const typeLabel = typeLabels[post.type] || '讨论';

        // 渲染评论
        function renderComment(comment, isReply = false) {
            const isCommentLiked = InteractionStore.isCommentLiked(comment.id);
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
                                <span onclick="toggleCommentLike(${comment.id})" style="cursor: pointer; ${isCommentLiked ? 'color: #ee0a24;' : ''}">👍 ${comment.likeCount + (isCommentLiked ? 1 : 0)}</span>
                                ${!isReply ? `<span onclick="replyToComment(${comment.id}, '${comment.authorName}')" style="cursor: pointer;">💬 回复</span>` : ''}
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
                            <div style="text-align: center; ${isPostLiked ? 'color: #ee0a24;' : 'color: #969799;'} font-size: 13px; cursor: pointer;" onclick="togglePostLike(${post.id})">
                                <div style="font-size: 20px; margin-bottom: 4px;">👍</div>
                                ${post.likeCount + (isPostLiked ? 1 : 0)}
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
                    <button class="btn btn-primary" style="width: auto; padding: 10px 20px;" onclick="submitComment()">发送</button>
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

        // 检查用户是否已投票
        const votedOption = InteractionStore.getVoteOption(id);
        const hasVoted = !!votedOption;

        const supportPercent = Math.round(vote.support / vote.participated * 100) || 0;
        const opposePercent = Math.round(vote.oppose / vote.participated * 100) || 0;
        const abstainPercent = Math.round(vote.abstain / vote.participated * 100) || 0;
        const participationRate = Math.round(vote.participated / 280 * 100);
        const daysLeft = Math.ceil((new Date(vote.endTime) - new Date()) / (1000 * 60 * 60 * 24));

        // 投票选项显示文本
        const optionLabels = {
            'support': '支持',
            'oppose': '反对',
            'abstain': '弃权'
        };
        const optionColors = {
            'support': '#07c160',
            'oppose': '#ee0a24',
            'abstain': '#ff976a'
        };

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
                                ${hasVoted ? `
                                    <div style="margin-bottom: 16px;">
                                        <div style="font-size: 14px; color: #969799; margin-bottom: 8px;">您已投票</div>
                                        <div style="font-size: 24px; font-weight: 600; color: ${optionColors[votedOption]};">
                                            ${optionLabels[votedOption]}
                                        </div>
                                    </div>
                                    <button class="btn btn-default" style="width: 100%;" onclick="showVoteOptions(${vote.id})">修改投票</button>
                                ` : `
                                    <div style="font-size: 14px; color: #969799; margin-bottom: 16px;">剩余 ${daysLeft > 0 ? daysLeft : 0} 天</div>
                                    <div id="voteOptions">
                                        <div style="display: flex; gap: 12px;">
                                            <button class="btn btn-primary" style="flex: 1; background: #07c160;" onclick="submitVoteOption(${vote.id}, 'support')">支持</button>
                                            <button class="btn btn-default" style="flex: 1;" onclick="submitVoteOption(${vote.id}, 'oppose')">反对</button>
                                            <button class="btn btn-default" style="flex: 1;" onclick="submitVoteOption(${vote.id}, 'abstain')">弃权</button>
                                        </div>
                                    </div>
                                `}
                            </div>
                        </div>
                    ` : `
                        <div class="card">
                            <div style="text-align: center; padding: 16px; color: #969799;">
                                ${hasVoted ? `您已投：${optionLabels[votedOption]}` : '该表决已结束'}
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
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;" id="imagePreviewContainer">
                            <label style="aspect-ratio: 1; border: 2px dashed #ddd; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #969799; cursor: pointer;">
                                <div style="font-size: 24px; margin-bottom: 4px;">📷</div>
                                <div style="font-size: 12px;">添加</div>
                                <input type="file" accept="image/*" multiple style="display: none;" onchange="handleImageUpload(this)">
                            </label>
                        </div>
                        <div style="font-size: 12px; color: #969799; margin-top: 8px;">点击添加图片，支持预览和删除</div>
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
                                        <button class="btn btn-primary" style="width: auto; padding: 8px 16px; font-size: 13px;" onclick="callOwner('${c.phone}')">呼叫</button>
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
    },

    // TASK-004: 维权场景详情页面
    scenarioDetail(hash) {
        const id = parseInt(hash.split('/').pop());
        const scenario = MockData.scenarios.find(s => s.id === id);
        if (!scenario) {
            return `<div class="page active"><div class="content"><div class="card">场景不存在</div></div></div>`;
        }

        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <a href="javascript:history.back()" class="back-btn">‹</a>
                        <h1>维权场景</h1>
                        <span></span>
                    </div>
                </div>

                <div class="content">
                    <!-- 场景标题和描述 -->
                    <div class="card">
                        <div style="font-size: 48px; margin-bottom: 16px;">⚖️</div>
                        <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 12px;">${scenario.title}</h2>
                        <div style="font-size: 14px; color: #646566; line-height: 1.6; margin-bottom: 16px;">
                            ${scenario.description}
                        </div>
                        <div style="background: #e3f2fd; border-radius: 8px; padding: 12px; font-size: 13px; color: #1989fa; line-height: 1.6;">
                            <strong>💡 法律依据：</strong>${scenario.solution}
                        </div>
                    </div>

                    <!-- 解决步骤 -->
                    <div class="card">
                        <h3 class="card-title">解决步骤</h3>
                        <div style="position: relative; padding-left: 24px;">
                            ${scenario.steps.map((step, index) => `
                                <div style="position: relative; padding-bottom: 20px; ${index === scenario.steps.length - 1 ? '' : 'border-left: 2px solid #ebedf0;'} margin-left: 11px;">
                                    <div style="position: absolute; left: -24px; top: 0; width: 24px; height: 24px; background: ${index === 0 ? '#07c160' : index === scenario.steps.length - 1 ? '#ff976a' : '#1989fa'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-weight: 600;">
                                        ${index + 1}
                                    </div>
                                    <div style="margin-left: 16px;">
                                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                            <span style="font-size: 20px;">${step.icon}</span>
                                            <span style="font-weight: 600; font-size: 15px;">${step.title}</span>
                                        </div>
                                        <div style="font-size: 13px; color: #969799;">${step.desc}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- 相关材料 -->
                    <div class="card">
                        <h3 class="card-title">相关材料</h3>
                        ${scenario.materials.map(m => `
                            <div class="list-item" onclick="showToast('下载${m.name}')" style="padding-left: 0; padding-right: 0; cursor: pointer;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span style="font-size: 24px;">${m.icon}</span>
                                    <div>
                                        <div style="font-weight: 600; font-size: 14px;">${m.name}</div>
                                        <div style="font-size: 12px; color: #969799;">
                                            ${m.type === 'template' ? '文档模板' : m.type === 'law' ? '法律条文' : '参考文档'}
                                        </div>
                                    </div>
                                </div>
                                <div style="color: #1989fa; font-size: 13px;">下载 ›</div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- 相关法律 -->
                    <div class="card">
                        <h3 class="card-title">相关法律条文</h3>
                        ${scenario.relatedLaws.map(lid => {
                            const law = MockData.laws.find(l => l.id === lid);
                            return law ? `
                                <div class="list-item" onclick="navigate('/law/detail/${law.id}')" style="padding-left: 0; padding-right: 0; cursor: pointer;">
                                    <div class="list-item-content">
                                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                            <span class="tag tag-primary">${law.category}</span>
                                            <span class="text-small text-gray">${law.article}</span>
                                        </div>
                                        <div class="list-item-desc" style="-webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden;">${law.content.substring(0, 60)}...</div>
                                    </div>
                                    <div class="list-item-arrow">›</div>
                                </div>
                            ` : '';
                        }).join('')}
                    </div>

                    <!-- 操作按钮 -->
                    <div style="display: flex; gap: 12px; margin-top: 24px;">
                        <button class="btn btn-default" style="flex: 1;" onclick="navigate('/law')">返回法律库</button>
                        <button class="btn btn-primary" style="flex: 1;" onclick="navigate('/vote/create')">发起表决</button>
                    </div>
                </div>
            </div>
        `;
    },

    // TASK-005: 消息通知页面
    notifications() {
        const unreadCount = MockData.notifications.filter(n => !n.isRead).length;

        const typeLabels = {
            'system': '系统通知',
            'vote': '表决提醒',
            'interaction': '互动消息'
        };

        const typeColors = {
            'system': '#1989fa',
            'vote': '#07c160',
            'interaction': '#ff976a'
        };

        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <a href="javascript:history.back()" class="back-btn">‹</a>
                        <h1>消息通知 ${unreadCount > 0 ? `<span style="font-size: 14px; color: #ee0a24;">(${unreadCount}未读)</span>` : ''}</h1>
                        <span style="font-size: 13px; color: #1989fa; cursor: pointer;" onclick="markAllNotificationsRead()">全部已读</span>
                    </div>
                </div>

                <div class="content">
                    <!-- 消息类型筛选 -->
                    <div class="card" style="padding: 12px;">
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;" id="notificationFilter">
                            <span class="tag tag-primary active" onclick="filterNotifications('all', this)" data-type="all">全部</span>
                            <span class="tag tag-primary" onclick="filterNotifications('system', this)" data-type="system">🔧 系统</span>
                            <span class="tag tag-primary" onclick="filterNotifications('vote', this)" data-type="vote">🗳️ 表决</span>
                            <span class="tag tag-primary" onclick="filterNotifications('interaction', this)" data-type="interaction">💬 互动</span>
                        </div>
                    </div>

                    <!-- 消息列表 -->
                    <div id="notificationList">
                        ${MockData.notifications.map(n => `
                            <div class="card notification-item" data-type="${n.type}" data-id="${n.id}" style="${!n.isRead ? 'border-left: 3px solid #ee0a24;' : ''}">
                                <div style="display: flex; gap: 12px;">
                                    <div style="width: 44px; height: 44px; border-radius: 50%; background: ${typeColors[n.type]}20; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;">
                                        ${n.icon}
                                    </div>
                                    <div style="flex: 1;">
                                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                                            <div style="display: flex; align-items: center; gap: 8px;">
                                                <span style="font-weight: 600; font-size: 15px;">${n.title}</span>
                                                ${!n.isRead ? '<span style="width: 8px; height: 8px; background: #ee0a24; border-radius: 50%;"></span>' : ''}
                                            </div>
                                            <span style="font-size: 12px; color: #969799; white-space: nowrap;">${n.time.split(' ')[0]}</span>
                                        </div>
                                        <div style="font-size: 13px; color: #646566; line-height: 1.5; margin-bottom: 8px;" onclick="${n.link ? `navigate('${n.link}')` : 'showToast(\'暂无详情\')'}">
                                            ${n.content}
                                        </div>
                                        <div style="display: flex; justify-content: space-between; align-items: center;">
                                            <span style="font-size: 12px; color: ${typeColors[n.type]}; background: ${typeColors[n.type]}10; padding: 2px 8px; border-radius: 4px;">${typeLabels[n.type]}</span>
                                            ${!n.isRead ? `<span style="font-size: 12px; color: #1989fa; cursor: pointer;" onclick="markNotificationRead(${n.id})">标记已读</span>` : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- 空状态 -->
                    <div id="notificationEmpty" class="card" style="display: none; text-align: center; padding: 60px 40px;">
                        <div style="font-size: 64px; margin-bottom: 16px;">📭</div>
                        <div style="color: #969799; font-size: 15px;">暂无此类通知</div>
                    </div>
                </div>
            </div>
        `;
    },

    // TASK-006: 搜索功能页面
    search() {
        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <a href="javascript:history.back()" class="back-btn">‹</a>
                        <div style="flex: 1; margin: 0 12px;">
                            <div class="search-box" style="background: transparent; padding: 0;">
                                <input type="text" class="search-input" placeholder="搜索法律、表决、帖子..." id="searchInput" oninput="handleSearch(this.value)" style="background: #f5f5f5;">
                            </div>
                        </div>
                        <span style="font-size: 14px; color: #1989fa; cursor: pointer;" onclick="clearSearch()">取消</span>
                    </div>
                </div>

                <div class="content">
                    <!-- 搜索历史 -->
                    <div id="searchHistory" class="card">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <h3 class="card-title" style="margin: 0;">搜索历史</h3>
                            <span style="font-size: 12px; color: #969799; cursor: pointer;" onclick="clearSearchHistory()">清空</span>
                        </div>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            <span class="tag tag-default" onclick="doSearch('物业费')" style="cursor: pointer;">物业费</span>
                            <span class="tag tag-default" onclick="doSearch('停车位')" style="cursor: pointer;">停车位</span>
                            <span class="tag tag-default" onclick="doSearch('维修资金')" style="cursor: pointer;">维修资金</span>
                            <span class="tag tag-default" onclick="doSearch('垃圾分类')" style="cursor: pointer;">垃圾分类</span>
                        </div>
                    </div>

                    <!-- 热门搜索 -->
                    <div id="hotSearch" class="card">
                        <h3 class="card-title">热门搜索</h3>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            <span class="tag tag-danger" onclick="doSearch('物业收费')" style="cursor: pointer;">🔥 物业收费</span>
                            <span class="tag tag-warning" onclick="doSearch('公共收益')" style="cursor: pointer;">公共收益</span>
                            <span class="tag tag-primary" onclick="doSearch('电梯维修')" style="cursor: pointer;">电梯维修</span>
                            <span class="tag tag-primary" onclick="doSearch('业委会')" style="cursor: pointer;">业委会</span>
                            <span class="tag tag-primary" onclick="doSearch('停车管理')" style="cursor: pointer;">停车管理</span>
                        </div>
                    </div>

                    <!-- 搜索结果 -->
                    <div id="searchResults" style="display: none;">
                        <!-- 法律结果 -->
                        <div class="card">
                            <h3 class="card-title">📚 相关法律</h3>
                            <div id="lawResults"></div>
                        </div>

                        <!-- 表决结果 -->
                        <div class="card">
                            <h3 class="card-title">🗳️ 相关表决</h3>
                            <div id="voteResults"></div>
                        </div>

                        <!-- 帖子结果 -->
                        <div class="card">
                            <h3 class="card-title">💬 相关帖子</h3>
                            <div id="postResults"></div>
                        </div>

                        <!-- 无结果 -->
                        <div id="noResults" class="card" style="display: none; text-align: center; padding: 60px 40px;">
                            <div style="font-size: 64px; margin-bottom: 16px;">🔍</div>
                            <div style="color: #969799; font-size: 15px;">未找到相关内容</div>
                            <div style="color: #969799; font-size: 13px; margin-top: 8px;">换个关键词试试</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // TASK-007: 数据统计页面
    statistics() {
        const community = UserStore.data.currentCommunity || MockData.communities[0];
        const totalVotes = MockData.votes.length;
        const ongoingVotes = MockData.votes.filter(v => v.status === 'ongoing').length;
        const endedVotes = MockData.votes.filter(v => v.status === 'ended').length;
        const totalParticipation = MockData.votes.reduce((sum, v) => sum + v.participated, 0);
        const avgParticipation = Math.round(totalParticipation / totalVotes);

        const totalPosts = MockData.posts.length;
        const totalViews = MockData.posts.reduce((sum, p) => sum + p.viewCount, 0);
        const totalLikes = MockData.posts.reduce((sum, p) => sum + p.likeCount, 0);
        const totalComments = MockData.posts.reduce((sum, p) => sum + p.commentCount, 0);

        return `
            <div class="page active">
                <div class="header">
                    <div class="header-content">
                        <a href="javascript:history.back()" class="back-btn">‹</a>
                        <h1>数据统计</h1>
                        <span></span>
                    </div>
                </div>

                <div class="content">
                    <!-- 小区概览 -->
                    <div class="card">
                        <h3 class="card-title">🏠 小区概览</h3>
                        <div style="text-align: center; padding: 16px 0; border-bottom: 1px solid #ebedf0; margin-bottom: 16px;">
                            <div style="font-size: 22px; font-weight: 600; margin-bottom: 4px;">${community.name}</div>
                            <div style="font-size: 13px; color: #969799;">${community.address}</div>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
                            <div>
                                <div style="font-size: 28px; font-weight: 600; color: #1989fa;">${community.totalBuildings}</div>
                                <div style="font-size: 12px; color: #969799; margin-top: 4px;">楼栋数</div>
                            </div>
                            <div>
                                <div style="font-size: 28px; font-weight: 600; color: #07c160;">${community.totalUnits}</div>
                                <div style="font-size: 12px; color: #969799; margin-top: 4px;">总户数</div>
                            </div>
                            <div>
                                <div style="font-size: 28px; font-weight: 600; color: #ff976a;">${community.verifiedCount}</div>
                                <div style="font-size: 12px; color: #969799; margin-top: 4px;">认证业主</div>
                            </div>
                        </div>
                        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #ebedf0;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="font-size: 13px; color: #646566;">认证率</span>
                                <span style="font-size: 13px; color: #1989fa; font-weight: 600;">${Math.round(community.verifiedCount / community.totalUnits * 100)}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${Math.round(community.verifiedCount / community.totalUnits * 100)}%"></div>
                            </div>
                        </div>
                    </div>

                    <!-- 表决统计 -->
                    <div class="card">
                        <h3 class="card-title">🗳️ 表决统计</h3>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; text-align: center; margin-bottom: 16px;">
                            <div>
                                <div style="font-size: 24px; font-weight: 600; color: #323233;">${totalVotes}</div>
                                <div style="font-size: 11px; color: #969799; margin-top: 4px;">总表决数</div>
                            </div>
                            <div>
                                <div style="font-size: 24px; font-weight: 600; color: #07c160;">${ongoingVotes}</div>
                                <div style="font-size: 11px; color: #969799; margin-top: 4px;">进行中</div>
                            </div>
                            <div>
                                <div style="font-size: 24px; font-weight: 600; color: #969799;">${endedVotes}</div>
                                <div style="font-size: 11px; color: #969799; margin-top: 4px;">已结束</div>
                            </div>
                            <div>
                                <div style="font-size: 24px; font-weight: 600; color: #1989fa;">${avgParticipation}</div>
                                <div style="font-size: 11px; color: #969799; margin-top: 4px;">平均参与</div>
                            </div>
                        </div>
                        <div style="background: #f7f8fa; border-radius: 8px; padding: 12px;">
                            <div style="font-size: 12px; color: #969799; margin-bottom: 8px;">近30天表决趋势</div>
                            <div style="display: flex; align-items: flex-end; justify-content: space-around; height: 60px; gap: 8px;">
                                <div style="flex: 1; background: linear-gradient(to top, #1989fa, #39b9fa); border-radius: 4px 4px 0 0; height: 40%; opacity: 0.8;"></div>
                                <div style="flex: 1; background: linear-gradient(to top, #1989fa, #39b9fa); border-radius: 4px 4px 0 0; height: 60%; opacity: 0.8;"></div>
                                <div style="flex: 1; background: linear-gradient(to top, #1989fa, #39b9fa); border-radius: 4px 4px 0 0; height: 30%; opacity: 0.8;"></div>
                                <div style="flex: 1; background: linear-gradient(to top, #07c160, #07c160); border-radius: 4px 4px 0 0; height: 80%; opacity: 0.8;"></div>
                                <div style="flex: 1; background: linear-gradient(to top, #1989fa, #39b9fa); border-radius: 4px 4px 0 0; height: 50%; opacity: 0.8;"></div>
                                <div style="flex: 1; background: linear-gradient(to top, #1989fa, #39b9fa); border-radius: 4px 4px 0 0; height: 70%; opacity: 0.8;"></div>
                                <div style="flex: 1; background: linear-gradient(to top, #1989fa, #39b9fa); border-radius: 4px 4px 0 0; height: 45%; opacity: 0.8;"></div>
                            </div>
                            <div style="display: flex; justify-content: space-around; margin-top: 8px; font-size: 11px; color: #969799;">
                                <span>2/1</span><span>2/5</span><span>2/10</span><span>2/15</span><span>2/20</span><span>2/25</span><span>3/1</span>
                            </div>
                        </div>
                    </div>

                    <!-- 论坛活跃度 -->
                    <div class="card">
                        <h3 class="card-title">💬 论坛活跃度</h3>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; text-align: center;">
                            <div>
                                <div style="font-size: 24px; font-weight: 600; color: #323233;">${totalPosts}</div>
                                <div style="font-size: 11px; color: #969799; margin-top: 4px;">帖子总数</div>
                            </div>
                            <div>
                                <div style="font-size: 24px; font-weight: 600; color: #1989fa;">${totalViews}</div>
                                <div style="font-size: 11px; color: #969799; margin-top: 4px;">总浏览</div>
                            </div>
                            <div>
                                <div style="font-size: 24px; font-weight: 600; color: #ff976a;">${totalLikes}</div>
                                <div style="font-size: 11px; color: #969799; margin-top: 4px;">总点赞</div>
                            </div>
                            <div>
                                <div style="font-size: 24px; font-weight: 600; color: #07c160;">${totalComments}</div>
                                <div style="font-size: 11px; color: #969799; margin-top: 4px;">总评论</div>
                            </div>
                        </div>
                    </div>

                    <!-- 热门话题 -->
                    <div class="card">
                        <h3 class="card-title">🔥 热门话题 TOP5</h3>
                        ${MockData.posts.slice(0, 5).map((p, index) => `
                            <div class="list-item" onclick="navigate('/forum/detail/${p.id}')" style="padding-left: 0; padding-right: 0; cursor: pointer;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="width: 24px; height: 24px; background: ${index < 3 ? '#ee0a24' : '#969799'}; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-weight: 600;">
                                        ${index + 1}
                                    </div>
                                    <div style="flex: 1;">
                                        <div style="font-size: 14px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px;">${p.title}</div>
                                        <div style="font-size: 12px; color: #969799;">${p.viewCount}浏览 · ${p.likeCount}赞 · ${p.commentCount}评论</div>
                                    </div>
                                </div>
                                <div class="list-item-arrow">›</div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- 数据更新时间 -->
                    <div style="text-align: center; padding: 16px; color: #969799; font-size: 12px;">
                        数据更新时间：${new Date().toLocaleString('zh-CN')}
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
    
    // 下拉刷新（仅在列表页启用）
    initPullRefresh();
}

// 下拉刷新初始化
function initPullRefresh() {
    const content = document.querySelector('.content');
    if (!content) return;
    
    let startY = 0;
    let currentY = 0;
    let isPulling = false;
    const threshold = 80; // 触发刷新的阈值
    
    content.addEventListener('touchstart', (e) => {
        if (content.scrollTop === 0) {
            startY = e.touches[0].clientY;
            isPulling = true;
        }
    }, { passive: true });
    
    content.addEventListener('touchmove', (e) => {
        if (!isPulling) return;
        currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        
        if (diff > 0 && diff < threshold * 1.5) {
            content.style.transform = `translateY(${diff * 0.5}px)`;
        }
    }, { passive: true });
    
    content.addEventListener('touchend', () => {
        if (!isPulling) return;
        const diff = currentY - startY;
        
        content.style.transform = '';
        content.style.transition = 'transform 0.3s';
        
        if (diff > threshold) {
            showToast('刷新中...');
            setTimeout(() => {
                showToast('刷新成功');
                render();
            }, 1000);
        }
        
        setTimeout(() => {
            content.style.transition = '';
        }, 300);
        
        isPulling = false;
        startY = 0;
        currentY = 0;
    });
}

// 图片上传预览
function handleImageUpload(input) {
    const files = input.files;
    if (!files || files.length === 0) return;
    
    const container = document.getElementById('imagePreviewContainer');
    if (!container) return;
    
    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const imgDiv = document.createElement('div');
            imgDiv.style.cssText = 'position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden;';
            imgDiv.innerHTML = `
                <img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;">
                <button onclick="this.parentElement.remove()" style="position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; background: rgba(0,0,0,0.5); color: #fff; border: none; border-radius: 50%; font-size: 16px; cursor: pointer;">×</button>
            `;
            container.appendChild(imgDiv);
        };
        reader.readAsDataURL(file);
    });
    
    // 清空input以便可以再次选择同一文件
    input.value = '';
}

// 消息通知相关函数
function markNotificationRead(id) {
    const notification = MockData.notifications.find(n => n.id === id);
    if (notification) {
        notification.isRead = true;
        showToast('已标记为已读');
        render();
    }
}

function markAllNotificationsRead() {
    MockData.notifications.forEach(n => n.isRead = true);
    showToast('已全部标记为已读');
    render();
}

function filterNotifications(type, el) {
    // 更新标签状态
    document.querySelectorAll('#notificationFilter .tag').forEach(tag => tag.classList.remove('active'));
    el.classList.add('active');

    // 筛选消息
    const items = document.querySelectorAll('.notification-item');
    const emptyState = document.getElementById('notificationEmpty');
    let hasVisible = false;

    items.forEach(item => {
        const visible = type === 'all' || item.dataset.type === type;
        item.style.display = visible ? 'block' : 'none';
        if (visible) hasVisible = true;
    });

    if (emptyState) {
        emptyState.style.display = hasVisible ? 'none' : 'block';
    }
}

// 搜索相关函数
function handleSearch(keyword) {
    const searchHistory = document.getElementById('searchHistory');
    const hotSearch = document.getElementById('hotSearch');
    const searchResults = document.getElementById('searchResults');

    if (!keyword.trim()) {
        if (searchHistory) searchHistory.style.display = 'block';
        if (hotSearch) hotSearch.style.display = 'block';
        if (searchResults) searchResults.style.display = 'none';
        return;
    }

    if (searchHistory) searchHistory.style.display = 'none';
    if (hotSearch) hotSearch.style.display = 'none';
    if (searchResults) searchResults.style.display = 'block';

    doSearch(keyword);
}

function doSearch(keyword) {
    const lawResults = document.getElementById('lawResults');
    const voteResults = document.getElementById('voteResults');
    const postResults = document.getElementById('postResults');
    const noResults = document.getElementById('noResults');

    keyword = keyword.toLowerCase();

    // 搜索法律
    const matchedLaws = MockData.laws.filter(l =>
        l.title.toLowerCase().includes(keyword) ||
        l.content.toLowerCase().includes(keyword) ||
        l.article.toLowerCase().includes(keyword)
    );

    // 搜索表决
    const matchedVotes = MockData.votes.filter(v =>
        v.title.toLowerCase().includes(keyword) ||
        v.content.toLowerCase().includes(keyword)
    );

    // 搜索帖子
    const matchedPosts = MockData.posts.filter(p =>
        p.title.toLowerCase().includes(keyword) ||
        p.content.toLowerCase().includes(keyword) ||
        p.authorName.toLowerCase().includes(keyword)
    );

    // 渲染法律结果
    if (lawResults) {
        if (matchedLaws.length > 0) {
            lawResults.innerHTML = matchedLaws.map(l => `
                <div class="list-item" onclick="navigate('/law/detail/${l.id}')" style="padding-left: 0; padding-right: 0; cursor: pointer;">
                    <div class="list-item-content">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                            <span class="tag tag-primary">${l.category}</span>
                            <span class="text-small text-gray">${l.article}</span>
                        </div>
                        <div class="list-item-title">${l.title}</div>
                        <div class="list-item-desc" style="-webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden;">${l.content.substring(0, 60)}...</div>
                    </div>
                    <div class="list-item-arrow">›</div>
                </div>
            `).join('');
            lawResults.parentElement.style.display = 'block';
        } else {
            lawResults.parentElement.style.display = 'none';
        }
    }

    // 渲染表决结果
    if (voteResults) {
        if (matchedVotes.length > 0) {
            voteResults.innerHTML = matchedVotes.map(v => `
                <div class="vote-item" onclick="navigate('/vote/detail/${v.id}')" style="cursor: pointer;">
                    <div class="vote-header">
                        <span class="tag ${v.status === 'ongoing' ? 'tag-primary' : 'tag-default'}">${v.status === 'ongoing' ? '进行中' : '已结束'}</span>
                        <span class="text-small text-gray">${v.type}</span>
                    </div>
                    <div class="vote-title">${v.title}</div>
                    <div class="vote-stats">
                        <span>参与 ${v.participated}人</span>
                        <span>支持 ${v.support}票</span>
                    </div>
                </div>
            `).join('');
            voteResults.parentElement.style.display = 'block';
        } else {
            voteResults.parentElement.style.display = 'none';
        }
    }

    // 渲染帖子结果
    if (postResults) {
        if (matchedPosts.length > 0) {
            postResults.innerHTML = matchedPosts.map(p => `
                <div class="post-item" onclick="navigate('/forum/detail/${p.id}')" style="cursor: pointer;">
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
                    </div>
                </div>
            `).join('');
            postResults.parentElement.style.display = 'block';
        } else {
            postResults.parentElement.style.display = 'none';
        }
    }

    // 显示无结果
    const totalResults = matchedLaws.length + matchedVotes.length + matchedPosts.length;
    if (noResults) {
        noResults.style.display = totalResults === 0 ? 'block' : 'none';
    }
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        handleSearch('');
    }
    history.back();
}

function clearSearchHistory() {
    showToast('搜索历史已清空');
}

// 账号安全页面相关函数
function showEditNicknameModal() {
    const modal = document.getElementById('editNicknameModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeEditNicknameModal() {
    const modal = document.getElementById('editNicknameModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function saveNickname() {
    const newNickname = document.getElementById('newNickname')?.value.trim();
    if (!newNickname) {
        showToast('请输入昵称');
        return;
    }
    if (newNickname.length < 2) {
        showToast('昵称至少2个字符');
        return;
    }
    if (newNickname.length > 20) {
        showToast('昵称最多20个字符');
        return;
    }
    UserStore.data.nickname = newNickname;
    showToast('昵称修改成功');
    closeEditNicknameModal();
    setTimeout(() => render(), 300);
}

function showChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function savePassword() {
    const oldPassword = document.getElementById('oldPassword')?.value;
    const newPassword = document.getElementById('newPassword')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;

    if (!oldPassword) {
        showToast('请输入原密码');
        return;
    }
    if (!newPassword) {
        showToast('请输入新密码');
        return;
    }
    if (newPassword.length < 6) {
        showToast('新密码至少6位');
        return;
    }
    if (newPassword !== confirmPassword) {
        showToast('两次输入的密码不一致');
        return;
    }
    showToast('密码修改成功');
    closeChangePasswordModal();
}

function showClearCacheModal() {
    if (confirm('确定要清理缓存吗？')) {
        showToast('缓存已清理');
    }
}

function showLogoutModal() {
    handleLogout();
}

function showDeleteAccountModal() {
    if (confirm('⚠️ 警告：注销账号将永久删除您的所有数据，包括认证信息、发帖记录等，此操作不可恢复。\n\n确定要注销账号吗？')) {
        if (prompt('请输入"确定注销"以确认操作：') === '确定注销') {
            UserStore.logout();
            showToast('账号已注销');
            setTimeout(() => navigate('/'), 500);
        } else {
            showToast('取消注销');
        }
    }
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
window.showLoading = showLoading;
window.hideLoading = hideLoading;
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

// 新添加的全局函数
window.markNotificationRead = markNotificationRead;
window.markAllNotificationsRead = markAllNotificationsRead;
window.filterNotifications = filterNotifications;
window.handleSearch = handleSearch;
window.doSearch = doSearch;
window.clearSearch = clearSearch;
window.clearSearchHistory = clearSearchHistory;
window.handleImageUpload = handleImageUpload;
window.clearSearch = clearSearch;
window.clearSearchHistory = clearSearchHistory;

// 账号安全页面全局函数
window.showEditNicknameModal = showEditNicknameModal;
window.closeEditNicknameModal = closeEditNicknameModal;
window.saveNickname = saveNickname;
window.showChangePasswordModal = showChangePasswordModal;
window.closeChangePasswordModal = closeChangePasswordModal;
window.savePassword = savePassword;
window.showClearCacheModal = showClearCacheModal;
window.showLogoutModal = showLogoutModal;
window.showDeleteAccountModal = showDeleteAccountModal;

// ========== 核心交互功能函数 ==========

/**
 * 提交评论
 */
function submitComment() {
    const input = document.getElementById('commentInput');
    const content = input?.value.trim();
    
    if (!content) {
        showToast('请输入评论内容');
        return;
    }
    
    if (content.length < 2) {
        showToast('评论至少2个字');
        return;
    }
    
    if (!currentPostId) {
        showToast('帖子信息错误');
        return;
    }
    
    // 查找当前帖子
    const post = MockData.posts.find(p => p.id === currentPostId);
    if (!post) {
        showToast('帖子不存在');
        return;
    }
    
    // 创建新评论
    const now = new Date();
    const newComment = {
        id: Date.now(), // 使用时间戳作为唯一ID
        authorName: UserStore.data.nickname || '热心业主',
        content: content,
        createdAt: now.toISOString().split('T')[0] + ' ' + now.toTimeString().slice(0, 5),
        likeCount: 0,
        replies: []
    };
    
    // 添加到帖子的评论数组
    if (!post.comments) {
        post.comments = [];
    }
    post.comments.push(newComment);
    
    // 更新帖子评论数
    post.commentCount = post.comments.length;
    
    // 清空输入框
    input.value = '';
    
    // 显示成功提示
    showToast('评论发表成功');
    
    // 重新渲染页面显示新评论
    render();
}

/**
 * 切换帖子点赞状态
 */
function togglePostLike(postId) {
    const post = MockData.posts.find(p => p.id === postId);
    if (!post) {
        showToast('帖子不存在');
        return;
    }
    
    // 切换点赞状态
    const isLiked = InteractionStore.togglePostLike(postId);
    
    // 显示提示
    showToast(isLiked ? '点赞成功' : '已取消点赞');
    
    // 重新渲染页面
    render();
}

/**
 * 切换评论点赞状态
 */
function toggleCommentLike(commentId) {
    // 切换点赞状态
    const isLiked = InteractionStore.toggleCommentLike(commentId);
    
    // 显示提示
    showToast(isLiked ? '点赞成功' : '已取消点赞');
    
    // 重新渲染页面
    render();
}

/**
 * 提交投票选项
 */
function submitVoteOption(voteId, option) {
    const vote = MockData.votes.find(v => v.id === voteId);
    if (!vote) {
        showToast('表决不存在');
        return;
    }
    
    // 获取之前的投票选项
    const prevOption = InteractionStore.getVoteOption(voteId);
    
    // 如果之前投过票，先减去之前的票数
    if (prevOption) {
        if (prevOption === 'support') vote.support--;
        else if (prevOption === 'oppose') vote.oppose--;
        else if (prevOption === 'abstain') vote.abstain--;
        vote.participated--;
    }
    
    // 添加新的票数
    if (option === 'support') vote.support++;
    else if (option === 'oppose') vote.oppose++;
    else if (option === 'abstain') vote.abstain++;
    vote.participated++;
    
    // 保存投票记录
    InteractionStore.submitVote(voteId, option);
    
    // 显示提示
    const optionLabels = { 'support': '支持', 'oppose': '反对', 'abstain': '弃权' };
    showToast(`投票成功：${optionLabels[option]}`);
    
    // 重新渲染页面
    render();
}

/**
 * 显示投票选项（用于修改投票）
 */
function showVoteOptions(voteId) {
    const voteOptionsDiv = document.getElementById('voteOptions');
    if (!voteOptionsDiv) {
        // 如果不存在投票选项容器，重新渲染页面
        render();
        return;
    }
    
    // 替换为投票选项按钮
    voteOptionsDiv.innerHTML = `
        <div style="display: flex; gap: 12px;">
            <button class="btn btn-primary" style="flex: 1; background: #07c160;" onclick="submitVoteOption(${voteId}, 'support')">支持</button>
            <button class="btn btn-default" style="flex: 1;" onclick="submitVoteOption(${voteId}, 'oppose')">反对</button>
            <button class="btn btn-default" style="flex: 1;" onclick="submitVoteOption(${voteId}, 'abstain')">弃权</button>
        </div>
    `;
}

// 暴露新的全局函数
window.submitComment = submitComment;
window.togglePostLike = togglePostLike;
window.toggleCommentLike = toggleCommentLike;
window.submitVoteOption = submitVoteOption;
window.showVoteOptions = showVoteOptions;

// ========== 账号安全功能 ==========

/**
 * 显示更换手机号弹窗
 */
function showChangePhoneModal() {
    const newPhone = prompt('请输入新手机号：');
    if (!newPhone) return;
    
    if (!/^1[3-9]\d{9}$/.test(newPhone)) {
        showToast('手机号格式不正确');
        return;
    }
    
    // 模拟发送验证码
    showToast('验证码已发送');
    
    setTimeout(() => {
        const code = prompt('请输入验证码：');
        if (code === '123456') { // 模拟验证码
            UserStore.data.phone = newPhone;
            UserStore.save();
            showToast('手机号更换成功');
            render();
        } else {
            showToast('验证码错误');
        }
    }, 1000);
}

/**
 * 显示绑定微信弹窗
 */
function showBindWechatModal() {
    showToast('微信已绑定');
}

// ========== 业主通讯录功能 ==========

/**
 * 呼叫业主
 */
function callOwner(phone) {
    // 显示确认弹窗
    if (confirm(`确定要呼叫 ${phone} 吗？`)) {
        // 尝试拨打电话
        window.location.href = `tel:${phone.replace(/\*/g, '0')}`;
        showToast('正在呼叫...');
    }
}

// 暴露新的全局函数
window.showChangePhoneModal = showChangePhoneModal;
window.showBindWechatModal = showBindWechatModal;
window.callOwner = callOwner;

// ========== 评论回复功能 ==========

/**
 * 回复评论
 */
function replyToComment(commentId, authorName) {
    const content = prompt(`回复 ${authorName}：`);
    if (!content || !content.trim()) return;
    
    if (!currentPostId) {
        showToast('帖子信息错误');
        return;
    }
    
    // 查找当前帖子
    const post = MockData.posts.find(p => p.id === currentPostId);
    if (!post || !post.comments) {
        showToast('帖子不存在');
        return;
    }
    
    // 查找要回复的评论
    const parentComment = post.comments.find(c => c.id === commentId);
    if (!parentComment) {
        showToast('评论不存在');
        return;
    }
    
    // 创建回复
    const now = new Date();
    const reply = {
        id: Date.now(),
        authorName: UserStore.data.nickname || '热心业主',
        content: `@${authorName} ${content.trim()}`,
        createdAt: now.toISOString().split('T')[0] + ' ' + now.toTimeString().slice(0, 5),
        likeCount: 0,
        replies: []
    };
    
    // 添加到回复数组
    if (!parentComment.replies) {
        parentComment.replies = [];
    }
    parentComment.replies.push(reply);
    
    // 显示成功提示
    showToast('回复成功');
    
    // 重新渲染页面
    render();
}

// 暴露新的全局函数
window.replyToComment = replyToComment;
