import { sendToBackground } from "@plasmohq/messaging"

import { isUrlMatch } from "~utils"

import { onComplete } from "./utils"
import { getList } from "./utils/storage"

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // read changeInfo data and do something with it (like read the url)
  if (changeInfo.url) {
    getList().then((list) => {
      list.forEach((item) => {
        if (isUrlMatch(changeInfo.url, item.match)) {
          onComplete(tab).then(() =>
            chrome.tabs.sendMessage(tabId, {
              name: "watchScroll"
            })
          )
          if (item.currentUrl !== changeInfo.url) {
            sendToBackground({
              name: "updatePageRecord"
            })
          }
        }
      })
    })
    // do something here
  }
})
export {}
