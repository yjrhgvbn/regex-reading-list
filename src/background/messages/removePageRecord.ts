import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getCurrentTab } from "~utils"

import { removeRecord } from "../utils/storage"

async function removePageRecord(params?: { id: string }) {
  const { id } = params || {}
  if (!id) return null
  return removeRecord(id)
}

export type RemovePageRecordRequest = Parameters<typeof removePageRecord>[0]
/** null or the list after remove */
export type RemovePageRecordResponse = Awaited<ReturnType<typeof removePageRecord>>
export type RemovePageRecordMessage = { body: RemovePageRecordResponse }

const handler: PlasmoMessaging.MessageHandler<RemovePageRecordRequest, RemovePageRecordMessage> = async (req, res) => {
  const body = await removePageRecord(req.body)
  if (req.body && body) {
    const tab = await getCurrentTab()
    if (tab) {
      chrome.tabs.sendMessage(tab.id!, {
        name: "clearWatchScroll",
        body: {
          id: req.body.id
        }
      })
    }
  }
  res.send({ body })
}

export default handler
