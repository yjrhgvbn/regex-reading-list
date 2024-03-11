import { type PlasmoMessaging } from "@plasmohq/messaging"

import { getScrollInfo } from "~background/action/getScrollInfo"
import { watchScroll } from "~background/action/watchScroll"
import { addTabRecord } from "~background/utils/tabRecord"
import { getCurrentTab } from "~utils"

import type { ReadRecord } from "../../interface"
import { updateList } from "../utils/storage"

export async function addPageRecord(params: Partial<ReadRecord> = {}) {
  const tab = await getCurrentTab()
  const { match, title, position: paramPostion } = params

  let position = paramPostion
  if (!paramPostion) {
    position = await getScrollInfo(tab.id!)
  }
  const { list: recordList, record } = await updateList({
    currentUrl: tab.url,
    match: {
      type: match?.type || "string",
      value: match?.value || tab.url
    },
    title: title || tab.title,
    position,
    favIconUrl: tab.favIconUrl
  })

  if (record) {
    watchScroll(tab.id!, record.id)
    // current added tab treat as opened by plugin
    addTabRecord(tab.id!)
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
