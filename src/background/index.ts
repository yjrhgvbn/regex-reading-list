import { checkIsNeedWatchScroll } from "~background/utils/tabRecord"

import { watchScroll } from "./action/watchScroll"
import { updatePageRecord } from "./messages/updatePageRecord"
import { clearWatchScroll } from "./action/clearWatchScroll"

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if(changeInfo.url){
    clearWatchScroll(tab.id!)

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
          watchScroll(tab.id!, matchRecord!.id)
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
