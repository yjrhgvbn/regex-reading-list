import type { PlasmoMessaging } from "@plasmohq/messaging"
import { sendToContentScript } from "@plasmohq/messaging"

import type { ReadRecord } from "../interface"
import { getList, updateList } from "../utils/storage"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const tab = await getCurrentTab()
  const position = await sendToContentScript<any, ReadRecord["position"]>({
    name: "getScrollInfo"
  })
  const saveData: ReadRecord = {
    currentUrl: tab.url,
    date: Date.now(),
    match: {
      type: "string",
      value: tab.url
    },
    position,
    title: tab.title
  }
  const recordList = await updateList(saveData)

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
