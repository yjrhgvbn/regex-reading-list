import type { PlasmoCSConfig } from "plasmo"

import { getScrollInfo } from "./utils"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.name) {
    case "scrollTo":
      window.scrollTo(0, message.body.position.top)
      break
    case "getScrollInfo":
      const scrollInfo = getScrollInfo()
      sendResponse(scrollInfo)
      break
    default:
      break
  }
})
