<template>
  <div class="selector-wrapper" ref="selectorWrapper">
    <!-- 主选择框 -->
    <div class="select-box" @click="selectMonth">
      <FormSelectButton v-show="selectedMonth === ''">
        <template #form-select-button-label>Select Month...</template>
      </FormSelectButton>
      <div v-show="selectedMonth !== ''" class="form-normal-text">{{ selectedMonth }}</div>
      <img src="@renderer/assets/form/select.svg" alt="Select" />
    </div>

    <!-- 下拉选项 -->
    <div v-show="Months.length > 0 && isShowMonthSelector" class="selects-box">
      <div
        v-for="Month in Months"
        :key="Month"
        class="selects-box-item"
        @click="() => selectCurrentMonth(Month)"
      >
        {{ Month }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits, ref, onMounted, onBeforeUnmount } from 'vue'
  import FormSelectButton from '@renderer/components/Button/FormSelectButton.vue'

  const props = defineProps<{
    Months: string[]
  }>()

  const emit = defineEmits<{
    (e: 'selectMonth'): void
    (e: 'selectCurrentMonth', Month: string): void
  }>()

  const isShowMonthSelector = ref(false)
  const selectedMonth = ref('')

  const selectorWrapper = ref<HTMLElement | null>(null)

  const selectMonth = () => {
    isShowMonthSelector.value = true
    emit('selectMonth')
  }

  const selectCurrentMonth = (Month: string) => {
    selectedMonth.value = Month
    isShowMonthSelector.value = false
    emit('selectCurrentMonth', Month)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (selectorWrapper.value && !selectorWrapper.value.contains(event.target as Node)) {
      isShowMonthSelector.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
</script>
