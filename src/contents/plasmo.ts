import type { PlasmoCSConfig } from "plasmo"

import { relayMessage } from "@plasmohq/messaging"

import { getScrollInfo } from "./utils"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

window.addEventListener("load", () => {
  console.log("content script loaded")

  // 在滚动时调用函数
  window.onscroll = function () {
    var progress = getScrollInfo()
    console.log("页面滚动进度：" + progress.progress + "%")
  }

  // document.body.style.background = "pink"
})
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.name !== "getScrollInfo") return
  const scrollInfo = getScrollInfo()
  sendResponse(scrollInfo)
  // Return true in onMessage will wait the async function.
  return true
})
