<template>
  <div class="verify-page">
    <van-nav-bar
      title="业主认证"
      left-arrow
      @click-left="$router.back()"
    />

    <div class="content">
      <!-- 当前小区 -->
      <div class="current-community">
        <div class="label">当前选择小区</div>
        <div class="name">{{ userStore.currentCommunity?.name || '幸福家园小区' }}</div>
        <div class="change" @click="$router.push('/community/select')">更换小区 →</div>
      </div>

      <!-- 认证方式选择 -->
      <div class="verify-methods">
        <div class="section-title">选择认证方式</div>
        
        <van-radio-group v-model="verifyForm.method">
          <div
            class="method-card"
            :class="{ active: verifyForm.method === 1 }"
            @click="verifyForm.method = 1"
          >
            <van-radio :name="1">
              <div class="method-info">
                <div class="method-name">📄 房产证认证</div>
                <div class="method-desc">上传房产证照片，审核最快</div>
              </div>
            </van-radio>
          </div>

          <div
            class="method-card"
            :class="{ active: verifyForm.method === 2 }"
            @click="verifyForm.method = 2"
          >
            <van-radio :name="2">
              <div class="method-info">
                <div class="method-name">🏢 物业证明</div>
                <div class="method-desc">上传物业开具的业主证明</div>
              </div>
            </van-radio>
          </div>

          <div
            class="method-card"
            :class="{ active: verifyForm.method === 3 }"
            @click="verifyForm.method = 3"
          >
            <van-radio :name="3">
              <div class="method-info">
                <div class="method-name">👥 邻居担保</div>
                <div class="method-desc">2户以上已认证业主确认</div>
              </div>
            </van-radio>
          </div>
        </van-radio-group>
      </div>

      <!-- 表单 -->
      <div class="form-card">
        <van-cell-group inset>
          <van-field
            v-model="verifyForm.realName"
            label="真实姓名"
            placeholder="请输入真实姓名"
            :rules="[{ required: true, message: '请输入真实姓名' }]"
          />

          <van-field
            v-model="verifyForm.phone"
            label="手机号"
            placeholder="请输入手机号"
            type="tel"
            :rules="[{ required: true, message: '请输入手机号' }]"
          />

          <van-field
            v-model="verifyForm.building"
            label="楼栋号"
            placeholder="如：1栋"
            :rules="[{ required: true, message: '请输入楼栋号' }]"
          />

          <van-field
            v-model="verifyForm.unit"
            label="单元号"
            placeholder="如：2单元（可选）"
          />

          <van-field
            v-model="verifyForm.roomNumber"
            label="房号"
            placeholder="如：301室"
            :rules="[{ required: true, message: '请输入房号' }]"
          />

          <van-field
            v-model="verifyForm.area"
            label="房屋面积"
            placeholder="平方米"
            type="number"
          />
        </van-cell-group>
      </div>

      <!-- 上传证明 -->
      <div class="upload-section">
        <div class="section-title">上传证明材料</div>
        
        <van-uploader
          v-model="verifyForm.images"
          multiple
          :max-count="3"
          upload-text="上传照片"
        />
        
        <p class="upload-tip">请上传清晰的证明材料照片，支持jpg、png格式</p>
      </div>

      <!-- 提交按钮 -->
      <div class="submit-section">
        <van-button
          type="primary"
          size="large"
          round
          block
          :loading="submitting"
          @click="handleSubmit"
        >
          提交认证
        </van-button>
        
        <p class="submit-tip">提交后我们将在24小时内完成审核</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { ownerApi } from '@/api'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const verifyForm = ref({
  method: 1,
  realName: '',
  phone: '',
  building: '',
  unit: '',
  roomNumber: '',
  area: '',
  images: []
})

const submitting = ref(false)

const handleSubmit = async () => {
  // 表单验证
  if (!verifyForm.value.realName) {
    showToast('请输入真实姓名')
    return
  }
  if (!verifyForm.value.phone) {
    showToast('请输入手机号')
    return
  }
  if (!verifyForm.value.building) {
    showToast('请输入楼栋号')
    return
  }
  if (!verifyForm.value.roomNumber) {
    showToast('请输入房号')
    return
  }

  submitting.value = true

  try {
    const res = await ownerApi.submitVerify({
      communityId: userStore.currentCommunity?.id || 1,
      ...verifyForm.value
    })

    if (res.code === 0) {
      userStore.setOwnerStatus('pending')
      showToast({
        type: 'success',
        message: '提交成功'
      })
      router.push('/owner/status')
    }
  } catch (error) {
    showToast('提交失败，请重试')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.verify-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 40px;
}

.content {
  padding: 12px;
}

.current-community {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .label {
    font-size: 12px;
    color: #969799;
  }
  
  .name {
    font-size: 16px;
    font-weight: bold;
    color: #323233;
    flex: 1;
    margin: 0 12px;
  }
  
  .change {
    font-size: 12px;
    color: #1989fa;
  }
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #323233;
  margin-bottom: 12px;
  padding-left: 4px;
}

.verify-methods {
  margin-bottom: 12px;
  
  .method-card {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 8px;
    border: 2px solid transparent;
    
    &.active {
      border-color: #1989fa;
      background: #e3f2fd;
    }
    
    .method-info {
      margin-left: 8px;
      
      .method-name {
        font-size: 15px;
        font-weight: bold;
        color: #323233;
        margin-bottom: 4px;
      }
      
      .method-desc {
        font-size: 12px;
        color: #969799;
      }
    }
  }
}

.form-card {
  margin-bottom: 12px;
}

.upload-section {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  
  .upload-tip {
    font-size: 12px;
    color: #969799;
    margin-top: 12px;
  }
}

.submit-section {
  padding: 0 12px;
  
  .submit-tip {
    text-align: center;
    font-size: 12px;
    color: #969799;
    margin-top: 12px;
  }
}
</style>
