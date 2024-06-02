<script setup lang="ts">
import { ref } from 'vue'
const show = ref(false)
</script>

<template>
  <div class="menu-bar" @mouseover="show = true" @mouseleave="show = false">
    <el-row v-show="show" justify="center">
      <el-col :span="5">
        <el-button id="drag">+</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.menu-bar {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 20px;
  z-index: 999;
}
#drag {
  z-index: 999;
  -webkit-app-region: drag;
}
</style>
