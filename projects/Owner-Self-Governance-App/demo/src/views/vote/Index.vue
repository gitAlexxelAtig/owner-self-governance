<template>
  <div class="vote-page">
    <van-nav-bar title="集体表决" />

    <!-- 统计卡片 -->
    <div class="stats-card">
      <div class="stats-item">
        <div class="number">{{ ongoingCount }}</div>
        <div class="label">进行中</div>
      </div>
      <div class="stats-item">
        <div class="number">{{ endedCount }}</div>
        <div class="label">已结束</div>
      </div>
      <div class="stats-item">
        <div class="number">{{ totalCount }}</div>
        <div class="label">总表决</div>
      </div>
    </div>

    <!-- 发起按钮 -->
    <div class="action-bar">
      <van-button
        type="primary"
        round
        block
        @click="goToCreate"
      >
        <template #icon>➕</template>
        发起新表决
      </van-button>
    </div>

    <!-- 表决列表 -->
    <van-tabs v-model:active="activeTab" sticky>
      <van-tab title="全部">
        <vote-list :votes="allVotes" @vote="handleVote" />
      </van-tab>
      
      <van-tab title="进行中">
        <vote-list :votes="ongoingVotes" @vote="handleVote" />
      </van-tab>
      
      <van-tab title="已结束">
        <vote-list :votes="endedVotes" @vote="handleVote" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { voteApi } from '@/api'
import VoteList from './components/VoteList.vue'

const router = useRouter()
const activeTab = ref(0)
const allVotes = ref([])

onMounted(() => {
  loadVotes()
})

const loadVotes = async () => {
  try {
    const res = await voteApi.getList()
    if (res.code === 0) {
      allVotes.value = res.data.list
    }
  } catch (error) {
    console.error('加载表决失败', error)
  }
}

const ongoingVotes = computed(() => 
  allVotes.value.filter(v => v.status === 'ongoing')
)

const endedVotes = computed(() => 
  allVotes.value.filter(v => v.status === 'ended')
)

const ongoingCount = computed(() => ongoingVotes.value.length)
const endedCount = computed(() => endedVotes.value.length)
const totalCount = computed(() => allVotes.value.length)

const goToCreate = () => {
  router.push('/vote/create')
}

const handleVote = (vote) => {
  router.push(`/vote/detail/${vote.id}`)
}
</script>

<style scoped lang="scss">
.vote-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 40px;
}

.stats-card {
  display: flex;
  background: #fff;
  padding: 20px;
  margin-bottom: 12px;
  
  .stats-item {
    flex: 1;
    text-align: center;
    
    .number {
      font-size: 24px;
      font-weight: bold;
      color: #1989fa;
      margin-bottom: 4px;
    }
    
    .label {
      font-size: 12px;
      color: #969799;
    }
  }
}

.action-bar {
  padding: 12px 16px;
  background: #fff;
  margin-bottom: 12px;
}
</style>
