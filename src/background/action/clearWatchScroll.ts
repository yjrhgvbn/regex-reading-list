export async function clearWatchScroll(tabId: number) {
  chrome.tabs
    .sendMessage(tabId, {
      name: "clearWatchScroll"
    }) // ignore error
    .catch(() => {})
  setBadge(tabId)
}

function setBadge(tabId: number) {
  chrome.action.setBadgeText({ text: "", tabId })
}
