<template>
  <transition name="fade">
    <div v-if="modelValue" class="dialog-overlay">
      <div class="dialog-content">
        <div class="content-title">NO DEVICE DETECTED</div>
        <div class="content-button" @click="confirm">CONFIRM</div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue'
  defineProps({
    modelValue: {
      type: Boolean,
      required: true
    }
  })

  const emit = defineEmits(['update:modelValue'])

  function confirm() {
    emit('update:modelValue', false)
  }
</script>

<style scoped>
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .dialog-content {
    border: 1px solid #000;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 240px;
    width: 532px;
    padding: 18px 47px;
    box-sizing: border-box;
  }

  .content-title {
    color: #000;
    text-align: center;
    font-family: Inter;
    font-size: 24px;
    font-weight: 700;
    line-height: 32px;
    margin-bottom: 16px; /* Adjust spacing between title and button */
  }

  .content-button {
    border: 2px solid #555;
    background: #555;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 196px;
    height: 40px;
    cursor: pointer;
    user-select: none; /* Prevent text selection */
  }
</style>
