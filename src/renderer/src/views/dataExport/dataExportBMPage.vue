<template>
  <div class="data-export-page">
    <ModeSwitchButton @click="navigateTo('/dataExport')">
      <template #batch-mode-text>Single Mode</template>
    </ModeSwitchButton>
    <div class="batch-main">
      <div class="batch-main-form">
        <!-- Data Path -->
        <div class="batch-main-item">
          <div class="batch-main-item-right">
            <FormSelectButton>
              <template #form-select-button-label>Select...</template>
            </FormSelectButton>
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
            <div class="form-normal-text" @click="copyUUID">
              {{ uuid }}
            </div>
          </div>
          <!-- 实现文本可复制 -->
          <div class="label-box">
            <div class="batch-main-item-label">Device UUID</div>
          </div>
        </div>

        <!-- Placement Toilet (多选) -->
        <div class="batch-main-item">
          <ToiletSelectorMultiple
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
  import ToiletSelectorMultiple from '@renderer/components/Form/ToiletSelectorMultiple.vue'
  import MonthSelector from '@renderer/components/Form/MonthSelector.vue'
  import { useFormStore } from '@renderer/stores/form'

  // 路由实例
  const router = useRouter()

  // 跳转到单一模式
  function navigateTo(path: string) {
    localStorage.setItem('dataExportMode', 'single')
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
  // const Intervals = formStore.getIntervals() // 如果不需要间隔可以注释

  // 获取厕所数据
  const toilets = ref<string[]>([])
  const fetchToilet = async () => {
    try {
      const res = await axios.get('/api/toilets')
      toilets.value = res.data.data
      console.log(toilets.value)
    } catch (err) {
      console.error(err)
    }
  }

  // 在组件挂载前获取厕所数据
  onBeforeMount(() => {
    fetchToilet()
  })

  // 选择厕所 (多选)
  const selectedToilet = ref<string[]>([]) // 修改为数组

  function selectToilet() {
    console.log('Toilet selector clicked')
  }

  function selectCurrentToilet(toilets: string[]) {
    // 接收数组
    selectedToilet.value = toilets
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

  // 复制 UUID 到剪贴板
  function copyUUID() {
    navigator.clipboard
      .writeText(uuid.value)
      .then(() => {
        console.log('UUID copied to clipboard')
        // 可以添加一个提示用户复制成功的通知
      })
      .catch((err) => {
        console.error('Failed to copy UUID:', err)
      })
  }

  // 示例用法
  setTimeout(() => {
    updateStatus('Exported Data Found on Disk')
  }, 3000)
</script>
