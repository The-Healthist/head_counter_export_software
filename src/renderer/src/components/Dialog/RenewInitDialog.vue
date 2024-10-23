<template>
  <transition name="fade">
    <div v-if="modelValue" class="dialog-overlay">
      <div class="dialog-content">
        <div class="content-title">
          THERE’S DATA ON SELECTED NOT FOUND ON DISK CONTINUE REINITIALIZE?
        </div>
        <div class="content-buttons">
          <div class="can-button" @click="confirm">CANCEL</div>
          <div class="confirm-button" @click="confirm">CONFIRM</div>
        </div>
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
    display: flex;
    width: 532px;
    height: 202px;
    padding: 18px 47px;
    margin-top: 100px;
    margin-left: 240px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    border: 1px solid #000;
    background: #fff;
  }

  .content-title {
    align-self: stretch;
    color: #000;
    text-align: center;
    font-family: Inter;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 32px; /* 133.333% */
  }

  .content-buttons {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;

    .can-button {
      border: 2px solid #555;
      display: flex;
      width: 185px;
      height: 40px;
      padding: 23px 30px;
      justify-content: center;
      align-items: center;
      gap: 10px;
      cursor: pointer;

      color: #555;
      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
    .confirm-button {
      display: flex;
      width: 93px;
      height: 40px;
      padding: 23px 30px;
      justify-content: center;
      align-items: center;
      gap: 10px;
      border: 2px solid #555;
      background: #555;
      cursor: pointer;
    }
  }
</style>
