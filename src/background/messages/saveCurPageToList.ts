import type { PlasmoMessaging } from "@plasmohq/messaging"
import { sendToContentScript } from "@plasmohq/messaging"

import type { ReadRecord } from "../../interface"
import { getList, updateList } from "../utils/storage"

export type RequestBody = {
  id: number
}

export type ResponseBody = {
  message: string
}
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const tab = await getCurrentTab()
  const position = await sendToContentScript<any, ReadRecord["position"]>({
    name: "getScrollInfo"
  })

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
