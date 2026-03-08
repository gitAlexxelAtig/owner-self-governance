<template>
  <div class="landing-page">
    <!-- 顶部Banner -->
    <div class="banner">
      <div class="banner-content">
        <div class="logo">🏠</div>
        <h1 class="title">业主自治宝</h1>
        <p class="slogan">无业委会也能维权，1元自治守好家园</p>
        <div class="features">
          <div class="feature-item">
            <span class="icon">📚</span>
            <span>法律武器</span>
          </div>
          <div class="feature-item">
            <span class="icon">🗳️</span>
            <span>集体表决</span>
          </div>
          <div class="feature-item">
            <span class="icon">💬</span>
            <span>业主联络</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="content">
      <!-- 搜索小区 -->
      <div class="search-section">
        <van-search
          v-model="searchKeyword"
          placeholder="请输入小区名称"
          shape="round"
          @search="onSearch"
        />
        <div class="quick-tags">
          <span class="tag">附近小区</span>
          <span class="tag">热门小区</span>
          <span class="tag">最近浏览</span>
        </div>
      </div>

      <!-- 功能入口 -->
      <div class="card">
        <h3 class="section-title">核心功能</h3>
        <van-grid :column-num="2" :gutter="10">
          <van-grid-item @click="showToast('请先登录')">
            <template #icon>
              <div class="grid-icon blue">📚</div>
            </template>
            <template #text>
              <div class="grid-text">
                <div class="title">法律武器库</div>
                <div class="desc">维权法规一键查</div>
              </div>
            </template>
          </van-grid-item>
          
          <van-grid-item @click="showToast('请先登录')">
            <template #icon>
              <div class="grid-icon green">🗳️</div>
            </template>
            <template #text>
              <div class="grid-text">
                <div class="title">集体表决</div>
                <div class="desc">一户一票做决定</div>
              </div>
            </template>
          </van-grid-item>
          
          <van-grid-item @click="showToast('请先登录')">
            <template #icon>
              <div class="grid-icon orange">💬</div>
            </template>
            <template #text>
              <div class="grid-text">
                <div class="title">议事圈</div>
                <div class="desc">业主交流讨论</div>
              </div>
            </template>
          </van-grid-item>
          
          <van-grid-item @click="showToast('请先登录')">
            <template #icon>
              <div class="grid-icon purple">👥</div>
            </template>
            <template #text>
              <div class="grid-text">
                <div class="title">业主通讯录</div>
                <div class="desc">快速联络邻居</div>
              </div>
            </template>
          </van-grid-item>
        </van-grid>
      </div>

      <!-- 维权指南 -->
      <div class="card">
        <h3 class="section-title">维权指南</h3>
        <van-cell-group>
          <van-cell 
            title="物业乱收费怎么办？" 
            label="查看处理步骤 →"
            is-link
            @click="showToast('请先登录')"
          >
            <template #icon>
              <div class="cell-icon">💰</div>
            </template>
          </van-cell>
          
          <van-cell 
            title="公共收益被侵占？" 
            label="查看维权依据 →"
            is-link
            @click="showToast('请先登录')"
          >
            <template #icon>
              <div class="cell-icon">🏢</div>
            </template>
          </van-cell>
          
          <van-cell 
            title="服务不达标怎么投诉？" 
            label="查看投诉渠道 →"
            is-link
            @click="showToast('请先登录')"
          >
            <template #icon>
              <div class="cell-icon">📋</div>
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 收费说明 -->
      <div class="card price-card">
        <div class="price-content">
          <div class="price">1元/<span class="unit">年</span></div>
          <p class="price-desc">单个小区全年无限次使用全部功能</p>
          <div class="price-features">
            <span>✓ 法律查询</span>
            <span>✓ 集体表决</span>
            <span>✓ 业主联络</span>
            <span>✓ 维权跟踪</span>
          </div>
        </div>
      </div>

      <!-- 底部登录按钮 -->
      <div class="bottom-actions">
        <van-button 
          type="primary" 
          size="large" 
          round 
          class="btn-full"
          @click="goToLogin"
        >
          微信一键登录
        </van-button>
        <p class="login-tip">登录后即可使用全部功能</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const searchKeyword = ref('')

const onSearch = () => {
  if (!searchKeyword.value) {
    showToast('请输入小区名称')
    return
  }
  showToast('请先登录后搜索')
}

const goToLogin = () => {
  router.push('/auth/login')
}
</script>

<style scoped lang="scss">
.landing-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 100px;
}

.banner {
  background: linear-gradient(135deg, #1989fa 0%, #39b9fa 100%);
  padding: 40px 20px;
  color: #fff;
  text-align: center;
}

.banner-content {
  max-width: 600px;
  margin: 0 auto;
}

.logo {
  font-size: 64px;
  margin-bottom: 16px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
}

.slogan {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 24px;
}

.features {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  
  .icon {
    font-size: 28px;
  }
  
  span:last-child {
    font-size: 12px;
  }
}

.content {
  padding: 12px;
}

.search-section {
  margin-bottom: 12px;
  
  .quick-tags {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    padding: 0 4px;
    
    .tag {
      font-size: 12px;
      color: #1989fa;
      background: #e3f2fd;
      padding: 4px 12px;
      border-radius: 12px;
    }
  }
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #323233;
}

.grid-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  
  &.blue {
    background: #e3f2fd;
  }
  
  &.green {
    background: #e8f5e9;
  }
  
  &.orange {
    background: #fff3e0;
  }
  
  &.purple {
    background: #f3e5f5;
  }
}

.grid-text {
  .title {
    font-size: 14px;
    font-weight: bold;
    color: #323233;
    margin-bottom: 4px;
  }
  
  .desc {
    font-size: 12px;
    color: #969799;
  }
}

.cell-icon {
  width: 36px;
  height: 36px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-right: 8px;
}

.price-card {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
  color: #fff;
  text-align: center;
  
  .price-content {
    padding: 8px 0;
  }
  
  .price {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 4px;
    
    .unit {
      font-size: 16px;
      font-weight: normal;
    }
  }
  
  .price-desc {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 16px;
  }
  
  .price-features {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 12px;
  }
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  
  .login-tip {
    text-align: center;
    font-size: 12px;
    color: #969799;
    margin-top: 8px;
  }
}
</style>
