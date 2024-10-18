<template>
  <div class="settings-page">
    <ModeSwitchButton>
      <template #batch-mode-text>Batch Mode</template>
    </ModeSwitchButton>
    <div class="settings-main">
      <div class="settings-main-form">
        <!-- Printer Item -->
        <div class="settings-main-item printer-item">
          <div class="settings-main-item-right">
            <FormSelectButton>
              <template #form-select-button-label>Select Printer...</template>
            </FormSelectButton>
            <img src="@renderer/assets/form/select.svg" alt="Select Icon" />
          </div>
          <div class="settings-main-item-label">Printer</div>
        </div>

        <!-- Support Item -->
        <div class="settings-main-item support-item">
          <div class="settings-main-item-right">
            <div class="form-normal-text">dreamskyll@foxmail.com</div>
          </div>
          <div class="settings-main-item-label">Support</div>
        </div>
      </div>
    </div>
    <NoDeviceDialog v-model="isNoDeviceDialogVisible" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import ModeSwitchButton from '@renderer/components/Button/ModeSwitchButton.vue'
  import FormSelectButton from '@renderer/components/Button/FormSelectButton.vue'
  import NoDeviceDialog from '@renderer/components/Dialog/NoDeviceDialog.vue'

  // 控制弹窗可见性的状态
  const isNoDeviceDialogVisible = ref(false)
  function openNoDeviceDialog() {
    isNoDeviceDialogVisible.value = true
  }

  const isSaveSettingsDialogVisible = ref(false)
  function saveSettings() {
    // 这里可以添加保存设置的逻辑，比如表单验证和提交
    isSaveSettingsDialogVisible.value = true
  }
</script>

<style scoped lang="scss">
  .settings-page {
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

    .settings-main {
      width: 517px;
      height: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 40px;
    }

    .settings-main-form {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 10px;
      align-self: stretch;

      .settings-main-item {
        display: flex;
        align-items: center;
        flex-direction: row-reverse;
        gap: 20px;

        &-label {
          color: #888;
          display: flex;
          font-family: Inter;
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          white-space: nowrap;
        }

        &-right {
          display: flex;
          width: 372px;
          height: 38px;
          padding: 10px 20px 10px 15px;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          border-radius: 3px;
        }
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

    /* 根据状态应用不同的样式（如果适用） */
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

    .settings-main-button {
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
