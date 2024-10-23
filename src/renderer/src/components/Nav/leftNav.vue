<template>
  <div
    :class="{
      'left-nav': true,
      'left-nav-nowelcome': currentRoute !== '/welcome' && currentRoute !== '/', //如果不是welcome页面
      'left-nav-welcome': currentRoute === '/welcome' || currentRoute === '/' //如果是welcome页面
    }"
  >
    <!-- <div
      :class="{
        'left-nav-item': true,
        'left-nav-item-active': currentRoute === '/devicesetup',
        'left-nav-item-inactive': currentRoute !== '/devicesetup' && currentRoute !== '/welcome',
        'left-nav-item-welcome': currentRoute === '/welcome'
      }"
      @click="navigateTo('/welcome')"
    >
      Welcome
    </div> -->
    <!-- deviceSetup -->
    <div
      :class="{
        'left-nav-item': true,
        'left-nav-item-active':
          currentRoute === '/deviceSetup' || currentRoute === '/deviceSetupBM',
        'left-nav-item-inactive':
          currentRoute !== '/deviceSetup' &&
          currentRoute !== '/deviceSetupBM' &&
          currentRoute !== '/welcome' &&
          currentRoute !== '/',
        'left-nav-item-welcome': currentRoute === '/welcome' || currentRoute === '/'
      }"
      @click="navigateTo('/deviceSetup')"
    >
      Device Setup
    </div>
    <!-- dataExport -->
    <div
      :class="{
        'left-nav-item': true,
        'left-nav-item-active': currentRoute === '/dataExport' || currentRoute === '/dataExportBM',
        'left-nav-item-inactive':
          currentRoute !== '/dataExport' &&
          currentRoute !== '/dataExportBM' &&
          currentRoute !== '/welcome' &&
          currentRoute !== '/',
        'left-nav-item-welcome': currentRoute === '/welcome' || currentRoute === '/'
      }"
      @click="navigateTo('/dataExport')"
    >
      Data Export
    </div>
    <!-- settings -->
    <div
      :class="{
        'left-nav-item': true,
        'left-nav-item-active': currentRoute === '/settings',
        'left-nav-item-inactive':
          currentRoute !== '/settings' && currentRoute !== '/welcome' && currentRoute !== '/',
        'left-nav-item-welcome': currentRoute === '/welcome' || currentRoute === '/'
      }"
      @click="navigateTo('/settings')"
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

  const navigateTo = (path: string) => {
    console.log(`Navigating to ${path}`)

    let modePath = ''
    // deviceSetup
    if (path.includes('deviceSetup')) {
      const mode = localStorage.getItem('deviceSetupMode')
      console.log('Device Setup Mode:', mode)
      modePath = mode === 'batch' ? '/deviceSetupBM' : '/deviceSetup'
    }
    // dataExport
    else if (path.includes('dataExport')) {
      const mode = localStorage.getItem('dataExportMode')
      console.log('Data Export Mode:', mode)
      modePath = mode === 'batch' ? '/dataExportBM' : '/dataExport'
    }

    // router goto
    if (modePath) {
      router.push(modePath)
    } else {
      // settings
      router.push(path)
    }
  }

  watch(
    () => router.currentRoute.value.path,
    (newPath) => {
      currentRoute.value = newPath
    }
  )
</script>

<style scoped lang="scss">
  //导航样式
  .left-nav-nowelcome {
    position: relative;
    width: 240px;
    height: 100%;
    background-color: rgba(204, 204, 204, 0.4);
  }
  .left-nav-welcome {
    position: relative;
    background-color: #3b3b3b;
    width: 240px;
    height: 100%;
  }
  .left-nav {
    position: relative; /* 添加定位属性 */
    display: flex;
    width: 240px;
    height: 100%;
    padding-left: 50px;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    gap: 10px;
    flex-shrink: 0; // 不收缩
    align-self: stretch; // 拉伸

    .left-nav-item {
      display: flex;
      height: 64px;
      padding: 33px 7px;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      position: relative; /* 添加定位属性 */
      z-index: 20; /* 设置默认层级 */
    }
  }
  .left-nav-item-active {
    position: relative; /* 添加定位属性 */
    color: #555;
    text-shadow: -4px 4px 4px rgba(0, 0, 0, 0.2);
    font-family: Inter;
    font-size: 20px;
    font-weight: 700;
    z-index: 30; /* 提高层级，确保覆盖背景 */
  }

  .left-nav-item-inactive {
    position: relative; /* 添加定位属性 */
    color: #555;
    text-shadow: -4px 4px 4px rgba(0, 0, 0, 0.2);
    font-family: Inter;
    font-size: 20px;
    font-weight: 700;
    z-index: 30;
    opacity: 0.5;
  }

  .left-nav-item-welcome {
    position: relative; /* 添加定位属性 */
    background-color: #3b3b3b;
    color: #eee;
    text-shadow: -4px 4px 4px rgba(0, 0, 0, 0.4);
    font-family: Inter;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    z-index: 30;
  }
</style>
