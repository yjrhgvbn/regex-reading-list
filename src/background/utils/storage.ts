import { Storage } from "@plasmohq/storage"

import { isUrlMatch, swapArrayElements } from "~utils"
import { LIST_KEY } from "~utils/const"

import type { ReadRecord } from "../../interface"

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Record<string, any> ? DeepPartial<T[P]> : T[P]
}

// cache list
let lastList: ReadRecord[] | null = null
const storage = new Storage()

// avoid update list that is removed
const removedIdSet = new Set<string>()
/** 更新或者插入列表 */
export async function updateList(record: DeepPartial<ReadRecord>) {
  try {
    const list: ReadRecord[] = await getList()
    let newRecord: ReadRecord | null = null
    const matchIndex = list.findIndex((item) => item.id === record.id || isUrlMatch(record.currentUrl, item.match))
    if (matchIndex === -1) {
      newRecord = deepMerge(
        {
          id: record.id || generateId(),
          createAt: record.createAt || Date.now(),
          currentUrl: "",
          match: {
            type: "string",
            value: ""
          },
          position: {
            top: 0,
            progress: 0
          },
          title: "未命名",
          favIconUrl: ""
        } as const,
        record
      )
      if (!removedIdSet.has(newRecord.id)) list.push(newRecord!)
    } else {
      newRecord = deepMerge(list[matchIndex], record)
    }
    await storage.set(LIST_KEY, JSON.stringify(list))
    reloadList()
    return { list: getList(), record: newRecord }
  } catch (e) {
    return { list: lastList, record: null }
  }
}

export async function getList() {
  if (lastList) return lastList
  await reloadList()
  return lastList || []
}

export async function swapRecord(id: string, overId: string) {
  try {
    const list: ReadRecord[] = await getList()
    swapArrayElements(list, id, overId, (item) => item.id)
    await storage.set(LIST_KEY, JSON.stringify(list))
    reloadList()
    return getList()
  } catch (e) {
    return lastList
  }
}

export async function removeRecord(id: string) {
  try {
    const list: ReadRecord[] = await getList()
    const matchIndex = list.findIndex((item) => item.id === id)
    if (matchIndex !== -1) {
      removedIdSet.add(id)
      list.splice(matchIndex, 1)
    }
    await storage.set(LIST_KEY, JSON.stringify(list))
    reloadList()
    return getList()
  } catch (e) {
    return lastList
  }
}

export async function getRecord(id: string) {
  const list = await getList()
  return list.find((item) => item.id === id)
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

function deepMerge<T extends Record<string, any>>(target: T, source: Record<string, any>): T {
  for (const key in source) {
    // if (!Object.prototype.hasOwnProperty.call(target, key)) continue
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue
    // if (Object.prototype.toString.call(target[key]) !== Object.prototype.toString.call(source[key])) continue
    if (typeof source[key] === "object") {
      deepMerge(target[key], source[key])
    } else {
      // @ts-ignore
      target[key] = source[key] ?? target[key]
    }
  }

  return target
}
