import { Storage } from "@plasmohq/storage"

import { isUrlMatch } from "~utils"
import { ConfigEnum, getConfigValue } from "~utils/config"

import { getList } from "./storage"

const TAB_STORAGE_KEY = "tabRecord"

// use storage, background may be reset after a while
const storage = new Storage()

export async function addTabRecord(id: number | undefined, windowId: number | undefined) {
  if (id === undefined || id === null) return
  const list = await getStorageTabIdList()
  await storage.set(TAB_STORAGE_KEY, [...list, id])
}

async function removeTabRecord(id: number | undefined) {
  if (id === undefined || id === null) return
  const list = await getStorageTabIdList()
  const index = list.findIndex((v) => v.tabId === id)
  if (index !== -1) {
    list.splice(index, 1)
    storage.set(TAB_STORAGE_KEY, list)
  }
}

async function isTabIdStoraged(id: number | undefined) {
  if (id === undefined || id === null) return
  const list = await getStorageTabIdList()
  // TODO: remove, this log for debug
  console.log("🚀 ~ isTabOpenedByPlugin ~ list:", list)
  if (list.some((v) => v.tabId === id)) return true
  return false
}

/** get the tabId list that storaged */
async function getStorageTabIdList() {
  const res = (await storage.get<any[]>(TAB_STORAGE_KEY)) || []
  return res.map((item) => {
    // Compatible with older versions
    return Number.isInteger(item)
      ? {
          windowId: 0,
          tabId: item
        }
      : item
  }) as { windowId: number; tabId: number }[]
}

chrome.tabs.onRemoved.addListener(function (tabId) {
  removeTabRecord(tabId)
})

chrome.windows.onRemoved.addListener(function () {
  // we can't detect when browser is closed, it may cause some tabId not removed in storage
  // check all tabId when window is removed can avoid this
  chrome.windows.getAll({ populate: true }, async function (windows) {
    const list = await getStorageTabIdList()
    const leftList = list.filter((item) => {
      return windows.some((window) => window.id === item.windowId)
    })
    storage.set(TAB_STORAGE_KEY, leftList)
  })
})

/** check tab is need to watch */
export async function checkIsNeedWatchScroll(tab: chrome.tabs.Tab) {
  let isNeedWatch = true

  const tabId = tab.id

  const list = await getList()
  const matchRecord = list.find((item) => isUrlMatch(tab.url || "", item.match))
  if (!matchRecord) return { isNeedWatch: false, matchRecord }
  const updateOnlyOpenByPlugin = await getConfigValue(ConfigEnum.updateOnlyOpenByPlugin)
  if (updateOnlyOpenByPlugin && !(await isTabIdStoraged(tabId))) {
    isNeedWatch = false
  }
  return { isNeedWatch, matchRecord }
}
