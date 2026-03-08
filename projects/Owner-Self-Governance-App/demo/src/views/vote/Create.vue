<template>
  <div class="page">
    <van-nav-bar title="发起表决" left-arrow @click-left="$router.back()" />
    <div class="content">
      <van-cell-group inset>
        <van-field v-model="title" label="标题" placeholder="请输入表决标题" />
        <van-field v-model="content" label="内容" placeholder="请输入详细内容" type="textarea" rows="4" />
      </van-cell-group>
      
      <van-button type="primary" round block class="btn" @click="handleSubmit">提交</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const title = ref('')
const content = ref('')

const handleSubmit = () => {
  showToast('创建成功')
  router.push('/vote')
}
</script>

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
