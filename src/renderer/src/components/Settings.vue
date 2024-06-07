<script setup lang="ts">
import { OpenAI_API_KEY, charPath, motionPath, showSettings } from '@renderer/hooks/useStates'
import { FolderAdd } from '@element-plus/icons-vue'
const dialogChar = () => {
  window.electron.ipcRenderer.send('dialog-char')
}
const dialogMotion = () => {
  window.electron.ipcRenderer.send('dialog-motion')
}
</script>

<template>
  <Transition appear>
    <el-card v-show="showSettings || charPath == undefined" class="settings">
      <el-row align="middle" justify="space-between">
        <el-col :span="8"> Char: </el-col>
        <el-col :span="16" align="center">
          <el-button @click="dialogChar">
            <span>{{ charPath.name }}</span>
            <el-icon style="margin-left: 8px"><FolderAdd /></el-icon>
          </el-button>
        </el-col>
      </el-row>

      <el-row align="middle" justify="space-between">
        <el-col :span="8"> Motion: </el-col>
        <el-col :span="16" align="center">
          <el-button @click="dialogMotion">
            <span>{{ motionPath.name }}</span>
            <el-icon style="margin-left: 8px"><FolderAdd /></el-icon>
          </el-button>
        </el-col>
      </el-row>

      <el-row align="middle" justify="space-between">
        <el-col :span="8"> OpenAI api key: </el-col>
        <el-col :span="16" align="center">
          <el-input v-model="OpenAI_API_KEY" size="small" />
        </el-col>
      </el-row>
    </el-card>
  </Transition>
</template>

<style scoped>
.settings {
  position: fixed;
  width: 80%;
  top: 8%;
  /* height: 30%; */
  opacity: 0.9;
  font-size: 0.85rem;
}
button {
  border: none;
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
