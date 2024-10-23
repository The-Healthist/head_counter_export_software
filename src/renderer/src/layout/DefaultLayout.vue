<template>
  <div class="main-layout">
    <div class="main-layout-left">
      <LeftNav />
    </div>
    <div class="main-layout-right">
      <router-view />
    </div>
  </div>
</template>
<script setup lang="ts">
  import LeftNav from '@renderer/components/Nav/leftNav.vue'
</script>
<style scoped lang="scss">
  .main-layout {
    display: flex;
    height: 100vh;
    width: 100vw;
    background-color: #fff;
    z-index: 1;
    .main-layout-left {
      width: 240px;
      height: 100%;
    }
    // 右侧内容区域可以自动延展至剩余空间
    .main-layout-right {
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: stretch; // 从左到右延展
      justify-content: center; // 从上到下延展
      height: 100%;
      width: 100%;
    }
  }
</style>
