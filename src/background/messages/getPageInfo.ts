import type { PlasmoMessaging } from "@plasmohq/messaging"

import { checkIsNeedWatchScroll } from "~background/utils/tabRecord"
import { isUrlMatch } from "~utils"

import { getList } from "../utils/storage"

/**
 * get page info by current tab
 */
async function getPageInfo() {
  const tab = (await chrome.tabs.query({ active: true }))[0]
  const list = await getList()
  const matchRecord = list.find((item) => isUrlMatch(tab.url || "", item.match))
  const { isNeedWatch } = await checkIsNeedWatchScroll(tab)
  return {
    currentUrl: tab.url!,
    url: matchRecord?.match?.value || tab.url!,
    isRegex: matchRecord?.match?.type === "regex",
    title: matchRecord?.title || tab.title!,
    id: matchRecord?.id,
    createAt: matchRecord?.createAt,
    record: matchRecord,
    favIconUrl: matchRecord?.favIconUrl || tab.favIconUrl,
    isNeedWatch,
    progress: matchRecord?.position?.progress || 0
  }
}

export type GetPageInfoRequest = never

export type GetPageInfoResponse = Awaited<ReturnType<typeof getPageInfo>>
export type GetPageInfoMessage = { body: GetPageInfoResponse }

const handler: PlasmoMessaging.MessageHandler<GetPageInfoRequest, GetPageInfoMessage> = async (req, res) => {
  res.send({
    body: {
      ...(await getPageInfo())
    }
  })
}

export default handler
