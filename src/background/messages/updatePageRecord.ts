import type { PlasmoMessaging } from "@plasmohq/messaging"
import { sendToContentScript } from "@plasmohq/messaging"

import type { ReadRecord } from "../../interface"
import { onComplete } from "../utils"
import { updateList } from "../utils/storage"

export type RequestBody = {
  id: number
}

export type ResponseBody = {
  message: string
}

export async function updatePageRecord(params: Partial<ReadRecord>) {
  const tab = await getCurrentTab()
  let { position, id, match, title, currentUrl } = params
  if (id) {
    const recordList = await updateList({
      id,
      currentUrl: currentUrl,
      match: {
        type: match?.type,
        value: match?.value
      },
      position,
      title: title
    })
    return recordList
  } else {
    if (!position) {
      position = await sendToContentScript<any, ReadRecord["position"]>({
        name: "getScrollInfo"
      })
      onComplete(tab).then(() => {
        chrome.tabs.sendMessage(tab.id, {
          name: "watchScroll",
          body: {
            id
          }
        })
      })
    }
    const recordList = await updateList({
      currentUrl: tab.url,
      match: {
        type: match?.type || "string",
        value: match?.value || tab.url
      },
      position,
      title: title || tab.title
    })
    return recordList
  }
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true }
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions)
  return tab
}

export type UpdatePageRecordRequest = Parameters<typeof updatePageRecord>[0]
export type UpdatePageRecordResponse = Awaited<ReturnType<typeof updatePageRecord>>
export type UpdatePageRecordMessage = { body: UpdatePageRecordResponse }

const handler: PlasmoMessaging.MessageHandler<UpdatePageRecordRequest, UpdatePageRecordMessage> = async (req, res) => {
  res.send({
    body: {
      ...(await updatePageRecord(req.body))
    }
  })
}

export default handler
