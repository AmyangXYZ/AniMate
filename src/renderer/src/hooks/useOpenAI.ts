import OpenAI from 'openai'
import { ref } from 'vue'
import { OpenAI_API_KEY } from './useStates'

export function useOpenAI() {
  let openai: OpenAI

  const prompt = ref('')
  const response = ref<string | null>(null)
  const send = async () => {
    if (openai == undefined) {
      openai = new OpenAI({
        apiKey: OpenAI_API_KEY.value,
        dangerouslyAllowBrowser: true
      })
    }
    response.value = ''
    const timer = setInterval(() => {
      response.value += '.'
    }, 150)

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: prompt.value }],
      model: 'gpt-4o'
    })
    prompt.value = ''

    clearInterval(timer)
    response.value = completion.choices[0].message.content
  }
  return { prompt, send, response }
}
