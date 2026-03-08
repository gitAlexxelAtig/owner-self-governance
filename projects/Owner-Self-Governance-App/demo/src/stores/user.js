import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const userInfo = ref(null)
  const currentCommunity = ref(null)
  const ownerStatus = ref('') // pending, verified, rejected
  const isPaid = ref(false)
  const token = ref('')

  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const userName = computed(() => userInfo.value?.nickname || '未登录')
  const userAvatar = computed(() => userInfo.value?.avatar || '')

  // Actions
  const setUserInfo = (data) => {
    userInfo.value = data
    localStorage.setItem('userInfo', JSON.stringify(data))
  }

  const setToken = (t) => {
    token.value = t
    localStorage.setItem('token', t)
  }

  const setCurrentCommunity = (community) => {
    currentCommunity.value = community
    localStorage.setItem('currentCommunity', JSON.stringify(community))
  }

  const setOwnerStatus = (status) => {
    ownerStatus.value = status
    localStorage.setItem('ownerStatus', status)
  }

  const setIsPaid = (paid) => {
    isPaid.value = paid
    localStorage.setItem('isPaid', paid)
  }

  const initUserInfo = () => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('userInfo')
    const savedCommunity = localStorage.getItem('currentCommunity')
    const savedStatus = localStorage.getItem('ownerStatus')
    const savedPaid = localStorage.getItem('isPaid')

    if (savedToken) token.value = savedToken
    if (savedUser) userInfo.value = JSON.parse(savedUser)
    if (savedCommunity) currentCommunity.value = JSON.parse(savedCommunity)
    if (savedStatus) ownerStatus.value = savedStatus
    if (savedPaid) isPaid.value = savedPaid === 'true'
  }

  const logout = () => {
    userInfo.value = null
    currentCommunity.value = null
    ownerStatus.value = ''
    isPaid.value = false
    token.value = ''
    localStorage.clear()
  }

  return {
    userInfo,
    currentCommunity,
    ownerStatus,
    isPaid,
    token,
    isLoggedIn,
    userName,
    userAvatar,
    setUserInfo,
    setToken,
    setCurrentCommunity,
    setOwnerStatus,
    setIsPaid,
    initUserInfo,
    logout
  }
})
