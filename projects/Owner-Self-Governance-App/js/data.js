/** 模拟数据 */
const MockData = {
    // 当前用户信息
    currentUser: {
        id: 1,
        nickname: '热心业主',
        avatar: '',
        phone: '',
        isLoggedIn: false,
        currentCommunity: null,
        ownerStatus: '', // '', 'pending', 'verified', 'rejected'
        isPaid: false
    },

    // 小区列表
    communities: [
        {
            id: 1,
            name: '幸福家园小区',
            address: '北京市朝阳区幸福路123号',
            city: '北京市',
            district: '朝阳区',
            totalBuildings: 12,
            totalUnits: 480,
            propertyCompany: '幸福物业有限公司',
            verifiedCount: 280
        },
        {
            id: 2,
            name: '阳光花园小区',
            address: '上海市浦东新区阳光大道456号',
            city: '上海市',
            district: '浦东新区',
            totalBuildings: 8,
            totalUnits: 320,
            propertyCompany: '阳光物业管理公司',
            verifiedCount: 180
        },
        {
            id: 3,
            name: '翠湖名邸',
            address: '广州市天河区翠湖路789号',
            city: '广州市',
            district: '天河区',
            totalBuildings: 6,
            totalUnits: 256,
            propertyCompany: '翠湖物业服务有限公司',
            verifiedCount: 150
        }
    ],

    // 法律库
    laws: [
        {
            id: 1,
            category: '民法典',
            title: '中华人民共和国民法典',
            chapter: '第二编 物权',
            article: '第二百七十八条',
            content: '下列事项由业主共同决定：（一）制定和修改业主大会议事规则；（二）制定和修改管理规约；（三）选举业主委员会或者更换业主委员会成员；（四）选聘和解聘物业服务企业或者其他管理人；（五）使用建筑物及其附属设施的维修资金；（六）筹集建筑物及其附属设施的维修资金；（七）改建、重建建筑物及其附属设施；（八）改变共有部分的用途或者利用共有部分从事经营活动；（九）有关共有和共同管理权利的其他重大事项。',
            keywords: '业主共同决定,物业服务,维修资金',
            scenarios: [1, 2, 3]
        },
        {
            id: 2,
            category: '民法典',
            title: '中华人民共和国民法典',
            chapter: '第二编 物权',
            article: '第九百四十四条',
            content: '业主应当按照约定向物业服务人支付物业费。物业服务人已经按照约定和有关规定提供服务的，业主不得以未接受或者无需接受相关物业服务为由拒绝支付物业费。业主违反约定逾期不支付物业费的，物业服务人可以催告其在合理期限内支付；合理期限届满仍不支付的，物业服务人可以提起诉讼或者申请仲裁。',
            keywords: '物业费,业主,支付义务',
            scenarios: [5]
        }
    ],

    // 维权场景
    scenarios: [
        {
            id: 1,
            title: '物业擅自提高物业费',
            description: '未经业主同意，物业公司单方面提高物业费收费标准',
            solution: '根据《民法典》第九百三十九条，物业服务合同对业主具有法律约束力。未经业主大会同意，物业不得擅自提高物业费。',
            steps: ['收集物业费调整通知', '查询业主大会表决记录', '向物业发送整改通知', '向住建局投诉', '必要时提起诉讼']
        },
        {
            id: 2,
            title: '物业侵占公共收益',
            description: '小区广告费、停车费等公共收益未公示、未分配',
            solution: '根据《民法典》第二百八十二条，建设单位、物业服务企业或者其他管理人等利用业主的共有部分产生的收入，在扣除合理成本之后，属于业主共有。',
            steps: ['收集公共收益证据', '要求物业公示收支明细', '向业主委员会/街道反映', '申请审计', '依法追讨']
        }
    ],

    // 表决列表
    votes: [
        {
            id: 1,
            title: '关于要求物业整改小区卫生的表决',
            content: '近期小区卫生状况堪忧，垃圾清理不及时，公共区域脏乱差。要求物业立即整改，加强日常清洁维护工作。',
            type: '普通表决',
            status: 'ongoing',
            startTime: '2026-03-01',
            endTime: '2026-03-15',
            viewCount: 156,
            participated: 145,
            support: 120,
            oppose: 15,
            abstain: 10
        },
        {
            id: 2,
            title: '关于选聘新物业服务企业的意向调查',
            content: '现物业服务合同即将到期，就是否续聘现有物业或选聘新物业进行意向调查。',
            type: '重大事项',
            status: 'ended',
            startTime: '2026-02-01',
            endTime: '2026-02-15',
            viewCount: 320,
            participated: 210,
            support: 80,
            oppose: 120,
            abstain: 10
        },
        {
            id: 3,
            title: '关于小区停车位管理方案',
            content: '针对小区停车位紧张问题，制定新的停车位管理方案。',
            type: '普通表决',
            status: 'ongoing',
            startTime: '2026-03-05',
            endTime: '2026-03-20',
            viewCount: 245,
            participated: 180,
            support: 150,
            oppose: 20,
            abstain: 10
        }
    ],

    // 论坛帖子
    posts: [
        {
            id: 1,
            authorName: '热心业主',
            title: '关于小区垃圾分类的建议',
            content: '最近小区垃圾分类执行不到位，建议物业增加分类指导标识，并在早晚高峰安排志愿者引导。',
            type: 'discussion',
            isUrgent: false,
            isTop: false,
            viewCount: 128,
            likeCount: 45,
            commentCount: 23,
            createdAt: '2026-03-07 14:30'
        },
        {
            id: 2,
            authorName: '物业监督员',
            title: '【紧急】3号楼电梯故障，请大家注意',
            content: '3号楼2单元电梯今日上午发生故障，现已停运。物业已联系维修人员，预计明天修复。',
            type: 'notice',
            isUrgent: true,
            isTop: true,
            viewCount: 456,
            likeCount: 89,
            commentCount: 56,
            createdAt: '2026-03-08 09:15'
        },
        {
            id: 3,
            authorName: '法律小助手',
            title: '物业费涨价必须知道的法律知识',
            content: '最近有业主询问物业费涨价的问题，整理了一些相关法律知识供大家参考。根据《民法典》...',
            type: 'knowledge',
            isUrgent: false,
            isTop: false,
            viewCount: 234,
            likeCount: 67,
            commentCount: 34,
            createdAt: '2026-03-06 16:00'
        }
    ],

    // 缴费记录
    payments: [
        { id: 1, orderNo: 'P202403010001', communityName: '幸福家园小区', amount: 1.00, startDate: '2026-03-01', endDate: '2027-03-01', paidAt: '2026-03-01 10:30' }
    ]
};

// 用户状态管理
const UserStore = {
    data: null,
    
    init() {
        const saved = localStorage.getItem('owner_app_user');
        if (saved) {
            this.data = JSON.parse(saved);
        } else {
            this.data = { ...MockData.currentUser };
        }
    },
    
    save() {
        localStorage.setItem('owner_app_user', JSON.stringify(this.data));
    },
    
    login(userInfo) {
        this.data.isLoggedIn = true;
        this.data.nickname = userInfo.nickname || '微信用户' + Math.floor(Math.random() * 1000);
        this.save();
    },
    
    logout() {
        this.data = { ...MockData.currentUser };
        this.save();
    },
    
    setCommunity(community) {
        this.data.currentCommunity = community;
        this.save();
    },
    
    setOwnerStatus(status) {
        this.data.ownerStatus = status;
        this.save();
    },
    
    setPaid(paid) {
        this.data.isPaid = paid;
        this.save();
    },
    
    isLoggedIn() {
        return this.data.isLoggedIn;
    },
    
    hasCommunity() {
        return this.data.currentCommunity !== null;
    },
    
    isVerified() {
        return this.data.ownerStatus === 'verified';
    },
    
    isPaid() {
        return this.data.isPaid;
    }
};
