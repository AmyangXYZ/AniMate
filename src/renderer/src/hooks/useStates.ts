import { ref } from 'vue'
export const showMenuBar = ref(false)
export const showSettings = ref(false)
export const Chars = [
  'Thoth',
  'Thoth2',
  'Bastet',
  'Hades',
  'Gengchen',
  'Yingzhao',
  'Lingguang',
  'Sekhmet',
  'Jin-ei',
  'Hera'
]
export const Motions = ['Miku', 'Zyy', 'Stand', 'iKun1', 'iKun2', 'Run']

export const SelectedChar = ref('Thoth')
export const SelectedMotion = ref('Stand')
export const OpenAI_API_KEY = ref('')
