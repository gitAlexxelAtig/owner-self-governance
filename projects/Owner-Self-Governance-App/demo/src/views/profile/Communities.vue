<template>
  <div class="page">
    <van-nav-bar title="我的小区" left-arrow @click-left="$router.back()" />
    
    <div class="content">
      <van-cell-group inset>
        <van-cell title="幸福家园小区" label="北京市朝阳区" is-link />
      </van-cell-group>
      
      <van-button type="primary" round block class="btn" @click="$router.push('/community/select')">添加小区</van-button>
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
.btn {
  margin-top: 30px;
}
</style>
