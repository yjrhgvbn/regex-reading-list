import type { PlasmoMessaging } from "@plasmohq/messaging"

import type { ReadRecord } from "~interface"

import { onComplete } from "../utils"

const handler: PlasmoMessaging.MessageHandler<{ record: ReadRecord }> = async (req, res) => {
  const record = req.body.record
  let tab = (await chrome.tabs.query({ url: record.currentUrl }))[0]
  if (tab) {
    chrome.tabs.highlight({ tabs: tab.index })
  } else {
    tab = await chrome.tabs.create({
      url: record.currentUrl,
      active: true
    })
  }
  await onComplete(tab)
  await chrome.tabs.sendMessage(tab.id, {
    name: "scrollTo",
    body: {
      position: record.position
    }
  })
}
export default handler
