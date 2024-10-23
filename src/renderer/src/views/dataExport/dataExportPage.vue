<template>
  <div class="data-export-page">
    <ModeSwitchButton @click="navigateTo('/dataExportBM')">
      <template #batch-mode-text>Batch Mode</template>
    </ModeSwitchButton>
    <div class="batch-main">
      <div class="batch-main-form">
        <!-- Data Path -->
        <div class="batch-main-item">
          <div class="batch-main-item-right" style="cursor: pointer" @click="openFileDialog">
            <FormSelectButton v-if="formData.dataPath === ''">
              <template #form-select-button-label>Select...</template>
            </FormSelectButton>
            <div v-else>
              <div class="form-normal-text">{{ formData.dataPath }}</div>
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
              {{ formData.detectedDevice }}
            </div>
            <div :class="statusClass">
              {{ formData.detectedDeviceStatus }}
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
              {{ formData.deviceUUID }}
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
      </div>

      <!-- Init Button -->
      <div class="batch-main-button">
        <NormalButton @click="openRenewInitDialog">
          <template #label>Export</template>
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
  import { useFormStore } from '@renderer/stores/form'
  const router = useRouter()

  // Navigate to batch mode
  function navigateTo(path: string) {
    localStorage.setItem('dataExportMode', 'batch')
    router.push(path)
    console.log('localStorage.getItem(dataExportMode)', localStorage.getItem('dataExportMode'))
  }

  // Define interface to collect form data
  interface SetupFormData {
    dataPath?: string
    detectedDevice?: string
    deviceUUID?: string
    detectedDeviceStatus?: string
    placementToilet?: { name: string; uuid: string }
    month?: string
  }

  // Initialize form data
  const formData = ref<SetupFormData>({
    dataPath: '',
    detectedDevice: 'COM1 serial',
    deviceUUID: uuidv4(),
    detectedDeviceStatus: 'New device',
    placementToilet: { name: '', uuid: '' },
    month: ''
  })
  const toilets = ref<{ name: string; uuid: string }[]>([])

  // Calculate the CSS class corresponding to the current status
  const statusClass = computed(() => {
    switch (formData.value.detectedDeviceStatus) {
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

  // Update status function
  function updateStatus(newStatus: string) {
    const validStatuses = ['New device', 'Exported Data Found on Disk', 'No Exported Data Found']
    if (validStatuses.includes(newStatus)) {
      formData.value.detectedDeviceStatus = newStatus
    } else {
      console.warn('Invalid status:', newStatus)
    }
  }

  // Control the visibility of the dialog
  const isNoDeviceDialogVisible = ref(false)

  const isRenewInitDialogVisible = ref(false)
  function openRenewInitDialog() {
    isRenewInitDialogVisible.value = true
  }

  // Get toilet data
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

  // Get toilet data before mounting the component
  onBeforeMount(() => {
    fetchToilet()
  })

  // Use pinia's store to manage months and intervals
  const formStore = useFormStore()
  const Months = formStore.getMonths()

  // Select toilet
  function selectToilet() {
    console.log('selectToilet')
  }
  function selectCurrentToilet(toilet: { name: string; uuid: string }) {
    formData.value.placementToilet = toilet
    console.log('selectCurrentToilet', toilet)
  }

  // Select month

  function selectMonth() {
    console.log('selectMonth')
  }
  function selectCurrentMonth(month: string) {
    formData.value.month = month
    console.log('selectCurrentMonth', month)
  }

  // Open file system dialog and select path
  async function openFileDialog() {
    try {
      const selectedPath = await window.api.openFileDialog() // 通过 contextBridge 暴露的 API
      if (selectedPath) {
        formData.value.dataPath = selectedPath
        console.log('Selected Path:', selectedPath)
      }
    } catch (error) {
      console.error('Error selecting path:', error)
    }
  }

  // Example usage
  setTimeout(() => {
    updateStatus('Exported Data Found on Disk')
  }, 3000)
</script>
