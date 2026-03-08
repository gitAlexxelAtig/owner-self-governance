<template>
  <div class="bind-phone-page">
    <van-nav-bar title="绑定手机号" left-arrow @click-left="$router.back()" />
    <div class="content">
      <van-cell-group inset>
        <van-field v-model="phone" label="手机号" placeholder="请输入手机号" type="tel" />
        <van-field v-model="code" label="验证码" placeholder="请输入验证码">
          <template #button>
            <van-button size="small" type="primary" @click="sendCode">发送验证码</van-button>
          </template>
        </van-field>
      </van-cell-group>
      
      <van-button type="primary" round block class="submit-btn" @click="handleBind">绑定</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const phone = ref('')
const code = ref('')

const sendCode = () => {
  showToast('验证码已发送')
}

const handleBind = () => {
  showToast('绑定成功')
  router.push('/community/select')
}
</script>

<style scoped>
.bind-phone-page {
  min-height: 100vh;
  background: #f5f5f5;
}
.content {
  padding: 20px;
}
.submit-btn {
  margin-top: 30px;
}
</style>
