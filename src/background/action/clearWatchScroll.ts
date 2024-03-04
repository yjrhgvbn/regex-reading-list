export async function clearWatchScroll(tabId: number) {
  chrome.tabs.sendMessage(tabId, {
    name: "clearWatchScroll",
  })
  setBadge(tabId)
}

function setBadge(tabId: number) {
  chrome.action.setBadgeText({ text: "", tabId })
}
