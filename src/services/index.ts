const baseUrl = 'https://api.juejin.cn/booklet_api/v1'

export const getBookletSections = async (bookId: string) => {
  const response = await fetch(`${baseUrl}/booklet/get`, {
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ booklet_id: bookId }),
    method: 'POST',
    credentials: 'include'
  })
  const { data } = await response.json()
  return {
    title: data.booklet.base_info.title,
    sections: data.sections.map((item) => ({
      sectionId: item.section_id,
      status: item.status,
      title: item.title
    }))
  }
}

export const getSection = async (sectionId: string) => {
  const response = await fetch(
    'https://api.juejin.cn/booklet_api/v1/section/get',
    {
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ section_id: sectionId }),
      method: 'POST',
      credentials: 'include'
    }
  )
  const { data } = await response.json()
  return data.section
}
