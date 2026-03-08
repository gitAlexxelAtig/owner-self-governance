<template>
  <div class="law-page">
    <van-nav-bar title="法律武器库" />

    <!-- 搜索 -->
    <div class="search-box">
      <van-search
        v-model="keyword"
        placeholder="搜索法律条文、维权场景"
        shape="round"
        @search="handleSearch"
      />
    </div>

    <!-- 维权场景 -->
    <div class="section">
      <div class="section-title">常见维权场景</div>
      
      <van-grid :column-num="3" :gutter="8">
        <van-grid-item
          v-for="scenario in scenarios"
          :key="scenario.id"
          @click="goToScenario(scenario.id)"
        >
          <template #icon>
            <div class="scenario-icon">{{ scenario.icon }}</div>
          </template>
          <template #text>
            <div class="scenario-name">{{ scenario.title }}</div>
          </template>
        </van-grid-item>
      </van-grid>
    </div>

    <!-- 法律分类 -->
    <div class="section">
      <div class="section-title">法律法规</div>
      
      <van-cell-group inset>
        <van-cell
          v-for="category in categories"
          :key="category.id"
          :title="category.name"
          :label="`${category.count}条法规`"
          is-link
          @click="goToCategory(category.id)"
        >
          <template #icon>
            <div class="category-icon">📋</div>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 热门法条 -->
    <div class="section">
      <div class="section-title">热门法条</div>
      
      <div
        v-for="law in hotLaws"
        :key="law.id"
        class="law-item"
        @click="goToLawDetail(law.id)"
      >
        <div class="law-title">{{ law.title }}</div>
        <div class="law-article">{{ law.chapter }} · {{ law.article }}</div>
        <div class="law-preview">{{ law.content.substring(0, 60) }}...</div>
      </div>
    </div>

    <!-- 底部工具 -->
    <div class="section tools-section">
      <div class="section-title">维权工具</div>
      
      <van-grid :column-num="4" :border="false">
        <van-grid-item @click="showToast('功能开发中')">
          <template #icon>
            <div class="tool-icon">📝</div>
          </template>
          <template #text>
            <span class="tool-name">投诉函</span>
          </template>
        </van-grid-item>

        <van-grid-item @click="showToast('功能开发中')">
          <template #icon>
            <div class="tool-icon">📄</div>
          </template>
          <template #text>
            <span class="tool-name">律师函</span>
          </template>
        </van-grid-item>

        <van-grid-item @click="showToast('功能开发中')">
          <template #icon>
            <div class="tool-icon">🏛️</div>
          </template>
          <template #text>
            <span class="tool-name">投诉渠道</span>
          </template>
        </van-grid-item>

        <van-grid-item @click="showToast('功能开发中')">
          <template #icon>
            <div class="tool-icon">🧮</div>
          </template>
          <template #text>
            <span class="tool-name">费用计算</span>
          </template>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { lawApi } from '@/api'
import { mockScenarios, mockLaws } from '@/mock/data'

const router = useRouter()
const keyword = ref('')
const scenarios = ref(mockScenarios.slice(0, 6).map((s, i) => ({
  ...s,
  icon: ['💰', '🏢', '📋', '🚪', '⚖️', '🔧'][i]
})))
const categories = ref([])
const hotLaws = ref(mockLaws.slice(0, 3))

onMounted(() => {
  loadCategories()
})

const loadCategories = async () => {
  try {
    const res = await lawApi.getCategories()
    if (res.code === 0) {
      categories.value = res.data
    }
  } catch (error) {
    console.error('加载分类失败', error)
  }
}

const handleSearch = () => {
  if (!keyword.value) {
    showToast('请输入搜索关键词')
    return
  }
  showToast('搜索: ' + keyword.value)
}

const goToScenario = (id) => {
  router.push(`/law/scenario/${id}`)
}

const goToCategory = (id) => {
  showToast('分类详情开发中')
}

const goToLawDetail = (id) => {
  router.push(`/law/detail/${id}`)
}
</script>

<style scoped lang="scss">
.law-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 40px;
}

.search-box {
  padding: 12px;
  background: #fff;
}

.section {
  margin-bottom: 12px;
  
  .section-title {
    font-size: 15px;
    font-weight: bold;
    color: #323233;
    padding: 12px 16px;
    background: #fff;
  }
}

.scenario-icon {
  width: 48px;
  height: 48px;
  background: #e3f2fd;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 8px;
}

.scenario-name {
  font-size: 12px;
  color: #323233;
  text-align: center;
}

.category-icon {
  width: 36px;
  height: 36px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-right: 8px;
}

.law-item {
  background: #fff;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
  
  .law-title {
    font-size: 15px;
    font-weight: bold;
    color: #323233;
    margin-bottom: 4px;
  }
  
  .law-article {
    font-size: 12px;
    color: #1989fa;
    margin-bottom: 8px;
  }
  
  .law-preview {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
  }
}

.tools-section {
  background: #fff;
  padding-bottom: 16px;
  
  .tool-icon {
    width: 48px;
    height: 48px;
    background: #f5f5f5;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  .tool-name {
    font-size: 12px;
    color: #323233;
  }
}
</style>
