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
            :Months="formData.months"
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
            :Intervals="formData.intervals"
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
            :toilets="formData.toilets"
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
            <div v-if="formData.detectedDevice !== ''" class="form-normal-text">
              {{ formData.detectedDevice }}
            </div>
            <div v-else class="form-normal-text-slate">Device will be detected automatically</div>
            <!-- 设备状态 -->
            <!-- <div :class="formData.statusClass">
              {{ formData.detectedDeviceStatus }}
            </div> -->
          </div>
          <div class="label-box">
            <div class="batch-main-item-label">Current Device</div>
          </div>
        </div>

        <!-- Current UUID -->
        <div class="batch-main-item">
          <div class="batch-main-item-right">
            <div v-if="formData.uuid !== ''" class="form-normal-text">
              {{ formData.uuid }}
            </div>
            <div v-else class="form-normal-text-slate">UUID will generate when device detected</div>
          </div>
          <!-- TODO: 让文本可以复制 -->
          <div class="label-box">
            <div class="batch-main-item-label">Current UUID</div>
          </div>
        </div>

        <!-- Current Toilet -->
        <div class="batch-main-item">
          <div class="batch-main-item-right">
            <div v-if="formData.selectedToilet !== ''" class="form-normal-text current-toilet">
              {{ formData.selectedToilet }}
            </div>
            <div v-else class="form-normal-text-slate current-toilet">
              Toilet will be picked from selected toilets
            </div>
          </div>
          <div class="label-box">
            <div class="batch-main-item-label">Current Toilet</div>
          </div>
        </div>
      </div>
      <div v-show="formData.isStartBatchInitialize" class="batch-main-running">
        <div class="batch-main-running-label">
          RUNNING...<br />
          WRITING DATA TO DEVICE
        </div>
      </div>
      <div class="batch-main-button">
        <LongerButton v-show="!formData.isStartBatchInitialize" @click="startBatchInitialize">
          <template #label>START BATCH INITIALIZE</template>
        </LongerButton>

        <LongerButton v-show="formData.isStartBatchInitialize" @click="stopBatchInitialize">
          <template #label>STOP</template>
        </LongerButton>
      </div>
    </div>
  </div>
  <!-- Dialogs -->
  <NoDeviceDialog v-model="formData.isNoDeviceDialogVisible" />
  <RenewInitDialog v-model="formData.isRenewInitDialogVisible" />
</template>

<script setup lang="ts">
  import { ref, computed, onBeforeMount } from 'vue'
  import { v4 as uuidv4 } from 'uuid'
  import ModeSwitchButton from '@renderer/components/Button/ModeSwitchButton.vue'
  import LongerButton from '@renderer/components/Button/LongerButton.vue'
  import NoDeviceDialog from '@renderer/components/Dialog/NoDeviceDialog.vue'
  import RenewInitDialog from '@renderer/components/Dialog/RenewInitDialog.vue'
  import { useRouter } from 'vue-router'
  import ToiletSelector from '@renderer/components/Form/ToiletSelector.vue'
  import MonthSelector from '@renderer/components/Form/MonthSelector.vue'
  import IntervalSelector from '@renderer/components/Form/IntervalSelector.vue'
  import { useFormStore } from '@renderer/stores/form'

  const router = useRouter()

  // Define an interface to aggregate form data
  interface SetupFormData {
    months: string[]
    intervals: string[]
    toilets: { name: string; uuid: string }[]
    detectedDevice: string
    detectedDeviceStatus: string
    uuid: string
    selectedToilet: string
    isStartBatchInitialize: boolean
    isNoDeviceDialogVisible: boolean
    isRenewInitDialogVisible: boolean
    statusClass: string
  }

  // Initialize form data using the interface
  const formData = ref<SetupFormData>({
    months: [],
    intervals: [],
    toilets: [],
    detectedDevice: '',
    detectedDeviceStatus: '',
    uuid: '',
    selectedToilet: '',
    isStartBatchInitialize: false,
    isNoDeviceDialogVisible: false,
    isRenewInitDialogVisible: false,
    statusClass: ''
  })

  // Initialize months and intervals from the store
  const formStore = useFormStore()
  formData.value.months = formStore.getMonths()
  formData.value.intervals = formStore.getIntervals()

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

  formData.value.statusClass = statusClass.value

  // Function to update the device status
  function updateStatus(newStatus: string) {
    const validStatuses = ['New device', 'Exported Data Found on Disk', 'No Exported Data Found']
    if (validStatuses.includes(newStatus)) {
      formData.value.detectedDeviceStatus = newStatus
      formData.value.statusClass = statusClass.value
    } else {
      console.warn('Invalid status:', newStatus)
    }
  }

  // Navigation function to switch modes
  function navigateTo(path: string) {
    localStorage.setItem('deviceSetupMode', 'single')
    router.push(path)
    console.log('localStorage.getItem(deviceSetupMode)', localStorage.getItem('deviceSetupMode'))
  }

  // Batch initialize functions
  function startBatchInitialize() {
    formData.value.isStartBatchInitialize = true
    formData.value.detectedDevice = 'COM1 serial'
    formData.value.detectedDeviceStatus = 'New device'
    formData.value.uuid = uuidv4()
    console.log('startBatchInitialize')
  }

  function stopBatchInitialize() {
    formData.value.isStartBatchInitialize = false
    formData.value.detectedDevice = ''
    formData.value.detectedDeviceStatus = ''
    formData.value.uuid = ''
    console.log('stopBatchInitialize')
  }

  // Dialog control functions
  // function openNoDeviceDialog() {
  //   formData.value.isNoDeviceDialogVisible = true
  // }

  // function openRenewInitDialog() {
  //   formData.value.isRenewInitDialogVisible = true
  // }

  // Fetch toilets data
  const fetchToilet = async () => {
    // try {
    //   const res = await axios.get('/api/toilets')
    //   formData.value.toilets = res.data.data
    //   console.log(formData.value.toilets)
    // } catch (err) {
    //   console.error(err)
    // }
    // console.log('selectToilet')
    formData.value.toilets = [
      {
        name: 'Shek Kip Mei, Hong Kong',
        uuid: '4c8f5398-b295-41fb-87f2-c8805c1bf55e'
      },
      {
        name: '80 Tat Chee Ave, Kowloon Tong, Hong Kong',
        uuid: '4c8f5398-b295-41fb-87f2-c8805c2bf55e'
      },
      {
        name: 'Wang Tau Hom Estate Wang Lai House, Fu Mei St, Wang Tau Hom, Hong Kong',
        uuid: '4c8f5398-b295-41fb-87f2-c8805c3bf55e'
      },
      {
        name: 'Wang Tau Hom Estate Wang Lai House, Fu Mei St, Wang Tau Hom, Hong Kong',
        uuid: '4c8f5398-b295-41fb-87f2-c8805c4bf55e'
      },
      {
        name: 'Wang Tau Hom Estate Wang Lai House, Fu Mei St, Wang Tau Hom, Hong Kong',
        uuid: '4c8f5398-b295-41fb-87f2-c8805c5bf55e'
      },
      {
        name: 'Wang Tau Hom Estate Wang Lai House, Wang Tau Hom, Hong Kong',
        uuid: '4c8f5398-b295-41fb-87f2-c8805c6bf55e'
      },
      {
        name: 'Wang Tau Hom Estate Wang Lai House, Wang Tau Hom, Hong Kong',
        uuid: '4c8f5398-b295-41fb-87f2-c8805c7bf55e'
      }
    ]
  }

  // Fetch toilets data before mounting the component
  onBeforeMount(() => {
    fetchToilet()
  })

  // Selection functions for toilet
  function selectToilet() {
    console.log('selectToilet')
  }

  function selectCurrentToilet(toilet: { name: string; uuid: string }) {
    formData.value.selectedToilet = toilet.name
    console.log('selectCurrentToilet', toilet)
  }

  // Selection functions for month
  function selectMonth() {
    console.log('selectMonth')
  }

  function selectCurrentMonth(month: string) {
    // Assuming you want to store the selected month
    console.log('selectCurrentMonth', month)
  }

  // Selection functions for interval
  function selectInterval() {
    console.log('selectInterval')
  }

  function selectCurrentInterval(interval: string) {
    // Assuming you want to store the selected interval
    console.log('selectCurrentInterval', interval)
  }

  // Example usage: Update status after 3 seconds
  setTimeout(() => {
    updateStatus('Exported Data Found on Disk')
  }, 3000)
</script>

<style scoped>
  /* Add your styles here */
</style>
