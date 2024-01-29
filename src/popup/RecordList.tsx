import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import type { MessageRespone, ReadRecord } from "~interface"

import { useNavigate } from "./use"

export function RecordList() {
  const navigate = useNavigate()
  const [list, setList] = useState<ReadRecord[]>([])
  useEffect(() => {
    sendToBackground<never, MessageRespone<ReadRecord[]>>({
      name: "getReadList"
    }).then((res) => {
      setList(res.body)
    })
  }, [])

  async function jumpToRecord(record: ReadRecord) {
    await sendToBackground<{ record: ReadRecord }>({
      name: "openPage",
      body: { record }
    })
  }

  return (
    <div>
      <div onClick={() => navigate("edit")}>add to list</div>
      {list.map((item) => {
        return (
          <div id={item.id} onClick={() => jumpToRecord(item)} key={item.id}>
            {item.title}
          </div>
        )
      })}
    </div>
  )
}
