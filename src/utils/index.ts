import type { ReadRecord } from "~interface"

export function isUrlMatch(url: string, pattern: ReadRecord["match"]) {
  if (pattern.type === "string") {
    return url === pattern.value
  } else if (pattern.type === "regex") {
    return new RegExp(pattern.value).test(url)
  }
}
