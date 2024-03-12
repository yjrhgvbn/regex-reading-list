import type { ReadRecord } from "~interface"

export function isUrlMatch(url?: string, pattern?: ReadRecord["match"]) {
  if (!url || !pattern) return false
  if (pattern.type === "string") {
    return url === pattern.value
  } else if (pattern.type === "regex") {
    return new RegExp(pattern.value).test(url)
  }
}

export async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true }
  let [tab] = await chrome.tabs.query(queryOptions)
  return tab
}

const defaultGetKey = (item: any) => {
  if (typeof item === "object") {
    return item.id
  }
  return item
}

/**
 * swap two elements in an array
 */
export function swapArrayElements<T extends unknown, K extends string | number>(
  array: T[],
  key1: K,
  key2: K,
  getKey: (item: T) => K = defaultGetKey
): T[] {
  let index1: number
  let index2: number
  for (let i = 0; i < array.length; i++) {
    if (getKey(array[i]) === key1) {
      index1 = i
    }
    if (getKey(array[i]) === key2) {
      index2 = i
    }
  }
  if (index1 === undefined || index2 === undefined) {
    return array
  }
  ;[array[index1], array[index2]] = [array[index2], array[index1]]

  return array
}
