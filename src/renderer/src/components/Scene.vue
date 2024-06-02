<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useScene } from '../hooks/useScene'
import { showMenuBar, showSettings } from '@renderer/hooks/useStates'

const canvas = ref()
onMounted(() => {
  useScene(canvas.value)
})

const hover = () => {
  if (!showSettings.value) showMenuBar.value = false
}
const click = () => {
  showSettings.value = false
  showMenuBar.value = false
}
</script>

<template>
  <canvas ref="canvas" class="scene" @mouseover="hover" @click="click" />
</template>

<style scoped>
.scene {
  width: 100%;
  height: 100vh;
}
</style>
