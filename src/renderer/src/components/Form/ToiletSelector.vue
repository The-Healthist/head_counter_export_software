```vue
<template>
  <div v-if="toilets.length <= 0" class="select-box" @click="selectToilet">
    <FormSelectButton>
      <template #form-select-button-label>Select Toilet...</template>
    </FormSelectButton>
    <img src="@renderer/assets/form/select.svg" alt="Select" />
  </div>
  <div v-else class="select-box selects-box">
    <div
      v-for="toilet in toilets"
      :key="toilet"
      class="selects-box-item"
      @click="() => selectCurrentToilet(toilet)"
    >
      {{ toilet }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue'
  import FormSelectButton from '@renderer/components/Button/FormSelectButton.vue'

  const props = defineProps<{
    toilets: string[]
  }>()

  const emit = defineEmits<{
    (e: 'selectToilet'): void
    (e: 'selectCurrentToilet', toilet: string): void
  }>()

  const selectToilet = () => {
    emit('selectToilet')
  }

  const selectCurrentToilet = (toilet: string) => {
    emit('selectCurrentToilet', toilet)
  }
</script>

<style scoped lang="scss">
  .select-box {
    display: flex;
    width: 372px;
    height: 38px;
    padding: 10px 20px 10px 15px;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border-radius: 3px;
    cursor: pointer;
    img {
      cursor: pointer;
    }

    &.selects-box {
      position: relative;
      border: 1px solid #ccc;
      overflow-y: auto;
      overflow-x: hidden;
      height: 219px;
      padding: 10px 20px 10px 0;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      width: 372px;
      border-radius: 3px 0 0 3px;

      &::-webkit-scrollbar {
        width: 0px; /* 滚动条宽度设置为0，确保滚动条不显示 */
      }

      &::-webkit-scrollbar-track {
        background: transparent; /* 将轨道背景设置为透明 */
      }

      &::-webkit-scrollbar-thumb {
        background-color: transparent; /* 将滑块颜色设置为透明 */
      }

      &::-webkit-scrollbar-thumb:hover {
        background-color: transparent; /* 将滑块悬停颜色设置为透明 */
      }

      .selects-box-item {
        display: flex;
        width: 120%;
        padding-left: 15px;
        cursor: pointer;
        &:hover {
          background-color: #eee;
        }
        white-space: nowrap;
        color: #333;
        font-family: Inter;
        font-size: 18px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
    }
  }
</style>
