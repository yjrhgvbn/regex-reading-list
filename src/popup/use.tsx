import { useMemo, useSyncExternalStore } from "react"

import { EditRecord } from "./EditRecord"
import { RecordList } from "./RecordList"

let history: { name: string; props: any }[] = []
let listeners: (() => void)[] = []
let curPage: { name: string; props: any } | null = null

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
    function navigate<T extends keyof typeof PageMap>(url: T | number, data?: Parameters<(typeof PageMap)[T]>[0]) {
      if (typeof url === "number") {
        history = history.slice(0, url)
        curPage = history.at(-1) || { name: "home", props: {} }
      } else {
        history = [...history, { name: url, props: data }]
        curPage = { name: url, props: data }
      }
      emitChange()
    }
    return navigate
  }, [])
}

export function usePage(): (typeof PageMap)[keyof typeof PageMap] {
  const key = (useSyncExternalStore(subscribe, () => curPage?.name) as keyof typeof PageMap) || "home"
  return useMemo(() => {
    const Page = PageMap[key]
    if (curPage?.props) return (param: any) => <Page {...curPage!.props} {...param} />
    return Page
  }, [key])
}
