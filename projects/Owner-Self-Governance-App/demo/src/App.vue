<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(() => {
  // 初始化时检查登录状态
  userStore.initUserInfo()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f5f5;
  -webkit-font-smoothing: antialiased;
}

/* 移动端适配基础 */
html {
  font-size: calc(100vw / 3.75);
}

@media (min-width: 414px) {
  html {
    font-size: calc(100vw / 4.14);
  }
}

/* 通用样式 */
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 60px;
}

.page-header {
  background: linear-gradient(135deg, #1989fa 0%, #39b9fa 100%);
  color: #fff;
  padding: 20px 16px;
}

.page-content {
  padding: 12px;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.text-primary {
  color: #1989fa;
}

.text-success {
  color: #07c160;
}

.text-warning {
  color: #ff976a;
}

.text-danger {
  color: #ee0a24;
}

.text-gray {
  color: #969799;
}

.text-center {
  text-align: center;
}

.flex {
  display: flex;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.mb-8 {
  margin-bottom: 8px;
}

.mb-12 {
  margin-bottom: 12px;
}

.mb-16 {
  margin-bottom: 16px;
}

.mt-12 {
  margin-top: 12px;
}

/* 按钮样式 */
.btn-full {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 22px;
}

/* 标签样式 */
.tag-status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.tag-status--success {
  background: #e8f5e9;
  color: #07c160;
}

.tag-status--warning {
  background: #fff3e0;
  color: #ff976a;
}

.tag-status--danger {
  background: #ffebee;
  color: #ee0a24;
}

.tag-status--info {
  background: #e3f2fd;
  color: #1989fa;
}

/* 列表样式 */
.list-item {
  background: #fff;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
}

.list-item:last-child {
  border-bottom: none;
}

/* 空状态 */
.empty-state {
  padding: 40px 20px;
  text-align: center;
}

.empty-state__icon {
  font-size: 64px;
  color: #dcdee0;
  margin-bottom: 16px;
}

.empty-state__text {
  color: #969799;
  font-size: 14px;
}
</style>
