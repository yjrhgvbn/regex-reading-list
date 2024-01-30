import type { PlasmoMessaging } from "@plasmohq/messaging"

import type { ReadRecord } from "~interface"
import { isUrlMatch } from "~utils"

import { getList } from "../utils/storage"

async function getActivePage() {
  const list = await getList()
  const tab = (await chrome.tabs.query({ active: true }))[0]
  const matchRecord: ReadRecord | undefined = list.find((item) => isUrlMatch(tab.url || "", item.match))
  return {
    currentUrl: tab.url!,
    url: matchRecord?.match?.value || tab.url!,
    isRegex: matchRecord?.match?.type === "regex",
    title: matchRecord?.title || tab.title!,
    id: matchRecord?.id
  }
}

export type ActivePageRequest = Parameters<typeof getActivePage>

export type ActivePageResponse = Awaited<ReturnType<typeof getActivePage>>
export type ActivePageMessage = { body: ActivePageResponse }

const handler: PlasmoMessaging.MessageHandler<ActivePageRequest, ActivePageMessage> = async (req, res) => {
  res.send({
    body: {
      ...(await getActivePage())
    }
  })
}

export default handler
