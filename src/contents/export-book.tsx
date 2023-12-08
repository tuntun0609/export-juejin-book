import { StyleProvider } from '@ant-design/cssinjs'
import { Button, ConfigProvider, Popover } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import styleText from 'data-text:./index.module.scss'
import antdResetCssText from 'data-text:antd/dist/reset.css'
import type { PlasmoCSConfig, PlasmoGetShadowHostId } from 'plasmo'
import { useRef, useState } from 'react'
import Draggable, {
  type DraggableData,
  type DraggableEvent
} from 'react-draggable'

import { PopoverContent } from '~components/popover-content'
import { HOST_ID } from '~constants'

import * as styles from './index.module.scss'

export const config: PlasmoCSConfig = {
  matches: ['https://juejin.cn/book/*']
}

export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID

export const getStyle = () => {
  const style = document.createElement('style')
  style.textContent = styleText + antdResetCssText
  return style
}

const PromptHelper = () => {
  const isDragging = useRef(false)
  const [open, setOpen] = useState(false)
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  })
  const draggleRef = useRef<HTMLDivElement>(null)
  const curOpenState = useRef(false)

  const hide = () => {
    setOpen(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement
    const targetRect = draggleRef.current?.getBoundingClientRect()
    if (!targetRect) {
      return
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y)
    })

    if (open) {
      curOpenState.current = true
    } else {
      curOpenState.current = false
    }
  }

  const onStop = () => {
    setTimeout(() => (isDragging.current = false), 0)
    if (curOpenState.current) {
      setOpen(true)
    }
  }

  const onDrag = () => {
    if (open) {
      setOpen(false)
    }
    isDragging.current = true
  }

  return (
    <ConfigProvider locale={zhCN}>
      <StyleProvider container={document.getElementById(HOST_ID).shadowRoot}>
        <div>
          <Draggable
            handle="button"
            bounds={bounds}
            nodeRef={draggleRef}
            defaultPosition={{ x: 0, y: 0 }}
            onStart={(event, uiData) => onStart(event, uiData)}
            onDrag={onDrag}
            onStop={onStop}>
            <div className={styles.showBtn} ref={draggleRef}>
              <Popover
                placement="leftTop"
                content={<PopoverContent />}
                title={<div></div>}
                trigger="click"
                open={open}
                onOpenChange={() => {
                  if (!isDragging.current) {
                    handleOpenChange(!open)
                  }
                }}
                getPopupContainer={() =>
                  document
                    .getElementById(HOST_ID)
                    .shadowRoot.querySelector('#popoverContainer')
                }>
                <div id="popoverContainer" className={styles.popoverContainer}>
                  <Button>小册助手</Button>
                </div>
              </Popover>
            </div>
          </Draggable>
        </div>
      </StyleProvider>
    </ConfigProvider>
  )
}

export default PromptHelper
