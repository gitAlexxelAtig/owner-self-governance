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
            steps: [
                { title: '收集证据', desc: '保存物业费调整通知、缴费记录等', icon: '📄' },
                { title: '查询表决记录', desc: '向物业或业委会查询业主大会表决记录', icon: '🔍' },
                { title: '发送整改通知', desc: '以书面形式要求物业恢复原收费标准', icon: '📨' },
                { title: '向主管部门投诉', desc: '向住建局、市场监管局投诉', icon: '🏛️' },
                { title: '法律途径', desc: '必要时提起行政诉讼或民事诉讼', icon: '⚖️' }
            ],
            materials: [
                { name: '物业费调整通知书模板', type: 'template', icon: '📋' },
                { name: '投诉信范本', type: 'template', icon: '📝' },
                { name: '相关法律条文', type: 'law', icon: '⚖️' }
            ],
            relatedLaws: [1, 2]
        },
        {
            id: 2,
            title: '物业侵占公共收益',
            description: '小区广告费、停车费等公共收益未公示、未分配',
            solution: '根据《民法典》第二百八十二条，建设单位、物业服务企业或者其他管理人等利用业主的共有部分产生的收入，在扣除合理成本之后，属于业主共有。',
            steps: [
                { title: '收集证据', desc: '拍照记录小区广告位、停车场等', icon: '📷' },
                { title: '要求公示', desc: '书面要求物业公示公共收益收支明细', icon: '📋' },
                { title: '申请审计', desc: '向业委会或街道申请专项审计', icon: '📊' },
                { title: '协商追讨', desc: '与物业协商追讨应分配收益', icon: '🤝' },
                { title: '法律维权', desc: '必要时起诉要求返还公共收益', icon: '⚖️' }
            ],
            materials: [
                { name: '公共收益查询函模板', type: 'template', icon: '📋' },
                { name: '审计申请书', type: 'template', icon: '📝' },
                { name: '公共收益分配方案', type: 'doc', icon: '📄' }
            ],
            relatedLaws: [1]
        },
        {
            id: 3,
            title: '物业服务质量差',
            description: '物业未按合同约定提供服务，环境卫生、安保等问题严重',
            solution: '根据《民法典》第九百四十二条，物业服务人应当按照约定和物业的使用性质，妥善维修、养护、清洁、绿化和经营管理物业服务区域内的业主共有部分。',
            steps: [
                { title: '记录问题', desc: '拍照、录像记录物业服务问题', icon: '📷' },
                { title: '书面投诉', desc: '向物业提交书面整改要求', icon: '📨' },
                { title: '收集证据', desc: '收集其他业主的投诉和见证', icon: '👥' },
                { title: '发起表决', desc: '发起满意度调查或解聘物业表决', icon: '🗳️' },
                { title: '更换物业', desc: '依法选聘新的物业服务企业', icon: '🏢' }
            ],
            materials: [
                { name: '物业服务问题记录表', type: 'template', icon: '📋' },
                { name: '整改通知书模板', type: 'template', icon: '📝' },
                { name: '满意度调查表', type: 'doc', icon: '📊' }
            ],
            relatedLaws: [1]
        },
        {
            id: 4,
            title: '公共维修资金被挪用',
            description: '物业公司或业委会违规使用、挪用公共维修资金',
            solution: '根据《民法典》第二百八十一条，建筑物及其附属设施的维修资金，属于业主共有。紧急情况下需要维修建筑物及其附属设施的，业主大会或者业主委员会可以依法申请使用建筑物及其附属设施的维修资金。',
            steps: [
                { title: '查询账目', desc: '向维修资金管理部门查询使用情况', icon: '🔍' },
                { title: '核实项目', desc: '实地核实维修项目的真实性', icon: '🏗️' },
                { title: '收集证据', desc: '收集挪用证据和相关文件', icon: '📁' },
                { title: '向主管部门举报', desc: '向住建局、房管局举报', icon: '🏛️' },
                { title: '追究责任', desc: '要求责任人返还资金并承担法律责任', icon: '⚖️' }
            ],
            materials: [
                { name: '维修资金查询申请表', type: 'template', icon: '📋' },
                { name: '举报信范本', type: 'template', icon: '📝' },
                { name: '维修资金使用流程图', type: 'doc', icon: '📊' }
            ],
            relatedLaws: [1]
        },
        {
            id: 5,
            title: '停车位被侵占',
            description: '小区停车位被物业私自出租、出售或改变用途',
            solution: '根据《民法典》第二百七十五条，建筑区划内，规划用于停放汽车的车位、车库的归属，由当事人通过出售、附赠或者出租等方式约定。占用业主共有的道路或者其他场地用于停放汽车的车位，属于业主共有。',
            steps: [
                { title: '确认权属', desc: '核实停车位的规划性质和权属', icon: '📄' },
                { title: '收集证据', desc: '拍照记录违规使用停车位情况', icon: '📷' },
                { title: '书面交涉', desc: '要求物业停止侵权行为', icon: '📨' },
                { title: '发起表决', desc: '就停车位管理发起业主表决', icon: '🗳️' },
                { title: '法律维权', desc: '必要时提起诉讼维护权益', icon: '⚖️' }
            ],
            materials: [
                { name: '停车位权属查询指南', type: 'doc', icon: '📋' },
                { name: '维权通知书模板', type: 'template', icon: '📝' },
                { name: '停车位管理办法范本', type: 'doc', icon: '📄' }
            ],
            relatedLaws: [1]
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
            content: '最近小区垃圾分类执行不到位，建议物业增加分类指导标识，并在早晚高峰安排志愿者引导。\n\n目前主要问题：\n1. 分类标识不清晰\n2. 垃圾桶位置不合理\n3. 居民分类意识不强\n\n建议物业尽快整改！',
            type: 'discussion',
            isUrgent: false,
            isTop: false,
            viewCount: 128,
            likeCount: 45,
            commentCount: 2,
            createdAt: '2026-03-07 14:30',
            images: ['trash1.jpg', 'trash2.jpg'],
            comments: [
                { id: 101, authorName: '环保达人', content: '支持！垃圾分类利国利民', createdAt: '2026-03-07 15:00', likeCount: 8, replies: [] },
                { id: 102, authorName: '物业小王', content: '收到建议，我们会尽快整改', createdAt: '2026-03-07 16:30', likeCount: 12, replies: [
                    { id: 1021, authorName: '热心业主', content: '期待改进！', createdAt: '2026-03-07 17:00', likeCount: 3 }
                ]}
            ]
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
            content: '最近有业主询问物业费涨价的问题，整理了一些相关法律知识供大家参考。\n\n根据《民法典》第九百四十四条，业主应当按照约定向物业服务人支付物业费。物业服务人已经按照约定和有关规定提供服务的，业主不得以未接受或者无需接受相关物业服务为由拒绝支付物业费。\n\n但是，物业费涨价必须经过业主大会同意！如果物业擅自涨价，业主有权拒绝支付超出部分。',
            type: 'knowledge',
            isUrgent: false,
            isTop: false,
            viewCount: 234,
            likeCount: 67,
            commentCount: 3,
            createdAt: '2026-03-06 16:00',
            images: [],
            comments: [
                { id: 1, authorName: '业主A', content: '学习了，谢谢分享！', createdAt: '2026-03-06 16:30', likeCount: 5, replies: [] },
                { id: 2, authorName: '业主B', content: '我们小区也遇到这种情况', createdAt: '2026-03-06 17:00', likeCount: 3, replies: [
                    { id: 21, authorName: '法律小助手', content: '可以发起表决维权', createdAt: '2026-03-06 17:15', likeCount: 2 }
                ]},
                { id: 3, authorName: '业主C', content: '收藏了', createdAt: '2026-03-07 09:00', likeCount: 1, replies: [] }
            ]
        }
    ],

    // 消息通知
    notifications: [
        {
            id: 1,
            type: 'system',
            title: '系统维护通知',
            content: '系统将于今晚22:00-23:00进行例行维护，期间部分功能可能无法使用。',
            time: '2026-03-08 10:00',
            isRead: false,
            icon: '🔧'
        },
        {
            id: 2,
            type: 'vote',
            title: '表决提醒',
            content: '您有一个表决即将截止："关于要求物业整改小区卫生的表决"，请尽快参与投票。',
            time: '2026-03-07 18:30',
            isRead: false,
            icon: '🗳️',
            link: '/vote/detail/1'
        },
        {
            id: 3,
            type: 'interaction',
            title: '帖子被回复',
            content: '环保达人回复了您的帖子"关于小区垃圾分类的建议"',
            time: '2026-03-07 15:05',
            isRead: true,
            icon: '💬',
            link: '/forum/detail/1'
        },
        {
            id: 4,
            type: 'system',
            title: '认证通过',
            content: '恭喜！您的业主认证已通过审核，现在可以参与小区表决了。',
            time: '2026-03-06 09:00',
            isRead: true,
            icon: '✅'
        },
        {
            id: 5,
            type: 'vote',
            title: '新表决发起',
            content: '有新表决发起："关于小区停车位管理方案"，快来参与吧！',
            time: '2026-03-05 14:20',
            isRead: true,
            icon: '📢',
            link: '/vote/detail/3'
        },
        {
            id: 6,
            type: 'interaction',
            title: '评论被点赞',
            content: '您的评论"学习了，谢谢分享！"获得5个赞',
            time: '2026-03-06 16:35',
            isRead: true,
            icon: '👍'
        }
    ],

    // 缴费记录
    payments: [
        { id: 1, orderNo: 'P202403010001', communityName: '幸福家园小区', amount: 1.00, startDate: '2026-03-01', endDate: '2027-03-01', paidAt: '2026-03-01 10:30' }
    ],

    // 业主通讯录
    contacts: [
        { id: 1, name: '张', phone: '138****1234', building: '1', room: '301', verifiedAt: '2026-01-15' },
        { id: 2, name: '李', phone: '139****5678', building: '1', room: '302', verifiedAt: '2026-01-20' },
        { id: 3, name: '王', phone: '137****9012', building: '2', room: '101', verifiedAt: '2026-02-01' },
        { id: 4, name: '刘', phone: '136****3456', building: '2', room: '102', verifiedAt: '2026-02-05' },
        { id: 5, name: '陈', phone: '135****7890', building: '3', room: '201', verifiedAt: '2026-02-10' },
        { id: 6, name: '杨', phone: '134****2345', building: '3', room: '202', verifiedAt: '2026-02-12' },
        { id: 7, name: '赵', phone: '133****6789', building: '1', room: '501', verifiedAt: '2026-02-15' },
        { id: 8, name: '周', phone: '132****0123', building: '2', room: '601', verifiedAt: '2026-02-18' },
        { id: 9, name: '吴', phone: '131****4567', building: '4', room: '401', verifiedAt: '2026-02-20' },
        { id: 10, name: '郑', phone: '130****8901', building: '5', room: '301', verifiedAt: '2026-02-22' }
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
