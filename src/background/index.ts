import { checkIsNeedWatchScroll } from "~background/utils/tabRecord"

import { clearWatchScroll } from "./action/clearWatchScroll"
import { watchScroll } from "./action/watchScroll"
import { updatePageRecord } from "./messages/updatePageRecord"

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url) {
    clearWatchScroll(tabId)
  }
  if (changeInfo.url || changeInfo.status === "complete") {
    checkIsNeedWatchScroll(tab).then(({ isNeedWatch, matchRecord }) => {
      if (isNeedWatch) {
        if (changeInfo.url) {
          updatePageRecord({
            id: matchRecord!.id,
            currentUrl: changeInfo.url,
            ...(tab.favIconUrl && { favIconUrl: tab.favIconUrl })
          })
          watchScroll(tabId, matchRecord!.id)
        }
      }
    })
  }
})
// chrome.tabs.onCreated.addListener((tab) => {
//   checkIsNeedWatchScroll(tab).then(({ isNeedWatch }) => {
//     if (isNeedWatch) {
//       setBadge(tab.id!)
//     }
//   })
// })

export {}
