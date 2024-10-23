<template>
  <div ref="selectorWrapper" class="selector-wrapper">
    <!-- 主选择框 -->
    <div class="select-box" @click="toggleDropdown">
      <div v-if="selectedToilets.length === 0">
        <FormSelectButton>
          <template #form-select-button-label>Select Toilets...</template>
        </FormSelectButton>
      </div>
      <div v-else class="form-normal-text">
        {{ selectedToilets.join(', ') }}
      </div>
      <img src="@renderer/assets/form/select.svg" alt="Select" />
    </div>

    <!-- 下拉选项 -->
    <div v-show="toilets.length > 0 && isShowToiletSelector" class="selects-box">
      <div
        v-for="toilet in toilets"
        :key="toilet"
        :class="['selects-box-item', { selected: isSelected(toilet) }]"
        @click="() => toggleSelectToilet(toilet)"
      >
        {{ toilet }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits, ref, onMounted, onBeforeUnmount } from 'vue'
  import FormSelectButton from '@renderer/components/Button/FormSelectButton.vue'

  const props = defineProps<{
    toilets: string[]
  }>()

  const emit = defineEmits<{
    (e: 'selectToilet'): void
    (e: 'selectCurrentToilets', toilets: string[]): void
  }>()

  const isShowToiletSelector = ref(false)
  const selectedToilets = ref<string[]>([])
  const selectorWrapper = ref<HTMLElement | null>(null)

  const toggleDropdown = () => {
    isShowToiletSelector.value = !isShowToiletSelector.value
    emit('selectToilet')
  }

  const toggleSelectToilet = (toilet: string) => {
    const index = selectedToilets.value.indexOf(toilet)
    if (index === -1) {
      selectedToilets.value.push(toilet)
    } else {
      selectedToilets.value.splice(index, 1)
    }
    emit('selectCurrentToilets', [...selectedToilets.value])
    isShowToiletSelector.value = false // 关闭下拉框
    console.log('selectedToilets', selectedToilets.value)
  }

  const isSelected = (toilet: string) => {
    return selectedToilets.value.includes(toilet)
  }

  // 处理点击外部关闭下拉框
  const handleClickOutside = (event: MouseEvent) => {
    if (selectorWrapper.value && !selectorWrapper.value.contains(event.target as Node)) {
      isShowToiletSelector.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
</script>

<style scoped lang="scss">
  /* 添加选中项的样式 */
  .selects-box-item.selected {
    background-color: #dcdcdc;
    font-weight: bold;
  }

  /* 可选：添加勾选标记 */
  .selects-box-item.selected::after {
    content: '✔';
    position: absolute;
    right: 15px;
    color: #007bff;
  }

  /* 确保父元素定位为相对，以便绝对定位的下拉框正确显示 */
  .selector-wrapper {
    position: relative;
    display: inline-block;
  }

  /* 调整下拉选项的相对位置以适应选择框的宽度 */
  .selects-box {
    width: 100%;
  }
</style>
