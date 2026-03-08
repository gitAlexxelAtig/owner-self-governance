<template>
  <div class="post-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          v-for="post in posts"
          :key="post.id"
          class="post-card"
          @click="goToDetail(post.id)"
        >
          <!-- 置顶和紧急标识 -->
          <div class="post-badges">
            <van-tag v-if="post.isTop" type="danger">置顶</van-tag>
            <van-tag v-if="post.isUrgent" type="warning">紧急</van-tag>
            <van-tag :type="getTypeColor(post.type)">{{ getTypeText(post.type) }}</van-tag>
          </div>
          
          <div class="post-title">{{ post.title }}</div>
          
          <div class="post-content">{{ post.content }}</div>
          
          <div class="post-images" v-if="post.images && post.images.length">
            <img
              v-for="(img, index) in post.images.slice(0, 3)"
              :key="index"
              :src="img"
              class="post-image"
            />
          </div>
          
          <div class="post-footer">
            <div class="post-author">
              <img :src="post.authorAvatar || 'https://picsum.photos/100/100'" class="author-avatar" />
              <span class="author-name">{{ post.authorName }}</span>
            </div>
            
            <div class="post-stats">
              <span>👁 {{ post.viewCount }}</span>
              <span>👍 {{ post.likeCount }}</span>
              <span>💬 {{ post.commentCount }}</span>
            </div>
          </div>
          
          <div class="post-time">{{ formatTime(post.createdAt) }}</div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  posts: {
    type: Array,
    default: () => []
  }
})

const router = useRouter()
const loading = ref(false)
const finished = ref(true)
const refreshing = ref(false)

const onLoad = () => {
  loading.value = false
}

const onRefresh = () => {
  refreshing.value = false
}

const goToDetail = (id) => {
  router.push(`/forum/detail/${id}`)
}

const getTypeColor = (type) => {
  const map = {
    discussion: 'primary',
    notice: 'danger',
    help: 'warning',
    knowledge: 'success'
  }
  return map[type] || 'default'
}

const getTypeText = (type) => {
  const map = {
    discussion: '讨论',
    notice: '通知',
    help: '求助',
    knowledge: '知识'
  }
  return map[type] || '其他'
}

const formatTime = (time) => {
  const date = new Date(time)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  
  return `${date.getMonth() + 1}月${date.getDate()}日`
}
</script>

<style scoped lang="scss">
.post-list {
  padding: 12px;
}

.post-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  
  .post-badges {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }
  
  .post-title {
    font-size: 16px;
    font-weight: bold;
    color: #323233;
    margin-bottom: 8px;
    line-height: 1.4;
  }
  
  .post-content {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .post-images {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    
    .post-image {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 4px;
    }
  }
  
  .post-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    
    .post-author {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .author-avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        object-fit: cover;
      }
      
      .author-name {
        font-size: 13px;
        color: #666;
      }
    }
    
    .post-stats {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: #969799;
    }
  }
  
  .post-time {
    font-size: 12px;
    color: #969799;
  }
}
</style>
