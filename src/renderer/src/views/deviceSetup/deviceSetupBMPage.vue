<template>
  <div class="setup-page">
    <ModeSwitchButton @click="navigateTo('/deviceSetup')">
      <template #batch-mode-text>Single Mode</template>
    </ModeSwitchButton>
    <div class="batch-main">
      <div class="batch-main-form">
        <!-- Month -->
        <div class="batch-main-item">
          <MonthSelector
            :Months="Months"
            @select-month="selectMonth"
            @select-current-month="selectCurrentMonth"
          />
          <div class="label-box">
            <div class="batch-main-item-label">Month</div>
          </div>
        </div>

        <!-- Report Interval -->
        <div class="batch-main-item">
          <IntervalSelector
            :Intervals="Intervals"
            @select-interval="selectInterval"
            @select-current-interval="selectCurrentInterval"
          />
          <div class="label-box">
            <div class="batch-main-item-label">Report Interval</div>
          </div>
        </div>

        <!-- Toilet -->
        <div class="batch-main-item">
          <ToiletSelector
            :toilets="toilets"
            @select-toilet="selectToilet"
            @select-current-toilet="selectCurrentToilet"
          />
          <div class="label-box">
            <div class="batch-main-item-label">Toilets</div>
          </div>
        </div>

        <!-- Detected Device -->
        <div class="batch-main-item">
          <div class="batch-main-item-right">
            <div class="form-normal-text">
              {{ detectedDevice }}
            </div>
            <div :class="statusClass">
              {{ detectedDeviceStatus }}
            </div>
          </div>
          <div class="label-box">
            <div class="batch-main-item-label">Current Device</div>
          </div>
        </div>

        <!-- Current UUID -->
        <div class="batch-main-item">
          <div class="batch-main-item-right">
            <div class="form-normal-text">
              {{ uuid }}
            </div>
          </div>
          <!-- TODO: 让文本可以复制 -->
          <div class="label-box">
            <div class="batch-main-item-label">Current UUID</div>
          </div>
        </div>

        <!-- Current Toilet -->
        <div class="batch-main-item">
          <div class="batch-main-item-right">
            <div class="form-normal-text current-toilet">
              {{ selectedToilet }}
            </div>
          </div>
          <div class="label-box">
            <div class="batch-main-item-label">Current Toilet</div>
          </div>
        </div>
      </div>
      <div class="batch-main-button">
        <LongerButton @click="openRenewInitDialog">
          <template #label>START BATCH INITIALIZE</template>
        </LongerButton>
      </div>
    </div>
  </div>
  <!-- diaLogs -->
  <NoDeviceDialog v-model="isNoDeviceDialogVisible" />
  <RenewInitDialog v-model="isRenewInitDialogVisible" />
</template>

<script setup lang="ts">
  import { ref, computed, onBeforeMount } from 'vue'
  import { v4 as uuidv4 } from 'uuid'
  import ModeSwitchButton from '@renderer/components/Button/ModeSwitchButton.vue'
  import LongerButton from '@renderer/components/Button/LongerButton.vue'
  import NoDeviceDialog from '@renderer/components/Dialog/NoDeviceDialog.vue'
  import RenewInitDialog from '@renderer/components/Dialog/RenewInitDialog.vue'
  import axios from '@renderer/utils/axios'
  import { useRouter } from 'vue-router'
  import ToiletSelector from '@renderer/components/Form/ToiletSelector.vue'
  import MonthSelector from '@renderer/components/Form/MonthSelector.vue'
  import IntervalSelector from '@renderer/components/Form/IntervalSelector.vue'
  import { useFormStore } from '@renderer/stores/form'

  const router = useRouter()

  // 跳转到单一模式
  function navigateTo(path: string) {
    localStorage.setItem('deviceSetupMode', 'single')
    router.push(path)
    console.log('localStorage.getItem(deviceSetupMode)', localStorage.getItem('deviceSetupMode'))
  }

  // 生成UUID
  const uuid = ref(uuidv4())

  // 检测设备状态逻辑
  const detectedDeviceStatus = ref('New device')
  const detectedDevice = ref('COM1 serial')

  // 计算当前状态对应的CSS类
  const statusClass = computed(() => {
    switch (detectedDeviceStatus.value) {
      case 'New device':
        return 'status-new'
      case 'Exported Data Found on Disk':
        return 'status-exported'
      case 'No Exported Data Found':
        return 'status-no-exported'
      default:
        return ''
    }
  })

  // 更新状态的函数
  function updateStatus(newStatus: string) {
    const validStatuses = ['New device', 'Exported Data Found on Disk', 'No Exported Data Found']
    if (validStatuses.includes(newStatus)) {
      detectedDeviceStatus.value = newStatus
    } else {
      console.warn('Invalid status:', newStatus)
    }
  }

  // 控制弹窗可见性的状态
  const isNoDeviceDialogVisible = ref(false)
  function openNoDeviceDialog() {
    isNoDeviceDialogVisible.value = true
  }

  const isRenewInitDialogVisible = ref(false)
  function openRenewInitDialog() {
    isRenewInitDialogVisible.value = true
  }

  // 使用Pinia的store管理月份和间隔
  const formStore = useFormStore()
  const Months = formStore.getMonths()
  const Intervals = formStore.getIntervals()

  // 选择厕所
  const toilets = ref([])
  const selectToilet = () => {
    console.log('selectToilet')
  }
  const selectedToilet = ref('')
  const selectCurrentToilet = (toilet: string) => {
    selectedToilet.value = toilet
    console.log('selectCurrentToilet', toilet)
  }

  // 选择月份
  const selectMonth = () => {
    console.log('selectMonth')
  }
  const selectedMonth = ref('')
  const selectCurrentMonth = (month: string) => {
    selectedMonth.value = month
    console.log('selectCurrentMonth', month)
  }

  // 选择间隔
  const selectInterval = () => {
    console.log('selectInterval')
  }
  const selectedInterval = ref('')
  const selectCurrentInterval = (interval: string) => {
    selectedInterval.value = interval
    console.log('selectCurrentInterval', interval)
  }

  // 获取厕所数据
  const fetchToilet = async () => {
    try {
      const res = await axios.get('/api/toilets')
      toilets.value = res.data.data
      console.log(toilets.value)
    } catch (err) {
      console.error(err)
    }
    console.log('selectToilet')
  }

  // 在组件挂载前获取厕所数据
  onBeforeMount(() => {
    fetchToilet()
  })

  // 示例用法
  setTimeout(() => {
    updateStatus('Exported Data Found on Disk')
  }, 3000)
</script>

<!-- 移除 <style scoped> 部分 -->
