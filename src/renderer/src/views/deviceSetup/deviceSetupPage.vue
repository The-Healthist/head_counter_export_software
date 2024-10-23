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

        <!-- Random UUID -->
        <div class="batch-main-item">
          <div class="batch-main-item-right">
            <div class="form-normal-text">
              {{ formData.deviceUUID }}
            </div>
          </div>
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
  // import FormSelectButton from '@renderer/components/Button/FormSelectButton.vue' // 如需使用 Data Path 功能
  import { useFormStore } from '@renderer/stores/form'
  const router = useRouter()
  // to batch mode
  function navigateTo(path: string) {
    localStorage.setItem('deviceSetupMode', 'batch')
    router.push(path)
    console.log('localStorage.getItem(deviceSetupMode)', localStorage.getItem('deviceSetupMode'))
  }
  // Define an interface to aggregate form data
  interface SetupFormData {
    dataPath?: string
    detectedDevice?: string
    deviceUUID?: string
    detectedDeviceStatus?: string
    placementToilet?: { name: string; uuid: string }
    month?: string
    interval?: string
  }

  // Initialize form data
  const formData = ref<SetupFormData>({
    dataPath: '',
    detectedDevice: 'COM1 serial',
    deviceUUID: uuidv4(),
    detectedDeviceStatus: 'New device',
    placementToilet: { name: '', uuid: '' },
    month: '',
    interval: ''
  })

  // Compute the CSS class based on the device status
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

  // Function to update the device status
  function updateStatus(newStatus: string) {
    const validStatuses = ['New device', 'Exported Data Found on Disk', 'No Exported Data Found']
    if (validStatuses.includes(newStatus)) {
      formData.value.detectedDeviceStatus = newStatus
    } else {
      console.warn('Invalid status:', newStatus)
    }
  }

  // Control the visibility of dialogs
  const isNoDeviceDialogVisible = ref(false)
  const isRenewInitDialogVisible = ref(false)

  // function openNoDeviceDialog() {
  //   isNoDeviceDialogVisible.value = true
  // }

  function openRenewInitDialog() {
    isRenewInitDialogVisible.value = true
  }

  // Fetch toilets data
  const toilets = ref<{ name: string; uuid: string }[]>([])
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

  // Fetch toilets data before mounting the component
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

  function selectToilet() {
    console.log('selectToilet')
  }
  function selectCurrentToilet(toilet: { name: string; uuid: string }) {
    formData.value.placementToilet = toilet
    console.log('selectCurrentToilet', toilet)
  }

  // Selection functions for month

  function selectMonth() {
    console.log('selectMonth')
  }
  function selectCurrentMonth(month: string) {
    formData.value.month = month
    console.log('selectCurrentMonth', month)
  }

  // Selection functions for interval

  function selectInterval() {
    console.log('selectInterval')
  }
  function selectCurrentInterval(interval: string) {
    formData.value.interval = interval
    console.log('selectCurrentInterval', interval)
  }

  setTimeout(() => {
    updateStatus('Exported Data Found on Disk')
  }, 3000)
</script>
