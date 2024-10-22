<template>
  <div class="setup-page">
    <ModeSwitchButton @click="navigateTo('/deviceSetup')">
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
            <img src="@renderer/assets/form/select.svg" alt="Select" />
          </div>
          <div class="label-box">
            <div class="batch-main-item-label">Month</div>
          </div>
        </div>

        <!-- Report Interval -->
        <div class="batch-main-item">
          <div class="batch-main-item-right">
            <FormSelectButton>
              <template #form-select-button-label>Select Interval...</template>
            </FormSelectButton>
            <img src="@renderer/assets/form/select.svg" alt="Select" />
          </div>
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
          <div class="batch-main-item-label">Current Device</div>
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
        <InitButton @click="openRenewInitDialog">
          <template #label>INITIALIZE</template>
        </InitButton>
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
  import InitButton from '@renderer/components/Button/InitButton.vue'
  import NoDeviceDialog from '@renderer/components/Dialog/NoDeviceDialog.vue'
  import RenewInitDialog from '@renderer/components/Dialog/RenewInitDialog.vue'
  import axios from '@renderer/utils/axios'
  import { useRouter } from 'vue-router'
  import ToiletSelector from '@renderer/components/Form/ToiletSelector.vue' // 引入新组件

  const router = useRouter()
  // to single mode
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
  // TODO: 打开没检测到设备的弹窗
  const isNoDeviceDialogVisible = ref(false)
  function openNoDeviceDialog() {
    isNoDeviceDialogVisible.value = true
  }

  const isRenewInitDialogVisible = ref(false)
  function openRenewInitDialog() {
    isRenewInitDialogVisible.value = true
  }

  // fetch toilet data
  const toilets = ref([])
  const fetchToilet = async () => {
    await axios
      .get('/api/toilets')
      .then((res) => {
        toilets.value = res.data.data
        console.log(toilets.value)
      })
      .catch((err) => {
        console.error(err)
      })
  }
  const selectToilet = () => {
    console.log('selectToilet')
  }
  const selectedToilet = ref('')
  const selectCurrentToilet = (toilet: string) => {
    selectedToilet.value = toilet
  }
  onBeforeMount(() => {
    fetchToilet()
  })
  // 示例用法（您可以根据实际逻辑替换）
  setTimeout(() => {
    updateStatus('Exported Data Found on Disk')
  }, 3000)
</script>

<style scoped lang="scss">
  .setup-page {
    width: 100%;
    height: 100%;
    display: flex;
    padding: 15px 25px;
    justify-content: center;
    align-items: center;
    gap: 123px;
    flex: 1 0 0;
    align-self: stretch; // Extend to parent width
    background-color: #fff;
    position: relative;
    z-index: 3;

    .batch-main {
      width: 517px;
      height: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 40px;
    }

    .batch-main-form {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 10px;
      align-self: stretch;

      .batch-main-item {
        display: flex;
        align-items: stretch;
        flex-direction: row-reverse;
        gap: 20px;
        .label-box {
          position: relative;
          display: flex;
          height: 100%;
          padding: 10px 0px 10px 15px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .batch-main-item-label {
          color: #888;
          display: flex;
          font-family: Inter;
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          white-space: nowrap;
        }

        .batch-main-item-right {
          display: flex;
          width: 372px;
          height: 38px;
          padding: 10px 20px 10px 15px;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          border-radius: 3px;
          img {
            cursor: pointer;
          }
          .current-toilet {
            overflow-x: hidden;
            white-space: nowrap;
          }
        }

        /* 移除原有的选择框相关样式 */
      }
    }

    .form-normal-text {
      color: #333;
      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }

    /* 根据状态应用不同的样式 */
    .status-new {
      color: #ccc;
      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }

    .status-exported {
      color: #008000;
      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }

    .status-no-exported {
      color: #f00;
      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }

    .batch-main-button {
      display: flex;
      width: 184px;
      height: 40px;
      padding: 23px 30px;
      justify-content: center;
      align-items: center;
      gap: 10px;
    }
  }
</style>
