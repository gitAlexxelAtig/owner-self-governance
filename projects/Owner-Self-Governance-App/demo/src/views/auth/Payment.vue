<template>
  <div class="payment-page">
    <van-nav-bar title="支付年费" left-arrow @click-left="$router.back()" />
    
    <div class="content">
      <div class="price-card">
        <div class="price">1<span class="unit">元/年</span></div>
        <div class="desc">{{ userStore.currentCommunity?.name || '幸福家园小区' }}</div>
      </div>
      
      <van-cell-group inset title="支付方式">
        <van-cell title="微信支付" icon="wechat-pay">
          <template #right-icon>
            <van-radio checked />
          </template>
        </van-cell>
      </van-cell-group>
      
      <van-button type="primary" round block class="pay-btn" @click="handlePay">确认支付</van-button>
      
      <div class="agreement">
        <van-checkbox v-model="agreed">同意 <span class="link">《服务协议》</span></van-checkbox>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const agreed = ref(true)

const handlePay = () => {
  if (!agreed.value) {
    showToast('请同意服务协议')
    return
  }
  
  showDialog({
    title: '确认支付',
    message: '支付1元年费',
    showCancelButton: true
  }).then(() => {
    userStore.setIsPaid(true)
    showToast({ type: 'success', message: '支付成功' })
    router.push('/home')
  }).catch(() => {})
}
</script>

<style scoped lang="scss">
.payment-page {
  min-height: 100vh;
  background: #f5f5f5;
}
.content {
  padding: 20px;
}
.price-card {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: #fff;
  padding: 40px;
  text-align: center;
  border-radius: 12px;
  margin-bottom: 20px;
  
  .price {
    font-size: 48px;
    font-weight: bold;
    
    .unit {
      font-size: 16px;
    }
  }
  
  .desc {
    margin-top: 8px;
    opacity: 0.9;
  }
}
.pay-btn {
  margin-top: 30px;
}
.agreement {
  margin-top: 20px;
  text-align: center;
  
  .link {
    color: #1989fa;
  }
}
</style>
