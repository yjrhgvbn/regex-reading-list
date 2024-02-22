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
  const { position: paramPostion, id } = params
  if (!id) {
    return null
  }
  let position = paramPostion
  if (!paramPostion) {
    position = await sendToContentScript<any, ReadRecord["position"]>({
      name: "getScrollInfo"
    })
  }
  const { list: recordList, record } = await updateList({
    ...params,
    position
  })

  return recordList
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
