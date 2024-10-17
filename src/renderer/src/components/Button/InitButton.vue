<template>
  <div class="init-button">
    <slot name="label"></slot>
  </div>
</template>

<style scoped>
  .init-button {
    display: flex;
    width: 184px;
    height: 40px;
    padding: 23px 30px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border: 2px solid #333;

    color: #333;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
</style>
