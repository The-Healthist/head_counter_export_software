<template>
  <div ref="selectorWrapper" class="selector-wrapper">
    <!-- 主选择框 -->
    <!-- <div class="select-box"></div> -->
    <!-- 下拉选项 -->
    <div v-if="toilets.length > 0" class="exported-box">
      <div v-for="Toilet in toilets" :key="Toilet.uuid" class="exported-box-item">
        {{ Toilet.name }}
      </div>
    </div>
    <div v-else class="exported-box-item">Waiting for toilets...</div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue'

  interface Toilet {
    name: string
    uuid: string
  }

  defineProps<{
    toilets: Toilet[]
  }>()
</script>

<style scoped lang="scss">
  .selector-wrapper {
    position: relative;
    display: flex;
  }

  .exported-box {
    position: relative;
    top: 0;
    left: 0;
    width: 372px;
    max-height: 219px;
    padding: 10px 20px 10px 15px;
    border: 1px solid #ccc;
    background-color: #fff;
    overflow-y: auto;
    overflow-x: hidden;

    flex-direction: column;
    align-items: flex-start;
    white-space: nowrap;
    gap: 10px;

    border-radius: 3px 0px 0px 3px;
    border: 1px solid #ccc;
    z-index: 1;

    &::-webkit-scrollbar {
      width: 0px; /* 隐藏滚动条 */
    }

    .exported-box-item {
      display: flex;
      width: 100%;
      cursor: pointer; /* 隐藏溢出部分 */
      text-overflow: ellipsis; /* 显示省略号 */
      white-space: nowrap; /* 禁止换行 */
      margin-bottom: 10px;
      height: 22px;
      color: #888;
      font-family: Inter;
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
  }
</style>
