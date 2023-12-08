export const useBook = () => {
  const [bookId, sectionId] = location.pathname
    .split('/')
    .filter((item) => item && !isNaN(Number(item)))
  return { bookId, sectionId }
}
