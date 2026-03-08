<template>
  <div class="law-detail-page">
    <van-nav-bar title="法条详情" left-arrow @click-left="$router.back()" />
    
    <div class="content" v-if="law">
      <div class="law-header">
        <div class="law-category">{{ law.category }}</div>
        <h1 class="law-title">{{ law.title }}</h1>
        <div class="law-article">{{ law.chapter }} · {{ law.article }}</div>
      </div>
      
      <div class="law-content">
        <p>{{ law.content }}</p>
      </div>
      
      <div class="law-keywords">
        <span class="label">关键词：</span>
        <van-tag v-for="kw in law.keywords.split(',')" :key="kw" class="keyword">{{ kw }}</van-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { mockLaws } from '@/mock/data'

const route = useRoute()
const law = ref(null)

onMounted(() => {
  const id = parseInt(route.params.id)
  law.value = mockLaws.find(l => l.id === id) || mockLaws[0]
})
</script>

<style scoped lang="scss">
.law-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
}
.content {
  padding: 16px;
}
.law-header {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 12px;
  
  .law-category {
    display: inline-block;
    background: #e3f2fd;
    color: #1989fa;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    margin-bottom: 12px;
  }
  
  .law-title {
    font-size: 18px;
    font-weight: bold;
    color: #323233;
    margin-bottom: 8px;
  }
  
  .law-article {
    font-size: 14px;
    color: #1989fa;
  }
}
.law-content {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 12px;
  
  p {
    font-size: 15px;
    line-height: 1.8;
    color: #323233;
  }
}
.law-keywords {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  
  .label {
    font-size: 14px;
    color: #666;
    margin-right: 8px;
  }
  
  .keyword {
    margin-right: 8px;
  }
}
</style>
