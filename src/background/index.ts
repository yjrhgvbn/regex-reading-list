import { checkIsNeedWatchScroll } from "~background/utils/tabRecord"

import { watchScroll } from "./action/watchScroll"
import { updatePageRecord } from "./messages/updatePageRecord"

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url || changeInfo.status === "complete") {
    checkIsNeedWatchScroll(tab).then(({ isNeedWatch, matchRecord }) => {
      if (isNeedWatch) {
        setBadge(tabId)
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
chrome.tabs.onCreated.addListener((tab) => {
  checkIsNeedWatchScroll(tab).then((isNeedWatch) => {
    if (isNeedWatch) {
      setBadge(tab.id!)
    }
  })
})

function setBadge(tabId: number) {
  chrome.action.setBadgeText({ text: "—", tabId })
  chrome.action.setBadgeBackgroundColor({ color: "#FF0000", tabId })
}
export {}
