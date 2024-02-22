import { checkIsNeedWatchScroll } from "~background/utils/tabRecord"
import { isUrlMatch } from "~utils"

import { updatePageRecord } from "./messages/updatePageRecord"
import { getList } from "./utils/storage"

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // read changeInfo data and do something with it (like read the url)
  if (changeInfo.url) {
    getList().then((list) => {
      list.forEach((item) => {
        if (isUrlMatch(changeInfo.url, item.match)) {
          if (item.currentUrl !== changeInfo.url) {
            checkIsNeedWatchScroll(tabId).then((isNeedWatch) => {
              if (isNeedWatch)
                updatePageRecord({
                  id: item.id,
                  currentUrl: changeInfo.url,
                  position: {
                    top: 0,
                    progress: 0
                  }
                })
            })
          }
        }
      })
    })
    // do something here
  }
})
export {}
