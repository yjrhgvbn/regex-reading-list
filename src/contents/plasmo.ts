import type { PlasmoCSConfig } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"

import type { GetPageInfoMessage, GetPageInfoRequest } from "~background/messages/getPageInfo"
import type { ReadRecord } from "~interface"

import { getScrollInfo } from "./utils"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

let watchId: string | null = null
// use scrollend event to reduce the number of messages
window.addEventListener(
  "scrollend",
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

sendToBackground<GetPageInfoRequest, GetPageInfoMessage>({ name: "getPageInfo" }).then(async (res) => {
  if (res.body.isNeedWatch && res.body.id) {
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
    case "clearWatchScroll":
      watchId = null
      break
    default:
      break
  }
})
