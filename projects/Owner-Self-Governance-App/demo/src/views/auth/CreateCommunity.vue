<template>
  <div class="create-community-page">
    <van-nav-bar title="创建小区" left-arrow @click-left="$router.back()" />
    
    <div class="content">
      <van-cell-group inset>
        <van-field v-model="form.name" label="小区名称" placeholder="请输入小区名称" />
        <van-field v-model="form.address" label="详细地址" placeholder="请输入详细地址" type="textarea" rows="2" />
        <van-field v-model="form.buildings" label="楼栋数" placeholder="请输入楼栋数" type="number" />
        <van-field v-model="form.units" label="总户数" placeholder="请输入总户数" type="number" />
        <van-field v-model="form.property" label="物业公司" placeholder="请输入物业公司" />
      </van-cell-group>
      
      <van-button type="primary" round block class="submit-btn" @click="handleCreate">创建</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const form = ref({
  name: '',
  address: '',
  buildings: '',
  units: '',
  property: ''
})

const handleCreate = () => {
  showToast('创建成功')
  router.push('/owner/verify')
}
</script>

<style scoped>
.create-community-page {
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
