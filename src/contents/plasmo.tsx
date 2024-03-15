import styleText from "data-text:./index.css"
import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import type { GetPageInfoMessage, GetPageInfoRequest } from "~background/messages/getPageInfo"
import type { RemovePageRecordMessage, RemovePageRecordRequest } from "~background/messages/removePageRecord"
import type { ReadRecord } from "~interface"
import { ConfigEnum, getConfigs, getConfigValue } from "~utils/config"

import { getScrollInfo } from "./utils"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}
let watchId: string | null = null
let scrollProgress = 0
let setShowCompont: ((show: boolean) => void) | null = null

let setWatchId = (id: string) => {
  watchId = id
  tryShowFloatingButton()
}

async function tryShowFloatingButton() {
  const floatingButtonThreshold = await getConfigValue(ConfigEnum.floatingButtonThreshold)
  const showFloatingButton = await getConfigValue(ConfigEnum.showFloatingButton)
  if (!showFloatingButton) {
    if (setShowCompont) setShowCompont(false)
    return
  }
  if (scrollProgress > floatingButtonThreshold) {
    if (setShowCompont) setShowCompont(true)
  } else {
    if (setShowCompont) setShowCompont(false)
  }
}
// use scrollend event to reduce the number of messages
window.addEventListener(
  "scrollend",
  () => {
    if (!watchId) return
    const position = getScrollInfo()
    scrollProgress = position.progress
    tryShowFloatingButton()
    sendToBackground<Partial<ReadRecord>>({
      name: "updatePageRecord",
      body: {
        position,
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
    setWatchId(res.body.id)
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
      setWatchId(message.body.id)
      break
    case "clearWatchScroll":
      setWatchId(null)
      break
    default:
      break
  }
})

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText + "\n" + styleText
  return style
}
function removeRecord() {
  sendToBackground<RemovePageRecordRequest, RemovePageRecordMessage>({
    name: "removePageRecord",
    body: { id: watchId }
  }).then(() => {
    setWatchId(null)
  })
}
const FloatingButton = () => {
  const [showCompont, setState] = useState(false)
  useEffect(() => {
    setShowCompont = setState
    return () => {
      setShowCompont = null
    }
  }, [])
  if (!showCompont) return null
  return (
    <button
      onClick={removeRecord}
      className="bg-yellow-500 text-white font-medium rounded-md px-4 py-2 flex items-center justify-center hover:bg-yellow-600 transition duration-300 ease-in-out shadow-lg">
      remove record
    </button>
  )
}
export default FloatingButton
