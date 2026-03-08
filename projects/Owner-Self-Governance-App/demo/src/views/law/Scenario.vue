<template>
  <div class="law-scenario-page">
    <van-nav-bar title="维权场景" left-arrow @click-left="$router.back()" />
    
    <div class="content" v-if="scenario">
      <div class="scenario-header">
        <div class="scenario-title">{{ scenario.title }}</div>
        <div class="scenario-desc">{{ scenario.description }}</div>
      </div>
      
      <div class="solution-card">
        <div class="card-title">维权方案</div>
        <p>{{ scenario.solution }}</p>
      </div>
      
      <div class="steps-card">
        <div class="card-title">维权步骤</div>
        <van-steps direction="vertical" :active="-1">
          <van-step v-for="(step, index) in scenario.steps" :key="index">
            <div class="step-content">{{ step }}</div>
          </van-step>
        </van-steps>
      </div>
      
      <div class="laws-card">
        <div class="card-title">相关法律</div>
        <van-cell-group inset>
          <van-cell
            v-for="law in scenario.laws"
            :key="law.id"
            :title="law.title"
            :label="law.article"
            is-link
            @click="$router.push(`/law/detail/${law.id}`)"
          />
        </van-cell-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { mockScenarios, mockLaws } from '@/mock/data'

const route = useRoute()
const scenario = ref(null)

onMounted(() => {
  const id = parseInt(route.params.id)
  const s = mockScenarios.find(s => s.id === id) || mockScenarios[0]
  scenario.value = {
    ...s,
    laws: mockLaws.filter(l => s.relatedLaws.includes(l.id))
  }
})
</script>

<style scoped lang="scss">
.law-scenario-page {
  min-height: 100vh;
  background: #f5f5f5;
}
.content {
  padding: 16px;
}
.scenario-header {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: #fff;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 16px;
  
  .scenario-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 12px;
  }
  
  .scenario-desc {
    font-size: 14px;
    opacity: 0.9;
    line-height: 1.5;
  }
}
.solution-card,
.steps-card,
.laws-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  
  .card-title {
    font-size: 16px;
    font-weight: bold;
    color: #323233;
    margin-bottom: 16px;
  }
  
  p {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
  }
}
.step-content {
  font-size: 14px;
  color: #666;
}
</style>
