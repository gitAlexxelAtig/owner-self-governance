<template>
  <div class="page">
    <van-nav-bar title="缴费记录" left-arrow @click-left="$router.back()" />
    
    <div class="content">
      <van-cell-group inset>
        <van-cell
          v-for="payment in payments"
          :key="payment.id"
          :title="payment.communityName"
          :label="`有效期: ${payment.startDate} 至 ${payment.endDate}`"
          :value="`¥${payment.amount}`"
        >
          <template #right-icon>
            <van-tag type="success">已支付</van-tag>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const payments = ref([
  { id: 1, communityName: '幸福家园小区', amount: 1.00, startDate: '2026-03-01', endDate: '2027-03-01' },
  { id: 2, communityName: '幸福家园小区', amount: 1.00, startDate: '2027-03-01', endDate: '2028-03-01' }
])
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
}
.content {
  padding: 20px;
}
</style>
