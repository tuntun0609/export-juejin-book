import { Modal, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import FileSaver from 'file-saver'
import JSZip from 'jszip'
import { useContext, useState } from 'react'

import { HOST_ID } from '~constants'
import { getSection } from '~services'
import { BookSectionStatus, type BookSectionsItem } from '~types'

import { uiContext } from './ui-context'

interface Props {
  bookSections?: BookSectionsItem[]
  bookTitle?: string
}

export const BatchExportModal = (props: Props) => {
  const { bookSections, bookTitle } = props
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const { uiConfig, setUiConfig } = useContext(uiContext)
  const [loading, setLoading] = useState(false)
  const [finishSectionsNum, setFinishSectionsNum] = useState(0)

  const onCancel = () => {
    setUiConfig((draft) => {
      draft.isBatchExportModalOpen = false
    })
  }

  const onExport = async () => {
    setLoading(true)
    const selectedSections = bookSections.filter((item) =>
      selectedRowKeys.includes(item.sectionId)
    )
    const zip = new JSZip()

    for (let index = 0; index < selectedSections.length; index++) {
      const item = selectedSections[index]
      const res = await getSection(item.sectionId)
      setFinishSectionsNum(() => index + 1)
      zip.file(`${item.title}.md`, res.markdown_show)
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      const fileName = bookTitle
        ? `${bookTitle}.zip`
        : `整合共${selectedSections.length}.zip`
      FileSaver(content, fileName)
      setLoading(false)
      setFinishSectionsNum(() => 0)
    })
  }

  const columns: ColumnsType<BookSectionsItem> = [
    {
      title: '章节名称',
      dataIndex: 'title'
    }
  ]

  const rowSelection = {
    onSelect: (record: BookSectionsItem, selected: boolean) => {
      if (selected) {
        setSelectedRowKeys([...selectedRowKeys, record.sectionId])
      } else {
        setSelectedRowKeys(
          selectedRowKeys.filter((item) => item !== record.sectionId)
        )
      }
    },
    getCheckboxProps: (record: BookSectionsItem) => ({
      disabled: record.status !== BookSectionStatus.Started
    }),
    onSelectAll: (selected: boolean) => {
      if (selected) {
        setSelectedRowKeys(
          bookSections
            .filter((item) => item.status === BookSectionStatus.Started)
            .map((item) => item.sectionId)
        )
      } else {
        setSelectedRowKeys([])
      }
    }
  }

  return (
    <Modal
      width={'70vw'}
      open={uiConfig.isBatchExportModalOpen}
      title="批量导出"
      okText="导出"
      afterOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelectedRowKeys([])
        }
      }}
      onCancel={onCancel}
      onOk={onExport}
      getContainer={() =>
        document
          .getElementById(HOST_ID)
          .shadowRoot.querySelector('#plasmo-overlay-0')
      }>
      <Table
        loading={{
          spinning: loading,
          tip: `已加载 ${finishSectionsNum} 章，共 ${selectedRowKeys.length} 章`
        }}
        rowKey="sectionId"
        columns={columns}
        dataSource={bookSections}
        pagination={{
          showTotal: () => `选中 ${selectedRowKeys.length} 章`
        }}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          ...rowSelection
        }}
      />
    </Modal>
  )
}
