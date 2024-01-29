import { useMemo, useSyncExternalStore } from "react"

import { EditRecord } from "./EditRecord"
import { RecordList } from "./RecordList"

let history: string[] = []
let listeners: (() => void)[] = []
let curPage = "home"

const PageMap = {
  home: RecordList,
  edit: EditRecord
}
function subscribe(listener: () => void) {
  listeners = [...listeners, listener]
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}
function emitChange() {
  for (let listener of listeners) {
    listener()
  }
}

export function useNavigate() {
  return useMemo(() => {
    return (url: keyof typeof PageMap | number) => {
      if (typeof url === "number") {
        history = history.slice(0, url)
        curPage = history.at(-1) || "home"
      } else {
        history = [...history, url]
        curPage = url
      }
      emitChange()
    }
  }, [])
}

export function usePage() {
  const key = useSyncExternalStore(subscribe, () => curPage)
  const Page = useMemo(() => {
    return PageMap[key]
  }, [key])
  return Page
}
