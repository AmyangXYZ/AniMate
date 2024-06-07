<script setup lang="ts">
import { charPath, showMenuBar, showSettings } from '@renderer/hooks/useStates'
import { Setting, Minus, FullScreen, Close } from '@element-plus/icons-vue'

const minimize = () => {
  window.electron.ipcRenderer.send('minimize')
}
const fullscreen = () => {
  window.electron.ipcRenderer.send('fullscreen')
}
const quit = () => {
  window.electron.ipcRenderer.send('quit')
}
</script>

<template>
  <div class="wrap" @mouseenter="showMenuBar = true">
    <Transition appear>
      <div v-show="showMenuBar || charPath == undefined" class="menu-bar">
        <el-row align="middle" justify="space-between">
          <el-col :span="8">
            <el-button
              style="margin-left: 3px"
              :icon="Setting"
              @click="showSettings = !showSettings"
            />
          </el-col>
          <el-col :span="8" align="center"> AniMate </el-col>
          <el-col :span="8" align="end">
            <el-button-group>
              <el-button :icon="Minus" size="small" @click="minimize" />
              <el-button :icon="FullScreen" size="small" @click="fullscreen" />
              <el-button :icon="Close" size="small" style="margin-right: 3px" @click="quit" />
            </el-button-group>
          </el-col>
        </el-row>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.wrap {
  position: absolute;
  top: 0;
  width: 85%;
  height: 28px;
}
.menu-bar {
  width: 100%;
  height: 100%;
  font-size: 0.95rem;
  background-color: rgb(34, 35, 39);
  -webkit-app-region: drag;
  border-radius: 12px;
}
button {
  border: none;
  background-color: transparent;
  width: 20px;
  height: 24px;
  -webkit-app-region: no-drag;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
