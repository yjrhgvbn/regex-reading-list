import { Storage } from "@plasmohq/storage"

import { CONFIG_KEY, ConfigEnum } from "~utils/const"

const tabOpenedByPlugin = new Set<number>()
const storage = new Storage()

export function addTabRecord(id: number | undefined) {
  if (id) tabOpenedByPlugin.add(id)
}

function removeTabRecord(id: number | undefined) {
  if (id) tabOpenedByPlugin.delete(id)
}

function isTabOpenedByPlugin(id: number | undefined) {
  if (id) return tabOpenedByPlugin.has(id)
  return false
}

chrome.tabs.onRemoved.addListener(function (tabId) {
  removeTabRecord(tabId)
})

export async function checkIsNeedWatchScroll(tabId: number | undefined) {
  let isNeedWatch = true
  const configs = await storage.get<Record<string, boolean>>(CONFIG_KEY)
  const updateOnlyOpenByPlugin = configs[ConfigEnum.updateOnlyOpenByPlugin] as boolean
  if (updateOnlyOpenByPlugin && !isTabOpenedByPlugin(tabId)) isNeedWatch = false
  return isNeedWatch
}
