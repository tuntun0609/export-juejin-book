import { List, message, Tooltip, Typography } from 'antd'
import React, { useEffect, useState } from 'react'

import { HOST_ID } from '~constants'
import { getBookletSections, getSection } from '~services'
import { BookSectionStatus, type BookSectionsItem } from '~types'
import { saveMarkdown } from '~utils/file'
import { useBook } from '~utils/useBook'

import styles from '../contents/index.module.scss'

export const PopoverContent = () => {
  const { bookId } = useBook()
  const [bookSections, setBookSections] = useState<BookSectionsItem[]>([])

  const exportSections = (data: BookSectionsItem) => {
    getSection(data.sectionId)
      .then((res) => {
        saveMarkdown(res.markdown_show, data.title)
      })
      .catch(() => {
        message.error('导出失败')
      })
  }

  useEffect(() => {
    getBookletSections(bookId)
      .then((res) => {
        setBookSections(res)
      })
      .catch(() => {
        message.error('获取章节列表失败')
      })
  }, [])

  return (
    <div className={styles.popoverContent}>
      <List
        dataSource={bookSections}
        renderItem={(item: BookSectionsItem, index) => {
          return (
            <List.Item
              key={item.sectionId}
              actions={[
                <Tooltip
                  getPopupContainer={() =>
                    document
                      .getElementById(HOST_ID)
                      .shadowRoot.querySelector('#popoverContainer')
                  }
                  title={
                    item.status === BookSectionStatus.NotStarted ? '写作中' : ''
                  }>
                  <Typography.Link
                    disabled={item.status === BookSectionStatus.NotStarted}
                    onClick={() => {
                      exportSections(item)
                    }}>
                    导出md
                  </Typography.Link>
                </Tooltip>
              ]}>
              <List.Item.Meta title={`${index + 1}. ${item.title}`} />
            </List.Item>
          )
        }}></List>
    </div>
  )
}
