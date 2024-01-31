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
