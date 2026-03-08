<template>
  <div class="login-page">
    <van-nav-bar
      title="微信登录"
      left-arrow
      @click-left="$router.back()"
    />

    <div class="login-content">
      <div class="login-header">
        <div class="logo">🏠</div>
        <h2>业主自治宝</h2>
        <p class="subtitle">无业委会也能维权</p>
      </div>

      <div class="login-form">
        <div class="agreement">
          <van-checkbox v-model="agreed">
            我已阅读并同意
            <span class="link" @click.stop="showAgreement">《用户协议》</span>
            和
            <span class="link" @click.stop="showPrivacy">《隐私政策》</span>
          </van-checkbox>
        </div>

        <van-button
          type="primary"
          size="large"
          round
          class="btn-full"
          :loading="loading"
          :disabled="!agreed"
          @click="handleLogin"
        >
          <template #icon>
            <span class="btn-icon">💬</span>
          </template>
          微信一键登录
        </van-button>

        <p class="login-tip">微信授权登录，安全可靠</p>
      </div>

      <div class="features">
        <div class="feature">
          <van-icon name="shield-o" />
          <span>实名认证</span>
        </div>
        <div class="feature">
          <van-icon name="lock" />
          <span>隐私保护</span>
        </div>
        <div class="feature">
          <van-icon name="certificate" />
          <span>合法合规</span>
        </div>
      </div>
    </div>

    <!-- 协议弹窗 -->
    <van-dialog
      v-model:show="showAgreementDialog"
      title="用户协议"
      confirm-button-text="我知道了"
    >
      <div class="dialog-content">
        <p>1. 欢迎使用业主自治宝小程序...</p>
        <p>2. 用户需实名认证后方可使用全部功能...</p>
        <p>3. 用户应遵守相关法律法规...</p>
        <p>4. 平台有权对违规内容进行处理...</p>
      </div>
    </van-dialog>

    <van-dialog
      v-model:show="showPrivacyDialog"
      title="隐私政策"
      confirm-button-text="我知道了"
    >
      <div class="dialog-content">
        <p>1. 我们重视用户隐私保护...</p>
        <p>2. 收集的信息仅用于实名认证...</p>
        <p>3. 用户信息加密存储...</p>
        <p>4. 未经用户同意不会向第三方分享...</p>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { userApi } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const agreed = ref(false)
const loading = ref(false)
const showAgreementDialog = ref(false)
const showPrivacyDialog = ref(false)

const showAgreement = () => {
  showAgreementDialog.value = true
}

const showPrivacy = () => {
  showPrivacyDialog.value = true
}

const handleLogin = async () => {
  if (!agreed.value) {
    showToast('请先同意用户协议和隐私政策')
    return
  }

  loading.value = true

  try {
    // 模拟微信登录
    const res = await userApi.login('mock_code')
    
    if (res.code === 0) {
      userStore.setToken(res.data.token)
      userStore.setUserInfo(res.data.userInfo)
      
      showToast({
        type: 'success',
        message: '登录成功'
      })

      // 检查是否需要选择小区
      if (!userStore.currentCommunity) {
        router.push('/community/select')
      } else {
        router.push('/home')
      }
    }
  } catch (error) {
    showToast('登录失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.login-content {
  padding: 40px 24px;
}

.login-header {
  text-align: center;
  margin-bottom: 48px;
  
  .logo {
    font-size: 80px;
    margin-bottom: 16px;
  }
  
  h2 {
    font-size: 24px;
    color: #323233;
    margin-bottom: 8px;
  }
  
  .subtitle {
    font-size: 14px;
    color: #969799;
  }
}

.login-form {
  margin-bottom: 48px;
  
  .agreement {
    margin-bottom: 24px;
    font-size: 12px;
    
    .link {
      color: #1989fa;
    }
  }
  
  .btn-icon {
    margin-right: 8px;
    font-size: 20px;
  }
  
  .login-tip {
    text-align: center;
    font-size: 12px;
    color: #969799;
    margin-top: 16px;
  }
}

.features {
  display: flex;
  justify-content: space-around;
  padding: 0 24px;
  
  .feature {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #969799;
    font-size: 12px;
    
    .van-icon {
      font-size: 24px;
      color: #1989fa;
    }
  }
}

.dialog-content {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
  
  p {
    margin-bottom: 12px;
    font-size: 14px;
    line-height: 1.6;
    color: #666;
  }
}
</style>
