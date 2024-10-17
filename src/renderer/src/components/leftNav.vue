<template>
  <div class="left-nav">
    <div
      :class="{
        'left-nav-item': true,
        'left-nav-item-active': currentRoute === '/devicesetup',
        'left-nav-item-inactive': currentRoute !== '/devicesetup' && currentRoute !== '/',
        'left-nav-item-welcome': currentRoute === '/'
      }"
    >
      Device Setup
    </div>
    <div
      :class="{
        'left-nav-item': true,
        'left-nav-item-active': currentRoute === '/dataexport',
        'left-nav-item-inactive': currentRoute !== '/dataexport' && currentRoute !== '/',
        'left-nav-item-welcome': currentRoute === '/'
      }"
    >
      Data Export
    </div>
    <div
      :class="{
        'left-nav-item': true,
        'left-nav-item-active': currentRoute === '/settings',
        'left-nav-item-inactive': currentRoute !== '/settings' && currentRoute !== '/',
        'left-nav-item-welcome': currentRoute === '/'
      }"
    >
      Settings
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { ref, watch } from 'vue'

  const router = useRouter()
  const currentRoute = ref(router.currentRoute.value.path)

  watch(
    () => router.currentRoute.value.path,
    (newPath) => {
      currentRoute.value = newPath
    }
  )
</script>

<style scoped lang="scss">
  .left-nav {
    display: flex;
    width: 240px;
    height: 100%;
    padding-left: 50px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    align-self: stretch;
    .left-nav-item {
      display: flex;
      height: 64px;
      padding: 33px 7px;
      align-items: center;
      gap: 10px;
      align-self: stretch;
    }
    .left-nav-item-active {
      color: #555;
      text-shadow: -4px 4px 4px rgba(0, 0, 0, 0.2);
      font-family: Inter;
      font-size: 20px;
      font-weight: 700;
    }

    .left-nav-item-inactive {
      color: #555;
      text-shadow: -4px 4px 4px rgba(0, 0, 0, 0.2);
      font-family: Inter;
      font-size: 20px;
      font-weight: 700;
      opacity: 0.5;
    }

    .left-nav-item-welcome {
      color: #eee;
      text-shadow: -4px 4px 4px rgba(0, 0, 0, 0.4);
      font-family: Inter;
      font-size: 20px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
  }
</style>
