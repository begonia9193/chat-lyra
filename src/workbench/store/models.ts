import { Model } from '@/types/model'
import { getModels, OpenerRouterModel } from '@/apis/open-router/api'
import { create } from 'zustand'

interface ModelStore {
  models: Model[]
  defaultModel?: Model
  loading: boolean
  error: boolean
  init: () => Promise<void>
  setDefaultModel: (model: Model) => void
}

export const useModelStore = create<ModelStore>((set) => {
  return {
    defaultModel: undefined,
    models: [],
    loading: false,
    error: false,
    init: async () => {
      try {
        set({ loading: true, error: undefined })
        const response = await getModels()
        console.log(response)

        // 将OpenRouter模型数据转换为通用Model格式
        const models: Model[] = response.data.map((model: OpenerRouterModel) => ({
          id: model.id,
          name: model.name,
          description: model.description,
          context_length: model.context_length,
          pricing: {
            input: Number(model.pricing.prompt),
            output: Number(model.pricing.completion),
            image: model.pricing.image ? Number(model.pricing.image) : undefined,
          },
          input_modalities: model.architecture.input_modalities,
          output_modalities: model.architecture.output_modalities,
        }))

        set({ models, defaultModel: models[0], error: false, loading: false })
      } catch (error) {
        set({
          error: true,
          loading: false
        })
      }
    },
    setDefaultModel: (model: Model) => {
      set({ defaultModel: model })
    }
  }
}) 