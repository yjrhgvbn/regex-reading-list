import type { PlasmoMessaging } from "@plasmohq/messaging"

import { swapRecord } from "../utils/storage"

export async function swapPageRecord(params: { id: string; overId: string }) {
  const { id, overId } = params
  if (!id) {
    return null
  }
  const list = await swapRecord(id, overId)

  return list
}

export type SwapPageRecordRequest = Parameters<typeof swapPageRecord>[0]
export type SwapPageRecordResponse = Awaited<ReturnType<typeof swapPageRecord>>
export type SwapPageRecordMessage = { body: SwapPageRecordResponse }

const handler: PlasmoMessaging.MessageHandler<SwapPageRecordRequest, SwapPageRecordMessage> = async (req, res) => {
  const body = await swapPageRecord(req.body)
  res.send({
    body
  })
}

export default handler
