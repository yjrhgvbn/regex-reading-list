import { Storage } from "@plasmohq/storage"

import { isUrlMatch } from "~utils"
import { ConfigEnum, getConfigValue } from "~utils/config"

import { getList } from "./storage"

const TAB_STORAGE_KEY = "tabRecord"

// use storage, background may be reset after a while
const storage = new Storage()

export async function addTabRecord(id: number | undefined) {
  if (id === undefined || id === null) return
  const list = await getTabRecord()
  await storage.set(TAB_STORAGE_KEY, [...list, id])
}

async function removeTabRecord(id: number | undefined) {
  if (id === undefined || id === null) return
  const list = await getTabRecord()
  const index = list.indexOf(id)
  if (index !== -1) {
    list.splice(index, 1)
    storage.set(TAB_STORAGE_KEY, list)
  }
}

async function isTabOpenedByPlugin(id: number | undefined) {
  if (id === undefined || id === null) return
  const list = await getTabRecord()
  // TODO: remove, this log for debug
  console.log("🚀 ~ isTabOpenedByPlugin ~ list:", list)
  if (list.includes(id)) return true
  return false
}

async function getTabRecord() {
  const res = await storage.get<number[]>(TAB_STORAGE_KEY)
  return res || []
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
  if (updateOnlyOpenByPlugin && !(await isTabOpenedByPlugin(tabId))) {
    isNeedWatch = false
  }
  return { isNeedWatch, matchRecord }
}
