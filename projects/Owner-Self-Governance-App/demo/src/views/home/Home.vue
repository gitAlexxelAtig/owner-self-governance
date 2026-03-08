<template>
  <div class="home-page">
    <!-- 顶部信息 -->
    <div class="header">
      <div class="community-info">
        <div class="name">{{ userStore.currentCommunity?.name || '幸福家园小区' }}</div>
        <div class="stats">
          <span>认证业主 {{ verifiedCount }}人</span>
          <span class="divider">|</span>
          <span>有效期至 {{ expireDate }}</span>
        </div>
      </div>
      <div class="user-avatar" @click="$router.push('/profile')">
        <img :src="userStore.userAvatar || 'https://picsum.photos/100/100'" />
      </div>
    </div>

    <!-- 功能入口 -->
    <div class="content">
      <van-grid :column-num="2" :gutter="12" class="feature-grid">
        <van-grid-item @click="$router.push('/law')">
          <template #icon>
            <div class="feature-icon law">📚</div>
          </template>
          <template #text>
            <div class="feature-text">
              <div class="title">法律武器库</div>
              <div class="desc">维权法规一键查</div>
            </div>
          </template>
        </van-grid-item>

        <van-grid-item @click="$router.push('/vote')">
          <template #icon>
            <div class="feature-icon vote">🗳️</div>
          </template>
          <template #text>
            <div class="feature-text">
              <div class="title">集体表决</div>
              <div class="desc">一户一票做决定</div>
            </div>
          </template>
        </van-grid-item>

        <van-grid-item @click="$router.push('/forum')">
          <template #icon>
            <div class="feature-icon forum">💬</div>
          </template>
          <template #text>
            <div class="feature-text">
              <div class="title">议事圈</div>
              <div class="desc">业主交流讨论</div>
            </div>
          </template>
        </van-grid-item>

        <van-grid-item @click="$router.push('/contact')">
          <template #icon>
            <div class="feature-icon contact">👥</div>
          </template>
          <template #text>
            <div class="feature-text">
              <div class="title">业主通讯录</div>
              <div class="desc">快速联络邻居</div>
            </div>
          </template>
        </van-grid-item>
      </van-grid>

      <!-- 最新表决 -->
      <div class="section">
        <div class="section-header">
          <span class="title">最新表决</span>
          <span class="more" @click="$router.push('/vote')">更多 →</span>
        </div>
        
        <div
          v-for="vote in latestVotes"
          :key="vote.id"
          class="vote-item"
          @click="$router.push(`/vote/detail/${vote.id}`)"
        >
          <div class="vote-status" :class="vote.status">
            {{ vote.status === 'ongoing' ? '进行中' : '已结束' }}
          </div>
          <div class="vote-title">{{ vote.title }}</div>
          <div class="vote-stats">
            <span>参与 {{ vote.result.participated }}人</span>
            <span>支持 {{ vote.result.support }}票</span>
            <span>剩余 {{ getRemainingDays(vote.endTime) }}天</span>
          </div>
        </div>
      </div>

      <!-- 热门帖子 -->
      <div class="section">
        <div class="section-header">
          <span class="title">热门讨论</span>
          <span class="more" @click="$router.push('/forum')">更多 →</span>
        </div>
        
        <div
          v-for="post in hotPosts"
          :key="post.id"
          class="post-item"
          @click="$router.push(`/forum/detail/${post.id}`)"
        >
          <div class="post-type" :class="post.type">
            {{ getPostTypeText(post.type) }}
          </div>
          <div class="post-title">{{ post.title }}</div>
          <div class="post-meta">
            <span>{{ post.authorName }}</span>
            <span>{{ post.viewCount }}浏览</span>
            <span>{{ post.commentCount }}回复</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { voteApi, forumApi } from '@/api'

const userStore = useUserStore()
const verifiedCount = ref(280)
const expireDate = ref('2027-03-01')
const latestVotes = ref([])
const hotPosts = ref([])

onMounted(() => {
  loadLatestVotes()
  loadHotPosts()
})

const loadLatestVotes = async () => {
  try {
    const res = await voteApi.getList('', 1, 3)
    if (res.code === 0) {
      latestVotes.value = res.data.list
    }
  } catch (error) {
    console.error('加载表决失败', error)
  }
}

const loadHotPosts = async () => {
  try {
    const res = await forumApi.getPosts('', 1, 3)
    if (res.code === 0) {
      hotPosts.value = res.data.list
    }
  } catch (error) {
    console.error('加载帖子失败', error)
  }
}

const getRemainingDays = (endTime) => {
  const end = new Date(endTime)
  const now = new Date()
  const diff = end - now
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const getPostTypeText = (type) => {
  const map = {
    discussion: '讨论',
    notice: '通知',
    help: '求助',
    knowledge: '知识'
  }
  return map[type] || '讨论'
}
</script>

<style scoped lang="scss">
.home-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

.header {
  background: linear-gradient(135deg, #1989fa 0%, #39b9fa 100%);
  padding: 20px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  
  .community-info {
    .name {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    
    .stats {
      font-size: 12px;
      opacity: 0.9;
      
      .divider {
        margin: 0 8px;
      }
    }
  }
  
  .user-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid rgba(255, 255, 255, 0.5);
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.content {
  padding: 12px;
}

.feature-grid {
  margin-bottom: 16px;
  
  .feature-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin-bottom: 8px;
    
    &.law {
      background: #e3f2fd;
    }
    
    &.vote {
      background: #e8f5e9;
    }
    
    &.forum {
      background: #fff3e0;
    }
    
    &.contact {
      background: #f3e5f5;
    }
  }
  
  .feature-text {
    .title {
      font-size: 15px;
      font-weight: bold;
      color: #323233;
      margin-bottom: 4px;
    }
    
    .desc {
      font-size: 12px;
      color: #969799;
    }
  }
}

.section {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #323233;
    }
    
    .more {
      font-size: 13px;
      color: #1989fa;
    }
  }
}

.vote-item {
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
  
  .vote-status {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    margin-bottom: 8px;
    
    &.ongoing {
      background: #e3f2fd;
      color: #1989fa;
    }
    
    &.ended {
      background: #f5f5f5;
      color: #969799;
    }
  }
  
  .vote-title {
    font-size: 14px;
    color: #323233;
    margin-bottom: 8px;
    line-height: 1.4;
  }
  
  .vote-stats {
    font-size: 12px;
    color: #969799;
    
    span {
      margin-right: 16px;
    }
  }
}

.post-item {
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
  
  .post-type {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    margin-bottom: 8px;
    
    &.notice {
      background: #ffebee;
      color: #ee0a24;
    }
    
    &.knowledge {
      background: #e8f5e9;
      color: #07c160;
    }
    
    &.help {
      background: #fff3e0;
      color: #ff976a;
    }
    
    &.discussion {
      background: #e3f2fd;
      color: #1989fa;
    }
  }
  
  .post-title {
    font-size: 14px;
    color: #323233;
    margin-bottom: 8px;
    line-height: 1.4;
  }
  
  .post-meta {
    font-size: 12px;
    color: #969799;
    
    span {
      margin-right: 16px;
    }
  }
}
</style>
