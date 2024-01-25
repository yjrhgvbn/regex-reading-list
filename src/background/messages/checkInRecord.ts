import type { PlasmoMessaging } from "@plasmohq/messaging"

import { isUrlMatch } from "~utils"

import { getList } from "../utils/storage"

const handler: PlasmoMessaging.MessageHandler<undefined, { isRecord: boolean }> = async (req, res) => {
  const list = await getList()
  const tab = (await chrome.tabs.query({ active: true }))[0]
  const isRecord = list.some((item) => isUrlMatch(tab.url, item.match))
  res.send({
    isRecord
  })
}
export default handler
