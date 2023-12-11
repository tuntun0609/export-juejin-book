import { Button } from 'antd'
import { useContext } from 'react'

import { uiContext } from './ui-context'

interface Props {
  className?: string
}

export const Tools = ({ className = '' }: Props) => {
  const { setUiConfig } = useContext(uiContext)

  const onBatchExport = () => {
    setUiConfig((draft) => {
      draft.isBatchExportModalOpen = true
    })
  }

  return (
    <div className={className}>
      <Button onClick={onBatchExport}>批量导出</Button>
    </div>
  )
}
