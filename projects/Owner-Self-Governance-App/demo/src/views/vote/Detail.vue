<template>
  <div class="vote-detail-page">
    <van-nav-bar
      title="表决详情"
      left-arrow
      @click-left="$router.back()"
    />

    <div class="content" v-if="vote">
      <!-- 表决状态 -->
      <div class="status-bar" :class="vote.status">
        <van-icon :name="vote.status === 'ongoing' ? 'clock-o' : 'passed'" />
        <span>{{ vote.status === 'ongoing' ? '进行中' : '已结束' }}</span>
        <span v-if="vote.status === 'ongoing'" class="countdown">
          剩余 {{ remainingDays }}天
        </span>
      </div>

      <!-- 表决内容 -->
      <div class="vote-content-card">
        <h1 class="vote-title">{{ vote.title }}</h1>
        
        <div class="vote-meta">
          <span>发起时间: {{ formatTime(vote.startTime) }}</span>
          <span>截止时间: {{ formatTime(vote.endTime) }}</span>
        </div>
        
        <div class="vote-desc">{{ vote.content }}</div>
      </div>

      <!-- 投票结果 -->
      <div class="result-card">
        <div class="result-title">投票结果</div>
        
        <div class="result-stats">
          <div class="stat-item">
            <div class="number">{{ vote.result.participated }}</div>
            <div class="label">已参与</div>
          </div>
          <div class="stat-item">
            <div class="number support">{{ vote.result.support }}</div>
            <div class="label">支持</div>
          </div>
          <div class="stat-item">
            <div class="number oppose">{{ vote.result.oppose }}</div>
            <div class="label">反对</div>
          </div>
          <div class="stat-item">
            <div class="number">{{ vote.result.abstain }}</div>
            <div class="label">弃权</div>
          </div>
        </div>

        <!-- 进度条 -->
        <div class="progress-list">
          <div class="progress-item">
            <div class="progress-label">支持</div>
            <van-progress
              :percentage="getPercentage(vote.result.support)"
              :stroke-width="12"
              color="#07c160"
            />
            <div class="progress-value">{{ getPercentage(vote.result.support) }}%</div>
          </div>
          
          <div class="progress-item">
            <div class="progress-label">反对</div>
            <van-progress
              :percentage="getPercentage(vote.result.oppose)"
              :stroke-width="12"
              color="#ee0a24"
            />
            <div class="progress-value">{{ getPercentage(vote.result.oppose) }}%</div>
          </div>
          
          <div class="progress-item">
            <div class="progress-label">弃权</div>
            <van-progress
              :percentage="getPercentage(vote.result.abstain)"
              :stroke-width="12"
              color="#969799"
            />
            <div class="progress-value">{{ getPercentage(vote.result.abstain) }}%</div>
          </div>
        </div>

        <!-- 参与率 -->
        <div class="participation-rate">
          <span>参与率: {{ getParticipationRate }}%</span>
          <span class="requirement">(需要{{ vote.minParticipation }}%)</span>
        </div>
      </div>

      <!-- 投票选项 -->
      <div class="vote-options-card" v-if="vote.status === 'ongoing' && !hasVoted">
        <div class="options-title">请选择您的投票</div>
        
        <van-radio-group v-model="selectedOption">
          <van-cell-group inset>
            <van-cell
              v-for="(option, index) in vote.options"
              :key="index"
              clickable
              @click="selectedOption = index + 1"
            >
              <template #title>
                <span class="option-text">{{ option }}</span>
              </template>
              <template #right-icon>
                <van-radio :name="index + 1" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>

        <van-button
          type="primary"
          size="large"
          round
          block
          class="submit-btn"
          :disabled="!selectedOption"
          @click="submitVote"
        >
          确认投票
        </van-button>
      </div>

      <!-- 已投票提示 -->
      <div class="voted-tip" v-else-if="hasVoted">
        <van-icon name="passed" color="#07c160" size="48" />
        <p>您已参与投票</p>
      </div>

      <!-- 查看结果按钮 -->
      <van-button
        v-if="vote.status === 'ended'"
        type="primary"
        size="large"
        round
        block
        plain
        class="result-btn"
        @click="viewResult"
      >
        查看详细结果
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { voteApi } from '@/api'

const route = useRoute()
const router = useRouter()

const vote = ref(null)
const selectedOption = ref(null)
const hasVoted = ref(false)

onMounted(() => {
  loadVoteDetail()
})

const loadVoteDetail = async () => {
  const id = route.params.id
  try {
    const res = await voteApi.getDetail(id)
    if (res.code === 0) {
      vote.value = res.data
    }
  } catch (error) {
    showToast('加载失败')
  }
}

const remainingDays = computed(() => {
  if (!vote.value) return 0
  const end = new Date(vote.value.endTime)
  const now = new Date()
  const diff = end - now
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

const getParticipationRate = computed(() => {
  if (!vote.value) return 0
  const total = vote.value.result.total
  const participated = vote.value.result.participated
  return Math.round((participated / total) * 100)
})

const formatTime = (time) => {
  const date = new Date(time)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const getPercentage = (count) => {
  if (!vote.value) return 0
  const total = vote.value.result.participated
  if (total === 0) return 0
  return Math.round((count / total) * 100)
}

const submitVote = async () => {
  if (!selectedOption.value) {
    showToast('请选择投票选项')
    return
  }

  try {
    const res = await voteApi.submitVote(vote.value.id, selectedOption.value)
    if (res.code === 0) {
      showToast({
        type: 'success',
        message: '投票成功'
      })
      hasVoted.value = true
      loadVoteDetail()
    }
  } catch (error) {
    showToast('投票失败')
  }
}

const viewResult = () => {
  router.push(`/vote/result/${vote.value.id}`)
}
</script>

<style scoped lang="scss">
.vote-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  padding: 12px;
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  
  &.ongoing {
    color: #1989fa;
    background: #e3f2fd;
  }
  
  &.ended {
    color: #969799;
    background: #f5f5f5;
  }
  
  .countdown {
    margin-left: auto;
    font-size: 12px;
  }
}

.vote-content-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  
  .vote-title {
    font-size: 18px;
    font-weight: bold;
    color: #323233;
    margin-bottom: 12px;
    line-height: 1.4;
  }
  
  .vote-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    color: #969799;
    margin-bottom: 12px;
  }
  
  .vote-desc {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
  }
}

.result-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  
  .result-title {
    font-size: 16px;
    font-weight: bold;
    color: #323233;
    margin-bottom: 16px;
  }
  
  .result-stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    
    .stat-item {
      text-align: center;
      
      .number {
        font-size: 24px;
        font-weight: bold;
        color: #323233;
        margin-bottom: 4px;
        
        &.support {
          color: #07c160;
        }
        
        &.oppose {
          color: #ee0a24;
        }
      }
      
      .label {
        font-size: 12px;
        color: #969799;
      }
    }
  }
  
  .progress-list {
    margin-bottom: 16px;
    
    .progress-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      
      .progress-label {
        width: 40px;
        font-size: 13px;
        color: #666;
      }
      
      .van-progress {
        flex: 1;
      }
      
      .progress-value {
        width: 50px;
        font-size: 13px;
        color: #323233;
        text-align: right;
      }
    }
  }
  
  .participation-rate {
    text-align: center;
    font-size: 14px;
    color: #323233;
    
    .requirement {
      color: #969799;
      margin-left: 8px;
    }
  }
}

.vote-options-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  
  .options-title {
    font-size: 16px;
    font-weight: bold;
    color: #323233;
    margin-bottom: 16px;
  }
  
  .option-text {
    font-size: 15px;
    color: #323233;
  }
  
  .submit-btn {
    margin-top: 20px;
  }
}

.voted-tip {
  background: #fff;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  
  p {
    margin-top: 12px;
    font-size: 16px;
    color: #323233;
  }
}

.result-btn {
  margin-top: 12px;
}
</style>
