<script setup lang="ts">
import {
  Chars,
  Motions,
  OpenAI_API_KEY,
  SelectedChar,
  SelectedMotion,
  showSettings
} from '@renderer/hooks/useStates'
</script>

<template>
  <el-card v-show="showSettings" class="settings">
    <el-row align="middle" justify="space-between">
      <el-col :span="8"> Char: </el-col>
      <el-col :span="16" align="center">
        <el-select v-model="SelectedChar" style="width: 80px">
          <el-option v-for="item in Chars" :key="item" :label="item" :value="item" />
        </el-select>
      </el-col>
    </el-row>

    <el-row align="middle" justify="space-between">
      <el-col :span="8"> Motion: </el-col>
      <el-col :span="16" align="center">
        <el-select v-model="SelectedMotion" style="width: 80px">
          <el-option v-for="item in Motions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-col>
    </el-row>

    <el-row align="middle" justify="space-between">
      <el-col :span="8"> OpenAI api key: </el-col>
      <el-col :span="16" align="center">
        <el-input v-model="OpenAI_API_KEY" size="small" />
      </el-col>
    </el-row>
  </el-card>
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
</style>
