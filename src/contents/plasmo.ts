import type { PlasmoCSConfig } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"

import type { ReadRecord } from "~interface"

import { getScrollInfo } from "./utils"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

let isNeedUpdateScrollInfo = false
window.addEventListener(
  "scroll",
  () => {
    if (!isNeedUpdateScrollInfo) return
    sendToBackground<{ position: ReadRecord["position"] }>({
      name: "updatePageRecord",
      body: {
        position: getScrollInfo()
      }
    })
  },
  {
    passive: true
  }
)

sendToBackground<{ isRecord: boolean }>({ name: "checkInRecord" }).then((res) => {
  if (res.isRecord) {
    isNeedUpdateScrollInfo = true
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
      isNeedUpdateScrollInfo = true
      break
    default:
      break
  }
})
