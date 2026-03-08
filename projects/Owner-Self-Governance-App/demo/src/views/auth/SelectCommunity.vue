<template>
  <div class="select-community-page">
    <van-nav-bar
      title="选择小区"
      left-arrow
      @click-left="$router.back()"
    />

    <div class="search-box">
      <van-search
        v-model="keyword"
        placeholder="请输入小区名称或地址"
        shape="round"
        @search="handleSearch"
      />
    </div>

    <div class="content">
      <!-- 搜索结果 -->
      <div v-if="searchResults.length > 0" class="search-results">
        <div class="section-title">搜索结果</div>
        <div
          v-for="community in searchResults"
          :key="community.id"
          class="community-card"
          @click="selectCommunity(community)"
        >
          <div class="community-name">{{ community.name }}</div>
          <div class="community-address">{{ community.address }}</div>
          <div class="community-stats">
            <span>{{ community.totalBuildings }}栋</span>
            <span>{{ community.totalUnits }}户</span>
            <span class="verified">已认证业主 {{ community.verifiedCount }}人</span>
          </div>
          <div class="community-property">
            物业: {{ community.propertyCompany }}
          </div>
        </div>
      </div>

      <!-- 热门小区 -->
      <div v-else class="hot-communities">
        <div class="section-title">热门小区</div>
        
        <div
          v-for="community in hotCommunities"
          :key="community.id"
          class="community-card"
          @click="selectCommunity(community)"
        >
          <div class="community-name">{{ community.name }}</div>
          <div class="community-address">{{ community.address }}</div>
          <div class="community-stats">
            <span>{{ community.totalBuildings }}栋</span>
            <span>{{ community.totalUnits }}户</span>
            <span class="verified">已认证业主 {{ community.verifiedCount }}人</span>
          </div>
          <div class="community-property">
            物业: {{ community.propertyCompany }}
          </div>
        </div>

        <van-empty
          v-if="hotCommunities.length === 0"
          description="暂无小区数据"
        />
      </div>

      <!-- 找不到小区 -->
      <div class="not-found">
        <van-divider>找不到小区？</van-divider>
        <van-button
          type="primary"
          plain
          round
          block
          @click="createCommunity"
        >
          创建新小区
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { communityApi } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const keyword = ref('')
const searchResults = ref([])
const hotCommunities = ref([])

onMounted(() => {
  loadHotCommunities()
})

const loadHotCommunities = async () => {
  try {
    const res = await communityApi.search('', 1, 5)
    if (res.code === 0) {
      hotCommunities.value = res.data.list
    }
  } catch (error) {
    console.error('加载热门小区失败', error)
  }
}

const handleSearch = async () => {
  if (!keyword.value.trim()) {
    searchResults.value = []
    return
  }

  try {
    const res = await communityApi.search(keyword.value)
    if (res.code === 0) {
      searchResults.value = res.data.list
    }
  } catch (error) {
    showToast('搜索失败')
  }
}

const selectCommunity = (community) => {
  userStore.setCurrentCommunity(community)
  showToast({
    type: 'success',
    message: `已选择 ${community.name}`
  })
  
  // 跳转到认证页面
  router.push('/owner/verify')
}

const createCommunity = () => {
  router.push('/community/create')
}
</script>

<style scoped lang="scss">
.select-community-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.search-box {
  padding: 12px;
  background: #fff;
}

.content {
  padding: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #323233;
  margin-bottom: 12px;
  padding-left: 4px;
}

.community-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  
  .community-name {
    font-size: 16px;
    font-weight: bold;
    color: #323233;
    margin-bottom: 8px;
  }
  
  .community-address {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
    line-height: 1.4;
  }
  
  .community-stats {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: #969799;
    margin-bottom: 4px;
    
    .verified {
      color: #07c160;
    }
  }
  
  .community-property {
    font-size: 12px;
    color: #969799;
  }
}

.not-found {
  margin-top: 32px;
  padding: 0 24px;
}
</style>
