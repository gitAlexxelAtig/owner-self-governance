<template>
  <div class="page">
    <van-nav-bar title="帖子详情" left-arrow @click-left="$router.back()" />
    <div class="content">
      <van-empty description="帖子详情" />
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
