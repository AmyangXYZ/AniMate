<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useScene } from '../hooks/useScene.ts'

const canvas = ref()
onMounted(() => {
  useScene(canvas.value)
})
</script>

<template>
  <canvas ref="canvas" class="scene" />
</template>

<style scoped>
.scene {
  width: 100%;
  height: 100vh;
}
</style>
