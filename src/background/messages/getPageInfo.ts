import type { PlasmoMessaging } from "@plasmohq/messaging"

import type { ReadRecord } from "~interface"
import { isUrlMatch } from "~utils"

import { getList, getRecord } from "../utils/storage"

async function getPageInfo(params?: { id?: string }) {
  const { id } = params || {}
  let matchRecord: ReadRecord | undefined
  if (id) {
    matchRecord = await getRecord(id)
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
  const tab = (await chrome.tabs.query({ active: true }))[0]
  const list = await getList()
  matchRecord = list.find((item) => isUrlMatch(tab.url || "", item.match))
  return {
    currentUrl: tab.url!,
    url: matchRecord?.match?.value || tab.url!,
    isRegex: matchRecord?.match?.type === "regex",
    title: matchRecord?.title || tab.title!,
    id: matchRecord?.id
  }
}

export type GetPageInfoRequest = Parameters<typeof getPageInfo>[0]

export type GetPageInfoResponse = Awaited<ReturnType<typeof getPageInfo>>
export type GetPageInfoMessage = { body: GetPageInfoResponse }

const handler: PlasmoMessaging.MessageHandler<GetPageInfoRequest, GetPageInfoMessage> = async (req, res) => {
  res.send({
    body: {
      ...(await getPageInfo(req.body))
    }
  })
}

export default handler
