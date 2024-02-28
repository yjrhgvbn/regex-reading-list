import type { PlasmoMessaging } from "@plasmohq/messaging"

import { contentScrollTo } from "~background/action/contentScrollTo"
import { addTabRecord } from "~background/utils/tabRecord"
import type { ReadRecord } from "~interface"

import { onComplete, onIconLoad } from "../utils"
import { updatePageRecord } from "./updatePageRecord"

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
  onIconLoad(tab).then((favIconUrl) => {
    if (favIconUrl) updatePageRecord({ id: record.id, favIconUrl })
  })
  await onComplete(tab)

  if (tab.id) {
    contentScrollTo(tab.id, record.position)
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
