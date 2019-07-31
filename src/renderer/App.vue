<template>
  <div id="app">
    <!-- <landing-page></landing-page> -->
    <setting-page></setting-page>
  </div>
</template>

<script>
import LandingPage from '@/components/LandingPage'
import SettingPage from '@/layouts/SettingPage'

export default {
  name: 'electron-vue-test',
  components: {
    LandingPage,
    SettingPage
  }
}
</script>

<style>
/* CSS */
</style>
