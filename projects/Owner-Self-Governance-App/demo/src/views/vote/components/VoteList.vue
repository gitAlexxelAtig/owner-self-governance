<template>
  <div class="vote-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          v-for="vote in votes"
          :key="vote.id"
          class="vote-card"
          @click="$emit('vote', vote)"
        >
          <div class="vote-header">
            <van-tag :type="vote.status === 'ongoing' ? 'primary' : 'default'">
              {{ vote.status === 'ongoing' ? '进行中' : '已结束' }}
            </van-tag>
            <span class="vote-time">{{ formatTime(vote.endTime) }}截止</span>
          </div>
          
          <div class="vote-title">{{ vote.title }}</div>
          
          <div class="vote-content">{{ vote.content }}</div>
          
          <div class="vote-footer">
            <div class="vote-stats">
              <span>👁 {{ vote.viewCount }}浏览</span>
              <span>🗳️ {{ vote.result.participated }}人参与</span>
            </div>
            
            <div class="vote-progress" v-if="vote.status === 'ongoing'">
              <van-progress
                :percentage="getProgress(vote)"
                :stroke-width="8"
                color="#1989fa"
              />
              <span class="progress-text">{{ getProgress(vote) }}%</span>
            </div>
            
            <div class="vote-result-preview" v-else>
              <span :class="getResultClass(vote)">
                {{ getResultText(vote) }}
              </span>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  votes: {
    type: Array,
    default: () => []
  }
})

defineEmits(['vote'])

const loading = ref(false)
const finished = ref(true)
const refreshing = ref(false)

const onLoad = () => {
  loading.value = false
}

const onRefresh = () => {
  refreshing.value = false
}

const formatTime = (time) => {
  const date = new Date(time)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

const getProgress = (vote) => {
  const total = vote.result.total
  const participated = vote.result.participated
  return Math.round((participated / total) * 100)
}

const getResultText = (vote) => {
  const support = vote.result.support
  const oppose = vote.result.oppose
  const total = vote.result.participated
  
  if (total === 0) return '无结果'
  
  const supportRate = (support / total) * 100
  
  if (vote.type === 2) {
    // 重大事项需要2/3
    return supportRate >= 66 ? '已通过' : '未通过'
  }
  
  return support > oppose ? '已通过' : '未通过'
}

const getResultClass = (vote) => {
  const text = getResultText(vote)
  return text === '已通过' ? 'success' : 'danger'
}
</script>

<style scoped lang="scss">
.vote-list {
  padding: 12px;
}

.vote-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  
  .vote-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .vote-time {
      font-size: 12px;
      color: #969799;
    }
  }
  
  .vote-title {
    font-size: 16px;
    font-weight: bold;
    color: #323233;
    margin-bottom: 8px;
    line-height: 1.4;
  }
  
  .vote-content {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .vote-footer {
    .vote-stats {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: #969799;
      margin-bottom: 8px;
    }
    
    .vote-progress {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .van-progress {
        flex: 1;
      }
      
      .progress-text {
        font-size: 12px;
        color: #1989fa;
        min-width: 40px;
        text-align: right;
      }
    }
    
    .vote-result-preview {
      .success {
        color: #07c160;
        font-size: 14px;
        font-weight: bold;
      }
      
      .danger {
        color: #ee0a24;
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
}
</style>
