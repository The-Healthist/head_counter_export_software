<template>
  <div class="data-export-page">
    <ModeSwitchButton @click="navigateTo('/dataExport')">
      <template #batch-mode-text>Single Mode</template>
    </ModeSwitchButton>
    <div class="batch-main">
      <div class="batch-main-form">
        <!-- Data Path -->
        <div class="batch-main-item">
          <div class="batch-main-item-right" style="cursor: pointer" @click="openFileDialog">
            <FormSelectButton v-if="setupFormData.dataPath === ''">
              <template #form-select-button-label>Select...</template>
            </FormSelectButton>
            <div v-if="setupFormData.dataPath !== ''">
              <div class="form-normal-text">{{ setupFormData.dataPath }}</div>
            </div>
            <img src="@renderer/assets/form/select.svg" alt="Select Data Path" />
          </div>

          <div class="label-box">
            <div class="batch-main-item-label">Data Path</div>
          </div>
        </div>

        <!-- Detected Device -->
        <div class="batch-main-item">
          <div class="batch-main-item-right">
            <div class="form-normal-text">
              {{ setupFormData?.detectedDevice }}
            </div>
            <div :class="statusClass">
              {{ setupFormData?.detectedDeviceStatus }}
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
              {{ setupFormData?.deviceUUID }}
            </div>
          </div>
          <div class="label-box">
            <div class="batch-main-item-label">Device UUID</div>
          </div>
        </div>

        <!-- Placement Toilet -->
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
        <!-- exported toilets -->
        <div class="batch-main-item">
          <ExportedBox :toilets="toilets" />
          <div class="label-box">
            <div class="batch-main-item-label">Exported Toilets</div>
          </div>
        </div>
      </div>

      <!-- 运行状态 -->
      <div v-show="isStartBatchExport" class="batch-main-running">
        <div class="batch-main-running-label">
          RUNNING...<br />
          WRITING DATA TO DEVICE
        </div>
      </div>
      <!-- TODO:等待下一个设备 -->
      <div v-show="isStartBatchExport && false" class="batch-main-running">
        <div class="batch-main-running-label">
          RUNNING...<br />
          WAITING FOR NEXT DEVICE
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="batch-main-button">
        <NormalButton v-show="!isStartBatchExport" @click="startBatchExport">
          <template #label>EXPORT</template>
        </NormalButton>
        <NormalButton v-show="isStartBatchExport" @click="stopBatchExport">
          <template #label>STOP</template>
        </NormalButton>
      </div>
    </div>
    <!-- 弹窗组件 -->
    <NoDeviceDialog v-model="isNoDeviceDialogVisible" />
    <RenewInitDialog v-model="isRenewInitDialogVisible" />
  </div>
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
  import { useFormStore } from '@renderer/stores/form'
  import ExportedBox from '@renderer/components/Form/ExportedBox.vue'

  interface SetupFormData {
    dataPath?: string
    detectedDevice?: string
    deviceUUID?: string
    detectedDeviceStatus?: string
    placementToilet?: { name: string; uuid: string }
    month?: string
    exportedToilets?: { name: string; uuid: string }[]
  }

  const setupFormData = ref<SetupFormData>({
    dataPath: '',
    detectedDevice: '',
    deviceUUID: '',
    detectedDeviceStatus: '',
    placementToilet: { name: '', uuid: '' },
    month: '',
    exportedToilets: []
  })

  const toilets = ref<{ name: string; uuid: string }[]>([])
  setupFormData.value.deviceUUID = uuidv4()
  setupFormData.value.detectedDeviceStatus = 'New device'
  setupFormData.value.detectedDevice = 'COM1 serial'
  setupFormData.value.placementToilet = { name: '', uuid: '' }
  setupFormData.value.exportedToilets = toilets.value
  setupFormData.value.month = ''

  // 路由实例
  const router = useRouter()

  // 跳转到单一模式
  function navigateTo(path: string) {
    localStorage.setItem('dataExportMode', 'single')
    router.push(path)
    console.log('localStorage.getItem(dataExportMode)', localStorage.getItem('dataExportMode'))
  }

  // 计算当前状态对应的CSS类
  const statusClass = computed(() => {
    switch (setupFormData.value.detectedDeviceStatus) {
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
      setupFormData.value.detectedDeviceStatus = newStatus
    } else {
      console.warn('Invalid status:', newStatus)
    }
  }

  /**
   * Batch export
   */
  const isStartBatchExport = ref(false)
  function startBatchExport() {
    isStartBatchExport.value = true
    // 添加批处理导出的逻辑
  }
  function stopBatchExport() {
    isStartBatchExport.value = false
    // 添加停止批处理导出的逻辑
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

  // 使用 Pinia 的 store 来管理月份和间隔
  const formStore = useFormStore()
  const Months = formStore.getMonths()

  // 获取厕所数据

  const fetchToilet = async () => {
    await axios.get('/api/toilets').then((res) => {
      toilets.value = res.data.data
      console.log(toilets.value)
    })
    console.log('selectToilet')
  }

  // 在组件挂载前获取厕所数据
  onBeforeMount(() => {
    fetchToilet()
  })

  // 选择厕所

  function selectToilet() {
    console.log('Toilet selector clicked')
  }

  function selectCurrentToilet(toilet: { name: string; uuid: string }) {
    setupFormData.value.placementToilet = toilet
    console.log('Selected Toilets:', toilets)
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

  // 打开文件系统对话框并选择路径
  async function openFileDialog() {
    try {
      const selectedPath = await window.api.openFileDialog() // 通过 contextBridge 暴露的 API
      if (selectedPath) {
        setupFormData.value.dataPath = selectedPath
        console.log('Selected Path:', selectedPath)
      }
    } catch (error) {
      console.error('Error selecting path:', error)
    }
  }

  // 示例用法
  setTimeout(() => {
    updateStatus('Exported Data Found on Disk')
  }, 3000)
</script>

<style scoped>
  .selected-path {
    margin-top: 8px;
    font-size: 14px;
    color: #333;
  }
</style>
