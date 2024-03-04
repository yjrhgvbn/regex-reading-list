export async function watchScroll(tabId: number, recordId: string) {
  chrome.tabs.sendMessage(tabId, {
    name: "watchScroll",
    body: {
      id: recordId
    }
  })
  setBadge(tabId)
}

function setBadge(tabId: number) {
  chrome.action.setBadgeText({ text: "—", tabId })
  chrome.action.setBadgeBackgroundColor({ color: "#FF0000", tabId })
}
