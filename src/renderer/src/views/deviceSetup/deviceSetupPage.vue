<template>
  <div class="device-setup-page">
    <div class="device-setup-page-content">
      <div class="device-setup-page-batch-mode"></div>
      <div class="device-setup-page-batch-main"></div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss">
  .device-setup-page {
    width: 100%;
    height: 100%;
    display: flex;
    padding: 15px 25px;
    justify-content: center;
    align-items: center;
    gap: 123px;
    flex: 1 0 0;
    align-self: stretch;
    background-color: #fff;
    position: relative;
    z-index: 3;
    .device-setup-page-batch-mode {
      position: absolute;
      left: 25px;
      top: 20px;

      display: flex;
      width: 113px;
      height: 27px;
      padding: 23px 30px;
      justify-content: center;
      align-items: center;
      gap: 10px;
    }
  }
</style>
