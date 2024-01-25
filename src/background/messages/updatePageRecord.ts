import type { PlasmoMessaging } from "@plasmohq/messaging"
import { sendToContentScript } from "@plasmohq/messaging"

import type { ReadRecord } from "../../interface"
import { onComplete } from "../utils"
import { updateList } from "../utils/storage"

export type RequestBody = {
  id: number
}

export type ResponseBody = {
  message: string
}
const handler: PlasmoMessaging.MessageHandler<undefined | { position: ReadRecord["position"] }> = async (req, res) => {
  const tab = await getCurrentTab()
  let position = req.body?.position
  if (!position) {
    position = await sendToContentScript<any, ReadRecord["position"]>({
      name: "getScrollInfo"
    })
    // if no position, tell content script to watch scroll
    onComplete(tab).then(() => {
      chrome.tabs.sendMessage(tab.id, {
        name: "watchScroll"
      })
    })
  }
  const recordList = await updateList({
    currentUrl: tab.url,
    match: {
      type: "string",
      value: tab.url
    },
    position,
    title: tab.title
  })

  res.send({
    body: recordList
  })
}
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true }
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions)
  return tab
}
export default handler
