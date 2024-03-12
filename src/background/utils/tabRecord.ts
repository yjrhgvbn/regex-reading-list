import { isUrlMatch } from "~utils"
import { ConfigEnum, getConfigValue } from "~utils/config"

import { getList } from "./storage"

const tabOpenedByPlugin = new Set<number>()

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

/** check tab is need to watch */
export async function checkIsNeedWatchScroll(tab: chrome.tabs.Tab) {
  let isNeedWatch = true

  const tabId = tab.id

  const list = await getList()
  const matchRecord = list.find((item) => isUrlMatch(tab.url || "", item.match))
  if (!matchRecord) return { isNeedWatch: false, matchRecord }
  const updateOnlyOpenByPlugin = await getConfigValue(ConfigEnum.updateOnlyOpenByPlugin)
  if (updateOnlyOpenByPlugin && !isTabOpenedByPlugin(tabId)) isNeedWatch = false
  return { isNeedWatch, matchRecord }
}
