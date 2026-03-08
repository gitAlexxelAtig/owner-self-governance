<template>
  <div class="forum-page">
    <van-nav-bar title="议事圈" />

    <!-- 分类标签 -->
    <div class="tabs-wrapper">
      <van-tabs v-model:active="activeTab" sticky>
        <van-tab title="全部">
          <post-list :posts="filteredPosts" />
        </van-tab>
        <van-tab title="讨论">
          <post-list :posts="filteredPosts" />
        </van-tab>
        <van-tab title="通知">
          <post-list :posts="filteredPosts" />
        </van-tab>
        <van-tab title="求助">
          <post-list :posts="filteredPosts" />
        </van-tab>
      </van-tabs>
    </div>

    <!-- 发布按钮 -->
    <van-button
      class="fab-btn"
      round
      type="primary"
      @click="goToCreate"
    >
      <van-icon name="plus" size="24" />
    </van-button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { forumApi } from '@/api'
import PostList from './components/PostList.vue'

const router = useRouter()
const activeTab = ref(0)
const allPosts = ref([])

onMounted(() => {
  loadPosts()
})

const loadPosts = async () => {
  try {
    const res = await forumApi.getPosts()
    if (res.code === 0) {
      allPosts.value = res.data.list
    }
  } catch (error) {
    console.error('加载帖子失败', error)
  }
}

const filteredPosts = computed(() => {
  const types = ['', 'discussion', 'notice', 'help']
  const type = types[activeTab.value]
  if (!type) return allPosts.value
  return allPosts.value.filter(p => p.type === type)
})

const goToCreate = () => {
  router.push('/forum/create')
}
</script>

<style scoped lang="scss">
.forum-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

.tabs-wrapper {
  :deep(.van-tabs__wrap) {
    background: #fff;
  }
}

.fab-btn {
  position: fixed;
  right: 20px;
  bottom: 80px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(25, 137, 250, 0.4);
}
</style>
