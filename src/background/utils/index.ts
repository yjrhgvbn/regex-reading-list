export function onComplete(newTab: chrome.tabs.Tab) {
  return new Promise((resolve) => {
    chrome.tabs.onUpdated.addListener(listener)

    function listener(tabId: number, info: chrome.tabs.TabChangeInfo) {
      if (isCompleteLoad() && isSameTab()) {
        chrome.tabs.onUpdated.removeListener(listener)
        resolve(tabId)
      }

      function isCompleteLoad() {
        return info.status === "complete"
      }

      function isSameTab() {
        return newTab.id === tabId
      }
    }
  })
}

export function onIconLoad(newTab: chrome.tabs.Tab): Promise<string | undefined> {
  if (newTab.favIconUrl) return Promise.resolve(newTab.favIconUrl)
  return new Promise((resolve) => {
    chrome.tabs.onUpdated.addListener(listener)

    function listener(id: number, info: chrome.tabs.TabChangeInfo) {
      if (isIconLoad() && isSameTab()) {
        chrome.tabs.onUpdated.removeListener(listener)
        resolve(info.favIconUrl)
      }

      function isIconLoad() {
        return info.favIconUrl
      }

      function isSameTab() {
        return newTab.id === id
      }
    }
  })
}
