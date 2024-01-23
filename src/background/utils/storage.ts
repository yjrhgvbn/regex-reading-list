import { Storage } from "@plasmohq/storage"

import type { ReadRecord } from "../interface"

const LIST_KEY = "read-list"

/** 更新或者插入列表 */
export async function updateList(record: ReadRecord) {
  const storage = new Storage()
  const listStr = (await storage.get(LIST_KEY)) || "[]"
  try {
    const list: ReadRecord[] = JSON.parse(listStr)
    const newList = [record, ...list]
    await storage.set(LIST_KEY, JSON.stringify(newList))
    return newList
  } catch (e) {
    await storage.set(LIST_KEY, JSON.stringify([record]))
    return [record]
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
