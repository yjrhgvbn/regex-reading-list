import type { PlasmoMessaging } from "@plasmohq/messaging"

import { isUrlMatch } from "~utils"

import { getList } from "../utils/storage"

async function getActivePage() {
  const list = await getList()
  const tab = (await chrome.tabs.query({ active: true }))[0]
  const matchRecord = list.find((item) => isUrlMatch(tab.url, item.match))
  return {
    url: matchRecord?.match?.value || tab.url,
    isRegex: matchRecord?.match?.type === "regex",
    title: matchRecord?.title || tab.title,
    id: matchRecord?.id
  }
}

export type ActivePageResponse = {
  body: Awaited<ReturnType<typeof getActivePage>>
}
export type ActivePageRequest = Parameters<typeof getActivePage>

const handler: PlasmoMessaging.MessageHandler<ActivePageRequest, ActivePageResponse> = async (req, res) => {
  res.send({
    body: {
      ...(await getActivePage())
    }
  })
}

export default handler
