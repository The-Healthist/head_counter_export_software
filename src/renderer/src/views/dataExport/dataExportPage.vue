<template>
  <div class="data-export-page">
    <ModeSwitchButton @click="navigateTo('/dataExportBM')">
      <template #batch-mode-text>Batch Mode</template>
    </ModeSwitchButton>
    <div class="batch-main">
      <div class="batch-main-form">
        <!-- Data Path -->
        <div class="batch-main-item">
          <div class="batch-main-item-right">
            <FormSelectButton>
              <template #form-select-button-label>Select Data Path...</template>
            </FormSelectButton>
            <img src="@renderer/assets/form/select.svg" alt="Select" />
          </div>
          <div class="label-box">
            <div class="batch-main-item-label">Data Path</div>
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
            <div class="batch-main-item-label">Detected Device</div>
          </div>
        </div>

        <!-- Device UUID -->
        <div class="batch-main-item">
          <div class="batch-main-item-right">
            <div class="form-normal-text">
              {{ uuid }}
            </div>
          </div>
          <!-- TODO: 让文本可以复制 -->
          <div class="label-box">
            <div class="batch-main-item-label">Device UUID</div>
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
            <div class="batch-main-item-label">Placement Toilet</div>
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
  import FormSelectButton from '@renderer/components/Button/FormSelectButton.vue'
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

  // 跳转到批处理模式
  function navigateTo(path: string) {
    localStorage.setItem('dataExportMode', 'batch')
    router.push(path)
    console.log('localStorage.getItem(dataExportMode)', localStorage.getItem('dataExportMode'))
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

  // 获取厕所数据
  const toilets = ref([])
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

  /*
  form: 使用pinia的store来管理月份和间隔
  */
  const formStore = useFormStore()
  const Months = formStore.getMonths()
  const Intervals = formStore.getIntervals()

  // 选择厕所
  const isShowToiletSelector = ref(true)
  const selectedToilet = ref('')
  function selectToilet() {
    console.log('selectToilet')
  }
  function selectCurrentToilet(toilet: string) {
    selectedToilet.value = toilet
    console.log('selectCurrentToilet', toilet)
  }

  // 选择月份
  const selectedMonth = ref('')
  function selectMonth() {
    console.log('selectMonth')
  }
  function selectCurrentMonth(month: string) {
    selectedMonth.value = month
    console.log('selectCurrentMonth', month)
  }

  // 选择间隔
  const selectedInterval = ref('')
  function selectInterval() {
    console.log('selectInterval')
  }
  function selectCurrentInterval(interval: string) {
    selectedInterval.value = interval
    console.log('selectCurrentInterval', interval)
  }

  // 示例用法
  setTimeout(() => {
    updateStatus('Exported Data Found on Disk')
  }, 3000)
</script>

<!-- 移除 <style scoped> 部分 -->
