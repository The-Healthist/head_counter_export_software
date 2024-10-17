<template>
  <div class="welcome-page">
    <div class="welcome-page-content">
      <img src="../../assets/welcome/welcome.svg" alt="welcome" />
      <div class="welcome-page-content-welcome-cn">欢迎使用</div>
      <div class="welcome-page-content-welcome-en">Welcome</div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss">
  .welcome-page {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    position: relative;
    background-color: #3b3b3b;

    .welcome-page-content {
      margin-left: 58px;
      width: 754px;
      height: 621px;
    }
    .welcome-page-content-welcome-cn {
      position: fixed;
      top: 360px;
      // left: 935px;
      right: 77px;
      width: 128px;
      height: 39px;
      color: #eee;
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      font-family: Inter;
      font-size: 32px;
      font-style: italic;
      font-weight: 200;
      line-height: normal;
    }
    .welcome-page-content-welcome-en {
      position: fixed;
      top: 301px;
      // left: 722px;
      right: 124px;
      width: 136px;
      height: 39px;

      color: #eee;
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      font-family: Inter;
      font-size: 32px;
      font-style: italic;
      font-weight: 200;
      line-height: normal;
    }
  }
</style>
