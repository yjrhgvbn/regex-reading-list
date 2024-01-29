import type { PlasmoCSConfig } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"

import type { ActivePageRequest, ActivePageResponse } from "~background/messages/getActivePage"
import type { ReadRecord } from "~interface"

import { getScrollInfo } from "./utils"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

let watchId: string | null = null
window.addEventListener(
  "scroll",
  () => {
    if (!watchId) return
    sendToBackground<Partial<ReadRecord>>({
      name: "updatePageRecord",
      body: {
        position: getScrollInfo(),
        id: watchId
      }
    })
  },
  {
    passive: true
  }
)

sendToBackground<ActivePageRequest, ActivePageResponse>({ name: "getActivePage" }).then((res) => {
  if (res.body.id) {
    watchId = res.body.id
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.name) {
    case "scrollTo":
      window.scrollTo(0, message.body.position.top)
      break
    case "getScrollInfo":
      const scrollInfo = getScrollInfo()
      sendResponse(scrollInfo)
      break
    case "watchScroll":
      watchId = message.body.id
      break
    default:
      break
  }
})
