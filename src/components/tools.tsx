import { Button, message, Space, Switch } from 'antd'
import html2canvas from 'html2canvas'
import { useContext, useEffect, useMemo } from 'react'

import { Storage } from '@plasmohq/storage'
import { useStorage } from '@plasmohq/storage/hook'

import { HOST_ID } from '~constants'
import type { BookSectionsItem } from '~types'
import { useBook } from '~utils/useBook'

import { MoonIcon, SunIcon } from './icon'
import { uiContext } from './ui-context'

interface Props {
  bookSections?: BookSectionsItem[]
  className?: string
}

const exportPdfMessageKey = 'exportPdf'

export const Tools = ({ className = '', bookSections }: Props) => {
  const { setUiConfig } = useContext(uiContext)
  const { sectionId } = useBook()
  const [messageApi, contextHolder] = message.useMessage({
    getContainer: () =>
      document
        .getElementById(HOST_ID)
        .shadowRoot.querySelector('#plasmo-shadow-container')
  })
  const [theme, setTheme] = useStorage(
    {
      key: 'theme',
      instance: new Storage({
        area: 'local'
      })
    },
    'light'
  )

  const sectionTitle = useMemo(() => {
    return bookSections?.find((item) => item.sectionId === sectionId)?.title
  }, [sectionId, bookSections])

  const onBatchExport = () => {
    setUiConfig((draft) => {
      draft.isBatchExportModalOpen = true
    })
  }

  const exportPdf = () => {
    messageApi.loading({
      key: exportPdfMessageKey,
      content: '正在导出...',
      duration: 0
    })
    setTimeout(() => {
      // todo 优化html2canvas导出时阻塞dom渲染的问题
      html2canvas(document.querySelector('.article-content'), {
        allowTaint: true,
        useCORS: true,
        logging: false
      }).then((canvas) => {
        // canvas转图片并下载，并在现有内容外围增加空白边框
        const padding = 20
        const ctx = canvas.getContext('2d')
        const w = canvas.width
        const h = canvas.height
        const imgData = ctx.getImageData(0, 0, w, h)
        canvas.width = w + padding * 2
        canvas.height = h + padding * 2
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.putImageData(imgData, padding, padding)
        const a = document.createElement('a')
        a.href = canvas.toDataURL('image/png')
        a.download = `${sectionTitle}.png`
        a.click()
        messageApi.open({
          key: exportPdfMessageKey,
          type: 'success',
          content: '加载完成',
          duration: 2
        })
      })
    }, 500)
  }

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className={className}>
      <Space>
        {contextHolder}
        <Button onClick={onBatchExport}>批量导出</Button>
        {sectionId && <Button onClick={exportPdf}>导出本章png</Button>}
      </Space>
      <Space>
        <Switch
          checkedChildren={<SunIcon />}
          unCheckedChildren={<MoonIcon />}
          value={theme === 'light'}
          onChange={(checked) => {
            setTheme(checked ? 'light' : 'dark')
          }}
        />
      </Space>
    </div>
  )
}
