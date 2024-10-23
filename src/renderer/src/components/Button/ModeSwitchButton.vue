<template>
  <div class="batch-mode">
    <slot name="batch-mode-text"></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
  .batch-mode {
    position: absolute;
    left: 25px;
    top: 5px;

    display: flex;
    width: 113px;
    height: 27px;
    padding: 23px 30px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    white-space: nowrap;

    color: #333;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-decoration-line: underline;

    /* 添加更多样式 */
  }
</style>
