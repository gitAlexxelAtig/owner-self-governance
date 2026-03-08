import { 
  mockCommunities, 
  mockLaws, 
  mockScenarios, 
  mockVotes, 
  mockPosts, 
  mockContacts,
  mockPayments 
} from '@/mock/data'

// 模拟延迟
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟请求
const mockRequest = async (data, error = null) => {
  await delay()
  if (error) throw new Error(error)
  return { code: 0, data, message: 'success' }
}

// 用户相关API
export const userApi = {
  // 微信登录
  login: async (code) => {
    return mockRequest({
      token: 'mock_token_' + Date.now(),
      userInfo: {
        id: 1,
        nickname: '微信用户' + Math.floor(Math.random() * 1000),
        avatar: 'https://picsum.photos/100/100',
        phone: null
      }
    })
  },

  // 获取用户信息
  getUserInfo: async () => {
    return mockRequest({
      id: 1,
      nickname: '热心业主',
      avatar: 'https://picsum.photos/100/100',
      phone: '13800138000'
    })
  },

  // 绑定手机号
  bindPhone: async (phone, code) => {
    return mockRequest({ phone })
  },

  // 更新用户信息
  updateUserInfo: async (data) => {
    return mockRequest(data)
  }
}

// 小区相关API
export const communityApi = {
  // 搜索小区
  search: async (keyword = '', page = 1, size = 20) => {
    const list = mockCommunities.filter(c => 
      c.name.includes(keyword) || c.address.includes(keyword)
    )
    return mockRequest({
      list,
      total: list.length,
      page,
      size
    })
  },

  // 获取小区详情
  getDetail: async (id) => {
    const community = mockCommunities.find(c => c.id === id)
    return mockRequest(community)
  },

  // 创建小区
  create: async (data) => {
    return mockRequest({ id: Date.now(), ...data })
  },

  // 加入小区
  join: async (id) => {
    return mockRequest({ success: true })
  }
}

// 业主认证API
export const ownerApi = {
  // 提交认证
  submitVerify: async (data) => {
    return mockRequest({ 
      id: Date.now(), 
      status: 'pending',
      ...data 
    })
  },

  // 获取认证状态
  getStatus: async () => {
    return mockRequest({
      status: 'verified', // pending, verified, rejected
      realName: '张三',
      building: '1栋',
      roomNumber: '301',
      verifiedAt: '2026-03-01 10:00:00'
    })
  }
}

// 支付相关API
export const paymentApi = {
  // 创建订单
  createOrder: async (communityId) => {
    return mockRequest({
      orderNo: 'P' + Date.now(),
      amount: 1.00,
      communityName: '幸福家园小区',
      payParams: {
        appId: 'wx_mock',
        timeStamp: String(Date.now()),
        nonceStr: 'mock_nonce',
        package: 'prepay_id=mock',
        signType: 'RSA',
        paySign: 'mock_sign'
      }
    })
  },

  // 查询订单
  getOrder: async (orderNo) => {
    return mockRequest({
      orderNo,
      status: 'paid', // unpaid, paid
      amount: 1.00
    })
  },

  // 获取缴费记录
  getHistory: async () => {
    return mockRequest(mockPayments)
  }
}

// 法律库API
export const lawApi = {
  // 获取分类
  getCategories: async () => {
    return mockRequest([
      { id: 1, name: '民法典', count: 156 },
      { id: 2, name: '物业管理条例', count: 68 },
      { id: 3, name: '地方法规', count: 234 },
      { id: 4, name: '司法解释', count: 45 }
    ])
  },

  // 搜索法律
  search: async (keyword, page = 1, size = 20) => {
    const list = mockLaws.filter(l => 
      l.title.includes(keyword) || 
      l.content.includes(keyword) ||
      l.keywords.includes(keyword)
    )
    return mockRequest({ list, total: list.length })
  },

  // 获取法律详情
  getDetail: async (id) => {
    const law = mockLaws.find(l => l.id === id)
    return mockRequest(law)
  },

  // 获取维权场景
  getScenarios: async () => {
    return mockRequest(mockScenarios)
  },

  // 获取场景详情
  getScenarioDetail: async (id) => {
    const scenario = mockScenarios.find(s => s.id === id)
    // 关联法律
    const relatedLaws = mockLaws.filter(l => 
      scenario.relatedLaws.includes(l.id)
    )
    return mockRequest({ ...scenario, laws: relatedLaws })
  }
}

// 表决相关API
export const voteApi = {
  // 获取表决列表
  getList: async (status = '', page = 1, size = 20) => {
    let list = mockVotes
    if (status) {
      list = list.filter(v => v.status === status)
    }
    return mockRequest({ 
      list: list.slice((page - 1) * size, page * size),
      total: list.length 
    })
  },

  // 获取表决详情
  getDetail: async (id) => {
    const vote = mockVotes.find(v => v.id === id)
    return mockRequest(vote)
  },

  // 创建表决
  create: async (data) => {
    return mockRequest({
      id: Date.now(),
      ...data,
      status: 'ongoing',
      viewCount: 0,
      result: { total: 0, participated: 0, support: 0, oppose: 0, abstain: 0 }
    })
  },

  // 参与投票
  submitVote: async (voteId, choice) => {
    return mockRequest({ success: true })
  },

  // 获取投票结果
  getResult: async (id) => {
    const vote = mockVotes.find(v => v.id === id)
    return mockRequest(vote.result)
  }
}

// 论坛相关API
export const forumApi = {
  // 获取帖子列表
  getPosts: async (type = '', page = 1, size = 20) => {
    let list = mockPosts
    if (type) {
      list = list.filter(p => p.type === type)
    }
    return mockRequest({
      list: list.slice((page - 1) * size, page * size),
      total: list.length
    })
  },

  // 获取帖子详情
  getDetail: async (id) => {
    const post = mockPosts.find(p => p.id === id)
    return mockRequest(post)
  },

  // 发布帖子
  create: async (data) => {
    return mockRequest({
      id: Date.now(),
      ...data,
      authorName: '我',
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      createdAt: new Date().toISOString()
    })
  },

  // 点赞
  like: async (id) => {
    return mockRequest({ success: true })
  },

  // 获取评论
  getComments: async (postId) => {
    return mockRequest([
      {
        id: 1,
        authorName: '热心邻居',
        content: '支持！这个问题确实需要解决。',
        createdAt: '2026-03-07 15:00:00'
      },
      {
        id: 2,
        authorName: '物业代表',
        content: '我们会尽快处理，请业主放心。',
        createdAt: '2026-03-07 16:00:00'
      }
    ])
  }
}

// 通讯录API
export const contactApi = {
  // 获取通讯录
  getList: async (building = '') => {
    let list = mockContacts
    if (building) {
      list = list.filter(c => c.building === building)
    }
    return mockRequest(list)
  },

  // 搜索业主
  search: async (keyword) => {
    const list = mockContacts.filter(c => 
      c.name.includes(keyword) || 
      c.room.includes(keyword)
    )
    return mockRequest(list)
  }
}
