import type { PlasmoMessaging } from "@plasmohq/messaging"
import { sendToContentScript } from "@plasmohq/messaging"

import { getCurrentTab } from "~utils"

import type { ReadRecord } from "../../interface"
import { updateList } from "../utils/storage"

export type RequestBody = {
  id: number
}

export type ResponseBody = {
  message: string
}

export async function updatePageRecord(params: Partial<ReadRecord> = {}) {
  const tab = await getCurrentTab()
  const { position: paramPostion, id, match, title } = params
  if (id) {
    const recordList = await updateList(params)
    return recordList
  } else {
    let position = paramPostion
    if (!paramPostion) {
      position = await sendToContentScript<any, ReadRecord["position"]>({
        name: "getScrollInfo"
      })
    }
    const { list: recordList, record } = await updateList({
      currentUrl: tab.url,
      match: {
        type: match?.type || "string",
        value: match?.value || tab.url
      },
      position,
      title: title || tab.title
    })

    if (!paramPostion && record) {
      // onComplete(tab).then(() => {
      chrome.tabs.sendMessage(tab.id!, {
        name: "watchScroll",
        body: {
          id: record.id
        }
      })
      // })
    }
    return recordList
  }
}

export type UpdatePageRecordRequest = Parameters<typeof updatePageRecord>[0]
export type UpdatePageRecordResponse = Awaited<ReturnType<typeof updatePageRecord>>
export type UpdatePageRecordMessage = { body: UpdatePageRecordResponse }

const handler: PlasmoMessaging.MessageHandler<UpdatePageRecordRequest, UpdatePageRecordMessage> = async (req, res) => {
  const body = await updatePageRecord(req.body)
  res.send({
    body
  })
}

export default handler
