<template>
  <div ref="selectorWrapper" class="selector-wrapper">
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
