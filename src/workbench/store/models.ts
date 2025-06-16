import { Model } from '@/types/model'
import { create } from 'zustand'

interface ModelStore {
  models: Model[]
  defaultModel?: Model
}

export const useModelStore = create<ModelStore>(() => {
  return {
    defaultModel: undefined,
    models: [],
    init() {
      
    }
  }
}) 