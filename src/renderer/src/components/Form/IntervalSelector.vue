<template>
  <div class="Interval-selector-wrapper" ref="selectorWrapper">
    <!-- 主选择框 -->
    <div class="select-box" @click="selectInterval">
      <FormSelectButton v-show="selectedInterval === ''">
        <template #form-select-button-label>Select Interval...</template>
      </FormSelectButton>
      <div v-show="selectedInterval !== ''" class="form-normal-text">{{ selectedInterval }}</div>
      <img src="@renderer/assets/form/select.svg" alt="Select" />
    </div>

    <!-- 下拉选项 -->
    <div v-show="Intervals.length > 0 && isShowIntervalSelector" class="selects-box">
      <div
        v-for="Interval in Intervals"
        :key="Interval"
        class="selects-box-item"
        @click="() => selectCurrentInterval(Interval)"
      >
        {{ Interval }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits, ref, onMounted, onBeforeUnmount } from 'vue'
  import FormSelectButton from '@renderer/components/Button/FormSelectButton.vue'

  const props = defineProps<{
    Intervals: string[]
  }>()

  const emit = defineEmits<{
    (e: 'selectInterval'): void
    (e: 'selectCurrentInterval', Interval: string): void
  }>()

  const isShowIntervalSelector = ref(false)
  const selectedInterval = ref('')

  const selectorWrapper = ref<HTMLElement | null>(null)

  const selectInterval = () => {
    isShowIntervalSelector.value = true
    emit('selectInterval')
  }

  const selectCurrentInterval = (Interval: string) => {
    selectedInterval.value = Interval
    isShowIntervalSelector.value = false
    emit('selectCurrentInterval', Interval)
  }

  // Function to handle clicks outside the component
  const handleClickOutside = (event: MouseEvent) => {
    if (selectorWrapper.value && !selectorWrapper.value.contains(event.target as Node)) {
      isShowIntervalSelector.value = false
    }
  }

  // Add event listener on mount and remove on unmount
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
</script>

<style scoped lang="scss">
  /* 通用文本样式 */
  .form-normal-text {
    overflow-x: hidden;
    white-space: nowrap;
    color: #333;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .Interval-selector-wrapper {
    position: relative;
    display: inline-block;
  }

  .select-box {
    display: flex;
    width: 372px;
    height: 38px;
    padding: 10px 0px 10px 15px;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border-radius: 3px;
    cursor: pointer;
    background-color: #fff;
    position: relative;
    z-index: 1;
    white-space: nowrap;

    img {
      cursor: pointer;
    }
  }

  .selects-box {
    position: absolute;
    top: 100%;
    left: 0;
    width: 372px;
    max-height: 219px;
    border: 1px solid #ccc;
    background-color: #fff;
    overflow-y: auto;
    overflow-x: hidden;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    border-radius: 0 0 3px 3px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;

    &::-webkit-scrollbar {
      width: 0px; /* 隐藏滚动条 */
    }

    .selects-box-item {
      display: flex;
      width: 100%;
      padding: 10px 15px;
      cursor: pointer;
      &:hover {
        background-color: #eee;
      }
      white-space: nowrap;
      color: #333;
      font-family: Inter, sans-serif;
      font-size: 16px;
      font-weight: 400;
      line-height: normal;
    }
  }
</style>
