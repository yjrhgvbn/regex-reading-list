export async function watchScroll(tabId: number, recordId: string) {
  chrome.tabs.sendMessage(tabId, {
    name: "watchScroll",
    body: {
      id: recordId
    }
  })
}
