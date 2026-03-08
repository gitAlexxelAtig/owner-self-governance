<template>
  <div class="profile-page">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="user-info">
        <img :src="userStore.userAvatar || 'https://picsum.photos/100/100'" class="avatar" />
        <div class="info">
          <div class="name">{{ userStore.userInfo?.nickname || '微信用户' }}</div>
          <div class="phone">{{ userStore.userInfo?.phone || '未绑定手机号' }}</div>
          <div class="tags">
            <van-tag type="success" v-if="userStore.ownerStatus === 'verified'">已认证业主</van-tag>
            <van-tag type="warning" v-else>未认证</van-tag>
          </div>
        </div>
      </div>
      
      <div class="community-info" v-if="userStore.currentCommunity">
        <van-icon name="location-o" />
        <span>{{ userStore.currentCommunity.name }}</span>
        <van-tag type="primary" v-if="userStore.isPaid">有效期至 {{ expireDate }}</van-tag>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="menu-list">
      <van-cell-group inset>
        <van-cell
          title="我的小区"
          is-link
          @click="$router.push('/profile/communities')"
        >
          <template #icon>
            <van-icon name="home-o" class="menu-icon" color="#1989fa" />
          </template>
        </van-cell>

        <van-cell
          title="缴费记录"
          is-link
          @click="$router.push('/profile/payments')"
        >
          <template #icon>
            <van-icon name="bill-o" class="menu-icon" color="#07c160" />
          </template>
        </van-cell>

        <van-cell
          title="业主认证"
          is-link
          @click="$router.push('/owner/status')"
        >
          <template #icon>
            <van-icon name="certificate" class="menu-icon" color="#ff976a" />
          </template>
          <template #value>
            <span :class="getVerifyStatusClass">{{ getVerifyStatusText }}</span>
          </template>
        </van-cell>

        <van-cell
          title="我的投票"
          is-link
          @click="$router.push('/vote')"
        >
          <template #icon>
            <van-icon name="bar-chart-o" class="menu-icon" color="#1989fa" />
          </template>
        </van-cell>

        <van-cell
          title="我的帖子"
          is-link
          @click="$router.push('/forum')"
        >
          <template #icon>
            <van-icon name="comment-o" class="menu-icon" color="#7232dd" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 其他功能 -->
    <div class="menu-list">
      <van-cell-group inset>
        <van-cell
          title="用户协议"
          is-link
          @click="showAgreement"
        >
          <template #icon>
            <van-icon name="description-o" class="menu-icon" color="#969799" />
          </template>
        </van-cell>

        <van-cell
          title="隐私政策"
          is-link
          @click="showPrivacy"
        >
          <template #icon>
            <van-icon name="shield-o" class="menu-icon" color="#969799" />
          </template>
        </van-cell>

        <van-cell
          title="联系客服"
          is-link
          @click="contactService"
        >
          <template #icon>
            <van-icon name="service-o" class="menu-icon" color="#969799" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 退出登录 -->
    <div class="logout-section">
      <van-button
        type="danger"
        plain
        round
        block
        @click="handleLogout"
      >
        退出登录
      </van-button>
    </div>

    <!-- Tabbar -->
    <van-tabbar v-model="activeTab" route>
      <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/law" icon="description-o">法律</van-tabbar-item>
      <van-tabbar-item to="/vote" icon="bar-chart-o">表决</van-tabbar-item>
      <van-tabbar-item to="/forum" icon="comment-o">议事</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showDialog, showToast } from 'vant'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const activeTab = ref(4)
const expireDate = ref('2027-03-01')

const getVerifyStatusText = computed(() => {
  const status = userStore.ownerStatus
  const map = {
    'pending': '审核中',
    'verified': '已认证',
    'rejected': '已拒绝',
    '': '未认证'
  }
  return map[status] || '未认证'
})

const getVerifyStatusClass = computed(() => {
  const status = userStore.ownerStatus
  const map = {
    'pending': 'text-warning',
    'verified': 'text-success',
    'rejected': 'text-danger',
    '': 'text-gray'
  }
  return map[status] || 'text-gray'
})

const showAgreement = () => {
  showDialog({
    title: '用户协议',
    message: '本协议是用户与业主自治宝之间的协议...'
  })
}

const showPrivacy = () => {
  showDialog({
    title: '隐私政策',
    message: '我们重视您的隐私保护...'
  })
}

const contactService = () => {
  showToast('客服电话：400-123-4567')
}

const handleLogout = () => {
  showDialog({
    title: '确认退出',
    message: '确定要退出登录吗？',
    showCancelButton: true
  }).then(() => {
    userStore.logout()
    showToast('已退出登录')
    router.push('/')
  }).catch(() => {})
}
</script>

<style scoped lang="scss">
.profile-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

.user-card {
  background: linear-gradient(135deg, #1989fa 0%, #39b9fa 100%);
  padding: 24px 16px;
  color: #fff;
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    
    .avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid rgba(255, 255, 255, 0.3);
    }
    
    .info {
      .name {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 4px;
      }
      
      .phone {
        font-size: 13px;
        opacity: 0.9;
        margin-bottom: 8px;
      }
      
      .tags {
        display: flex;
        gap: 8px;
      }
    }
  }
  
  .community-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    
    .van-icon {
      font-size: 16px;
    }
  }
}

.menu-list {
  margin-top: 12px;
  
  .menu-icon {
    font-size: 20px;
    margin-right: 8px;
  }
}

.logout-section {
  padding: 24px 16px;
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
</style>
