import { ref } from 'vue'
export const showMenuBar = ref(false)
export const showSettings = ref(false)

interface path {
  dir: string
  name: string
}
export const charPath = ref<path>({ dir: './chars/Thoth/', name: 'Thoth.pmx' })
export const motionPath = ref<path>({ dir: './motions/', name: 'Stand.vmd' })
export const OpenAI_API_KEY = ref('')
