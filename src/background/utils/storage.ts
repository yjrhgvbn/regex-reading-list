import { Storage } from "@plasmohq/storage"

import { isUrlMatch } from "~utils"
import { LIST_KEY } from "~utils/const"

import type { Optional, ReadRecord } from "../../interface"

// cache list
let lastList: ReadRecord[] | null = null
const storage = new Storage()

/** 更新或者插入列表 */
export async function updateList(data: Optional<ReadRecord, "id" | "createAt">) {
  const record: ReadRecord = {
    id: data.id || generateId(),
    createAt: data.createAt || Date.now(),
    ...data
  }
  try {
    const list: ReadRecord[] = await getList()
    const matchIndex = list.findIndex((item) => item.id === record.id || isUrlMatch(record.currentUrl, item.match))
    if (matchIndex === -1) {
      list.push(record)
    } else {
      list[matchIndex] = record as ReadRecord
    }
    await storage.set(LIST_KEY, JSON.stringify(list))
    reloadList()
    return getList()
  } catch (e) {
    return lastList
  }
}

export async function getList() {
  if (lastList) return lastList
  await reloadList()
  return lastList
}

/** reload list from storage */
async function reloadList() {
  const listStr = (await storage.get(LIST_KEY)) || "[]"
  try {
    const list: ReadRecord[] = JSON.parse(listStr)
    lastList = list
  } catch (e) {
    lastList = []
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
