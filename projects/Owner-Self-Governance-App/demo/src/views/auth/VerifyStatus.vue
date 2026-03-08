<template>
  <div class="verify-status-page">
    <van-nav-bar title="认证状态" left-arrow @click-left="$router.back()" />
    
    <div class="content">
      <div class="status-card">
        <div class="status-icon">✓</div>
        <div class="status-title">认证已通过</div>
        <div class="status-desc">您已成为认证业主，可以使用全部功能</div>
      </div>
      
      <van-cell-group inset title="认证信息">
        <van-cell title="真实姓名" value="张三" />
        <van-cell title="手机号" value="138****1234" />
        <van-cell title="房号" value="1栋301室" />
        <van-cell title="认证时间" value="2026-03-01" />
      </van-cell-group>
      
      <van-button type="primary" round block class="next-btn" @click="$router.push('/payment')">下一步：支付年费</van-button>
    </div>
  </div>
</template>

<script setup>
// 认证状态页面
</script>

<style scoped lang="scss">
.verify-status-page {
  min-height: 100vh;
  background: #f5f5f5;
}
.content {
  padding: 20px;
}
.status-card {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  margin-bottom: 20px;
  
  .status-icon {
    width: 64px;
    height: 64px;
    background: #07c160;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    margin: 0 auto 16px;
  }
  
  .status-title {
    font-size: 20px;
    font-weight: bold;
    color: #323233;
    margin-bottom: 8px;
  }
  
  .status-desc {
    color: #969799;
    font-size: 14px;
  }
}
.next-btn {
  margin-top: 30px;
}
</style>
