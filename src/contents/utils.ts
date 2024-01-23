/** get scroll progress and top height */
export function getScrollInfo() {
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight
  const scrollTop =
    window.scrollY ||
    document.body.scrollTop +
      ((document.documentElement && document.documentElement.scrollTop) || 0)

  // 计算滚动进度
  const progress = (scrollTop / scrollHeight) * 100

  return {
    progress,
    top: scrollTop
  }
}

export function scrollTo(top: number) {
  window.scrollTo({ top, behavior: "smooth" })
}
