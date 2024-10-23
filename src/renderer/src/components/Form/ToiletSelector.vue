<template>
  <div ref="selectorWrapper" class="selector-wrapper">
    <!-- 主选择框 -->
    <div class="select-box" @click="selectToilet">
      <FormSelectButton v-show="selectedToilet.name === ''">
        <template #form-select-button-label>Select Toilet...</template>
      </FormSelectButton>
      <div v-show="selectedToilet.name !== ''" class="form-normal-text">
        {{ selectedToilet.name }}
      </div>
      <img src="@renderer/assets/form/select.svg" alt="Select" />
    </div>

    <!-- 下拉选项 -->
    <div v-show="toilets.length > 0 && isShowToiletSelector" class="selects-box">
      <div
        v-for="toilet in toilets"
        :key="toilet.uuid"
        class="selects-box-item"
        @click="() => selectCurrentToilet(toilet)"
      >
        {{ toilet.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits, ref, onMounted, onBeforeUnmount } from 'vue'
  import FormSelectButton from '@renderer/components/Button/FormSelectButton.vue'

  const props = defineProps<{
    toilets: { name: string; uuid: string }[]
  }>()

  const emit = defineEmits<{
    (e: 'selectToilet'): void
    (e: 'selectCurrentToilet', toilet: { name: string; uuid: string }): void
  }>()

  const isShowToiletSelector = ref(false)
  const selectedToilet = ref<{ name: string; uuid: string }>({ name: '', uuid: '' })
  const selectorWrapper = ref<HTMLElement | null>(null)

  const selectToilet = () => {
    isShowToiletSelector.value = true
    emit('selectToilet')
  }

  const selectCurrentToilet = (toilet: { name: string; uuid: string }) => {
    selectedToilet.value = toilet
    isShowToiletSelector.value = false
    emit('selectCurrentToilet', toilet)
  }

  // Function to handle clicks outside the component
  const handleClickOutside = (event: MouseEvent) => {
    if (selectorWrapper.value && !selectorWrapper.value.contains(event.target as Node)) {
      isShowToiletSelector.value = false
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
