<template>
  <div class="setup-page">
    <ModeSwitchButton @click="navigateTo('/deviceSetupBM')">
      <template #batch-mode-text>Batch Mode</template>
    </ModeSwitchButton>
    <div class="batch-main">
      <div class="batch-main-form">
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
            <div class="batch-main-item-label">Detected Device</div>
          </div>
        </div>

        <!-- Random UUID -->
        <div class="batch-main-item">
          <div class="batch-main-item-right">
            <div class="form-normal-text">
              {{ uuid }}
            </div>
          </div>
          <!-- TODO: 让文本可以复制 -->
          <div class="label-box">
            <div class="batch-main-item-label">Random UUID</div>
          </div>
        </div>

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

        <!-- Toilet -->
        <div v-show="isShowToiletSelector" class="batch-main-item">
          <ToiletSelector
            :toilets="toilets"
            @select-toilet="selectToilet"
            @select-current-toilet="selectCurrentToilet"
          />
          <div class="label-box">
            <div class="batch-main-item-label">Toilet</div>
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
      </div>

      <!-- Init Button -->
      <div class="batch-main-button">
        <NormalButton @click="openRenewInitDialog">
          <template #label>INITIALIZE</template>
        </NormalButton>
      </div>
    </div>
  </div>
  <NoDeviceDialog v-model="isNoDeviceDialogVisible" />
  <RenewInitDialog v-model="isRenewInitDialogVisible" />
</template>

<script setup lang="ts">
  import { ref, computed, onBeforeMount } from 'vue'
  import { v4 as uuidv4 } from 'uuid'
  import ModeSwitchButton from '@renderer/components/Button/ModeSwitchButton.vue'
  import NormalButton from '@renderer/components/Button/NormalButton.vue'
  import NoDeviceDialog from '@renderer/components/Dialog/NoDeviceDialog.vue'
  import RenewInitDialog from '@renderer/components/Dialog/RenewInitDialog.vue'
  import axios from '@renderer/utils/axios'
  import { useRouter } from 'vue-router'
  import ToiletSelector from '@renderer/components/Form/ToiletSelector.vue'
  import MonthSelector from '@renderer/components/Form/MonthSelector.vue'
  import IntervalSelector from '@renderer/components/Form/IntervalSelector.vue'
  import { useFormStore } from '@renderer/stores/form'
  const router = useRouter()

  // to batch mode
  function navigateTo(path: string) {
    localStorage.setItem('deviceSetupMode', 'batch')
    router.push(path)
    console.log('localStorage.getItem(deviceSetupMode)', localStorage.getItem('deviceSetupMode'))
  }

  // UUID
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
  // TODO: 打开没检测到设备的弹窗
  const isNoDeviceDialogVisible = ref(false)
  function openNoDeviceDialog() {
    isNoDeviceDialogVisible.value = true
  }

  const isRenewInitDialogVisible = ref(false)
  function openRenewInitDialog() {
    isRenewInitDialogVisible.value = true
  }

  const toilets = ref([])
  const fetchToilet = async () => {
    await axios.get('/api/toilets').then((res) => {
      toilets.value = res.data.data
      console.log(toilets.value)
    })
    console.log('selectToilet')
  }
  // fetch toilet data
  onBeforeMount(() => {
    fetchToilet()
  })

  /*
  form: 使用pinia的store来管理月份和间隔
  */
  const formStore = useFormStore()
  const Months = formStore.getMonths()
  const Intervals = formStore.getIntervals()

  // select toilet
  const isShowToiletSelector = ref(true)
  const selectedToilet = ref('')
  function selectToilet() {
    console.log('selectToilet')
  }
  function selectCurrentToilet(toilet: string) {
    selectedToilet.value = toilet
    console.log('selectCurrentToilet', toilet)
  }
  // select month
  const selectedMonth = ref('')
  function selectMonth() {
    console.log('selectMonth')
  }
  function selectCurrentMonth(month: string) {
    selectedMonth.value = month
    console.log('selectCurrentMonth', month)
  }

  // select interval
  const selectedInterval = ref('')
  function selectInterval() {
    console.log('selectInterval')
  }
  function selectCurrentInterval(interval: string) {
    selectedInterval.value = interval
    console.log('selectCurrentInterval', interval)
  }

  setTimeout(() => {
    updateStatus('Exported Data Found on Disk')
  }, 3000)
</script>

<!-- 移除 <style scoped> 部分 -->
