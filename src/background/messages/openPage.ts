import type { PlasmoMessaging } from "@plasmohq/messaging"

import { addTabRecord } from "~background/utils/tabRecord"
import type { ReadRecord } from "~interface"

import { onComplete } from "../utils"

export async function openPage(params: { record: ReadRecord }) {
  const { record } = params
  let tab = (await chrome.tabs.query({ url: record.currentUrl }))[0]
  if (tab) {
    chrome.tabs.highlight({ tabs: tab.index })
  } else {
    tab = await chrome.tabs.create({
      url: record.currentUrl,
      active: true
    })
    addTabRecord(tab.id)
  }
  await onComplete(tab)
  if (tab.id) {
    await chrome.tabs.sendMessage(tab.id, {
      name: "scrollTo",
      body: {
        position: record.position
      }
    })
  }
}

export type OpenPageRequest = Parameters<typeof openPage>[0]

export type OpenPageResponse = Awaited<ReturnType<typeof openPage>>
export type OpenPageMessage = { body: OpenPageResponse }

const handler: PlasmoMessaging.MessageHandler<OpenPageRequest, OpenPageMessage> = async (req, res) => {
  if (req?.body?.record) {
    await openPage(req.body)
  }
  res.send({
    body: undefined
  })
}

export default handler
