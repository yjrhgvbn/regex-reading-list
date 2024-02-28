import type { ReadRecord } from "~interface"

export async function contentScrollTo(tabId: number, position: ReadRecord["position"]) {
  await chrome.tabs.sendMessage(tabId, {
    name: "scrollTo",
    body: {
      position
    }
  })
}
