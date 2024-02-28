import { sendToContentScript } from "@plasmohq/messaging"

import type { ReadRecord } from "~interface"

export async function getScrollInfo(tabId: number) {
  return await sendToContentScript<any, ReadRecord["position"]>({
    tabId,
    name: "getScrollInfo"
  })
}
