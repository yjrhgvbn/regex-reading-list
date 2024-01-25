import { Storage } from "@plasmohq/storage"

import { isUrlMatch } from "~utils"

import type { Optional, ReadRecord } from "../../interface"

const LIST_KEY = "read-list"

/** 更新或者插入列表 */
export async function updateList(
  data: Optional<ReadRecord, "id" | "createAt">
) {
  const storage = new Storage()
  const record: ReadRecord = {
    id: data.id || generateId(),
    createAt: data.createAt || Date.now(),
    ...data
  }
  try {
    const list: ReadRecord[] = await getList()
    const matchIndex = list.findIndex(
      (item) =>
        item.id === record.id || isUrlMatch(record.currentUrl, item.match)
    )
    if (matchIndex === -1) {
      list.push(record)
    } else {
      list[matchIndex] = record as ReadRecord
    }
    await storage.set(LIST_KEY, JSON.stringify(list))
    return list
  } catch (e) {
    // await storage.set(LIST_KEY, JSON.stringify([record]))
    return []
  }
}

/** 获取列表 */
export async function getList() {
  const storage = new Storage()
  const listStr = (await storage.get(LIST_KEY)) || "[]"
  try {
    const list: ReadRecord[] = JSON.parse(listStr)
    return list
  } catch (e) {
    return []
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
