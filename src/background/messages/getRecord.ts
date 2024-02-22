import type { PlasmoMessaging } from "@plasmohq/messaging"

import type { ReadRecord } from "~interface"

import { getRecord as getRecordStorage } from "../utils/storage"

/**
 * get page info by record id, if not found, get page info by current tab
 */
async function getRecord(params?: { id?: string }) {
  if (!params || !params.id) return null
  const { id } = params
  let matchRecord: ReadRecord | undefined
  if (id) {
    matchRecord = await getRecordStorage(id)
  }
  if (matchRecord) {
    return {
      currentUrl: matchRecord.currentUrl,
      url: matchRecord.match?.value || matchRecord.currentUrl,
      isRegex: matchRecord.match?.type === "regex",
      title: matchRecord.title || matchRecord.currentUrl,
      id: matchRecord.id
    }
  }
  return null
}

export type GetRecordRequest = Parameters<typeof getRecord>[0]

export type GetRecordResponse = Awaited<ReturnType<typeof getRecord>>
export type GetRecordMessage = { body: GetRecordResponse }

const handler: PlasmoMessaging.MessageHandler<GetRecordRequest, GetRecordMessage> = async (req, res) => {
  const body = await getRecord(req.body)
  res.send({ body })
}

export default handler
