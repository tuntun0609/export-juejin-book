export const saveMarkdown = (content: string, name: string) => {
  const blob = new Blob([content], { type: 'text/plain' })
  const a = document.createElement('a')
  a.download = `${name}.md`
  a.href = URL.createObjectURL(blob)
  a.click()
  URL.revokeObjectURL(a.href)
}
