import { Edit, Trash } from "lucide-react"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import type {
  RemovePageRecordMessage,
  RemovePageRecordRequest,
  RemovePageRecordResponse
} from "~background/messages/removePageRecord"
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

  function openEditPage(item?: ReadRecord) {
    if (item) {
      navigate("edit", { id: item.id })
    } else {
      navigate("edit")
    }
  }

  function deleteRecord(item: ReadRecord) {
    sendToBackground<RemovePageRecordRequest, RemovePageRecordMessage>({
      name: "removePageRecord",
      body: { id: item.id }
    }).then((res) => {
      if (!res.body) return
      setList(res.body)
    })
  }

  return (
    <div>
      <div onClick={() => openEditPage()}>add to list</div>
      <ul className="max-w-md divide-y divide-gray-200 cursor-pointer border-y">
        {list.map((record) => {
          return (
            <li className="group" onClick={() => jumpToRecord(record)} key={record.id}>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="flex-1 min-w-0 py-1 ">
                  <p className="text-xs font-medium text-gray-900 truncate">{record.title}</p>
                  <p className="text-xs text-gray-500 truncate ">{record.currentUrl}</p>
                </div>
                <div className="hidden self-stretch group-hover:flex items-center text-base font-semibold text-gray-900 ">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditPage(record)
                    }}
                    type="button"
                    className="px-1 h-full text-sm font-medium text-blue-700 bg-white border-l hover:bg-gray-100">
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteRecord(record)
                    }}
                    type="button"
                    className="px-1 h-full text-sm font-medium text-blue-700 bg-white border-x hover:bg-gray-100">
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
