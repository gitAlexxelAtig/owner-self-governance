<template>
  <div class="page">
    <van-nav-bar title="业主通讯录" left-arrow @click-left="$router.back()" />
    
    <div class="search-box">
      <van-search placeholder="搜索业主姓名或房号" />
    </div>
    
    <div class="content">
      <van-index-bar>
        <van-index-anchor index="1栋">1栋</van-index-anchor>
        <van-cell
          v-for="contact in contacts1"
          :key="contact.id"
          :title="contact.name"
          :label="contact.room"
          :value="contact.phone"
        >
          <template #right-icon>
            <van-icon name="phone-o" color="#07c160" />
          </template>
        </van-cell>
        
        <van-index-anchor index="2栋">2栋</van-index-anchor>
        <van-cell
          v-for="contact in contacts2"
          :key="contact.id"
          :title="contact.name"
          :label="contact.room"
          :value="contact.phone"
        >
          <template #right-icon>
            <van-icon name="phone-o" color="#07c160" />
          </template>
        </van-cell>
      </van-index-bar>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const contacts1 = ref([
  { id: 1, name: '张先生', room: '301室', phone: '138****1234' },
  { id: 2, name: '李女士', room: '302室', phone: '139****5678' }
])

const contacts2 = ref([
  { id: 3, name: '王先生', room: '501室', phone: '137****9012' },
  { id: 4, name: '赵女士', room: '502室', phone: '136****3456' }
])
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
}
.search-box {
  padding: 12px;
  background: #fff;
}
.content {
  padding: 0 12px 12px;
}
</style>
