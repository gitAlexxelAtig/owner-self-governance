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
    '/profile/payments': 'payments'
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
                        <div class="grid-item" onclick="showToast('功能开发中')">
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
    }
};

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
