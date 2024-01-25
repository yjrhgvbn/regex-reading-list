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
