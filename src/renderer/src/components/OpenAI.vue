<template>
  <div v-if="OpenAI_API_KEY.length > 10">
    <el-card v-show="response != null" class="response">{{ response }} </el-card>
    <el-input
      v-model="prompt"
      class="prompt-bar"
      autofocus
      :suffix-icon="Top"
      @keyup.enter="send"
    />
  </div>
</template>

<script setup lang="ts">
import { Top } from '@element-plus/icons-vue'
import { useOpenAI } from '../hooks/useOpenAI'
import { OpenAI_API_KEY } from '../hooks/useStates'

const { prompt, send, response } = useOpenAI()
</script>

<style scoped>
.response {
  z-index: 2;
  position: absolute;
  top: 20%;
  left: 55%;
  width: 45%;
  max-height: 50%;
  overflow: auto;
  margin: 0px;
  background-color: rgba(0, 0, 0, 0.8);
  font-size: 0.85rem;
}
.prompt-bar {
  z-index: 2;
  position: absolute;
  bottom: 15%;
  left: 20%;
  width: 60%;
  background-color: rgba(0, 0, 0, 0.8);
  font-size: 0.85rem;
}
</style>
