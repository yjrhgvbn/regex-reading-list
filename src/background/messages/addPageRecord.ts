import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getCurrentTab } from "~utils"

import type { ReadRecord } from "../../interface"
import { updateList } from "../utils/storage"

export type RequestBody = {
  id: number
}

export type ResponseBody = {
  message: string
}

export async function addPageRecord(params: Partial<ReadRecord> = {}) {
  const tab = await getCurrentTab()
  const { match, title } = params
  const { list: recordList, record } = await updateList({
    currentUrl: tab.url,
    match: {
      type: match?.type || "string",
      value: match?.value || tab.url
    },
    title: title || tab.title
  })
  if (record) {
    chrome.tabs.sendMessage(tab.id!, {
      name: "watchScroll",
      body: {
        id: record.id
      }
    })
  }
  return recordList
}

export type AddPageRecordRequest = Parameters<typeof addPageRecord>[0]
export type AddPageRecordResponse = Awaited<ReturnType<typeof addPageRecord>>
export type AddPageRecordMessage = { body: AddPageRecordResponse }

const handler: PlasmoMessaging.MessageHandler<AddPageRecordRequest, AddPageRecordMessage> = async (req, res) => {
  const body = await addPageRecord(req.body)
  res.send({
    body
  })
}

export default handler
