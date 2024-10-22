<template>
  <div class="data-export-page">
    <ModeSwitchButton @click="navigateTo('/dataExport')">
      <template #batch-mode-text>Single Mode</template>
    </ModeSwitchButton>
    <div class="batch-main">
      <div class="batch-main-form">
        <!-- Month -->
        <div class="batch-main-item">
          <div class="batch-main-item-right">
            <FormSelectButton>
              <template #form-select-button-label>Select Month...</template>
            </FormSelectButton>
            <img src="@renderer/assets/form/select.svg" alt="" />
          </div>
          <div class="label-box">
            <div class="batch-main-item-label">Month</div>
          </div>
        </div>

        <!-- Data Path -->
        <div class="batch-main-item">
          <div class="batch-main-item-right">
            <FormSelectButton>
              <template #form-select-button-label>Select...</template>
            </FormSelectButton>
            <img src="@renderer/assets/form/select.svg" alt="" />
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
          <div class="label-box">
            <div class="batch-main-item-label">Device UUID</div>
          </div>
        </div>

        <!-- Placement Toilet -->
        <div class="batch-main-item">
          <div class="batch-main-item-right">
            <FormSelectButton>
              <template #form-select-button-label>Select Toilet...</template>
            </FormSelectButton>
            <img src="@renderer/assets/form/select.svg" alt="" />
          </div>
          <div class="label-box">
            <div class="batch-main-item-label">Placement Toilet</div>
          </div>
        </div>
      </div>
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
  import { ref, computed } from 'vue'
  import { v4 as uuidv4 } from 'uuid'
  import ModeSwitchButton from '@renderer/components/Button/ModeSwitchButton.vue'
  import FormSelectButton from '@renderer/components/Button/FormSelectButton.vue'
  import NormalButton from '@renderer/components/Button/NormalButton.vue'
  import NoDeviceDialog from '@renderer/components/Dialog/NoDeviceDialog.vue'
  import RenewInitDialog from '@renderer/components/Dialog/RenewInitDialog.vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  // to single mode
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

  // 控制弹窗可见性的状态
  const isNoDeviceDialogVisible = ref(false)
  function openNoDeviceDialog() {
    isNoDeviceDialogVisible.value = true
  }

  const isRenewInitDialogVisible = ref(false)
  function openRenewInitDialog() {
    isRenewInitDialogVisible.value = true
  }

  // 示例用法
  setTimeout(() => {
    updateStatus('Exported Data Found on Disk')
  }, 3000)
</script>

<!-- 移除 <style scoped> 部分 -->
