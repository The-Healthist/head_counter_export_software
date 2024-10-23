<!-- <template>
  <div ref="selectorWrapper" class="selector-wrapper"> -->
<!-- 主选择框 -->
<!-- <div class="select-box" @click="toggleDropdown">
      <div v-if="selectedToilets.length === 0">
        <FormSelectButton>
          <template #form-select-button-label>Select Toilets...</template>
        </FormSelectButton>
      </div>
      <div v-else class="form-normal-text">
        {{ selectedToilets.map((toilet) => toilet.name).join(', ') }}
      </div>
      <img src="@renderer/assets/form/select.svg" alt="Select" />
    </div> -->

<!-- 下拉选项 -->
<!-- <div v-show="toilets.length > 0 && isShowToiletSelector" class="selects-box">
      <div
        v-for="toilet in toilets"
        :key="toilet.uuid"
        :class="['selects-box-item', { selected: isSelected(toilet) }]"
        @click="() => toggleSelectToilet(toilet)"
      >
        {{ toilet.name }}
      </div>
    </div>
  </div> -->
<!-- </template> -->

<!-- <script setup lang="ts">
  import { defineProps, defineEmits, ref, onMounted, onBeforeUnmount } from 'vue'
  import FormSelectButton from '@renderer/components/Button/FormSelectButton.vue'

  const props = defineProps<{
    toilets: { name: string; uuid: string }[]
  }>()

  const emit = defineEmits<{
    (e: 'selectToilet'): void
    (e: 'selectCurrentToilets', toilets: string[]): void
  }>()

  const isShowToiletSelector = ref(false)
  const selectedToilets = ref<{ name: string; uuid: string }[]>([])
  const selectorWrapper = ref<HTMLElement | null>(null)

  const toggleDropdown = () => {
    isShowToiletSelector.value = !isShowToiletSelector.value
    emit('selectToilet')
  }

  const toggleSelectToilet = (toilet: { name: string; uuid: string }) => {
    const index = selectedToilets.value.findIndex((selected) => selected.uuid === toilet.uuid)
    if (index === -1) {
      selectedToilets.value.push(toilet)
    } else {
      selectedToilets.value.splice(index, 1)
    }
    emit(
      'selectCurrentToilets',
      selectedToilets.value.map((toilet) => toilet.uuid)
    )
    // isShowToiletSelector.value = false // 关闭下拉框
    console.log('selectedToilets', selectedToilets.value)
  }

  const isSelected = (toilet: { name: string; uuid: string }) => {
    return selectedToilets.value.some((selected) => selected.uuid === toilet.uuid)
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
</script> -->

<!-- <style scoped lang="scss">
  .selects-box-item.selected {
    background-color: #dcdcdc;
    font-weight: bold;
  }

  .selects-box-item.selected::after {
    content: '✔';
    position: absolute;
    right: 15px;
    color: #535c66;
  }

  .selector-wrapper {
    position: relative;
    display: inline-block;
  }
  .selects-box {
    width: 100%;
  }
</style> -->
<!-- 多选框 -->
