import { createContext } from 'react'
import type { Updater } from 'use-immer'

export const uiContext = createContext<{
  uiConfig?: UiConfig
  setUiConfig?: Updater<UiConfig>
}>({})

export interface UiConfig {
  isBatchExportModalOpen?: boolean
}
