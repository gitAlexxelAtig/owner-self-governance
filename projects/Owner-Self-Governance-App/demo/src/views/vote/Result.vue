<template>
  <div class="page">
    <van-nav-bar title="表决结果" left-arrow @click-left="$router.back()" />
    <div class="content">
      <van-empty description="详细结果统计" />
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
}
.content {
  padding: 20px;
}
</style>
