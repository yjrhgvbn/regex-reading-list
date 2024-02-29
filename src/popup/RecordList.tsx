import { Edit, Trash } from "lucide-react"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import type { GetPageInfoMessage, GetPageInfoRequest } from "~background/messages/getPageInfo"
import type { RemovePageRecordMessage, RemovePageRecordRequest } from "~background/messages/removePageRecord"
import type { MessageRespone, ReadRecord } from "~interface"

import { useNavigate } from "./use"

export function RecordList() {
  const navigate = useNavigate()
  const [list, setList] = useState<ReadRecord[]>([])
  const [curRecord, setCurRecord] = useState<ReadRecord>()
  useEffect(() => {
    sendToBackground<never, MessageRespone<ReadRecord[]>>({
      name: "getReadList"
    }).then((res) => {
      setList(res.body)
    })
  }, [])

  useEffect(() => {
    sendToBackground<GetPageInfoRequest, GetPageInfoMessage>({ name: "getPageInfo" }).then((res) => {
      if (res.body.record) {
        setCurRecord(res.body.record)
      }
    })
  })

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
    <div className="pt-1">
      <div className="flex justify-between items-center px-2 text-gray-700 font-medium">
        <div className="truncate">{curRecord ? curRecord?.title : "click add to save process"}</div>
        <button
          onClick={() => openEditPage()}
          type="button"
          className="text-gray-900 hover:bg-gray-200 hover:text-blue-700 border-gray-300 focus:outline-none bg-gray-100 rounded-md font-medium ext-sm px-2 py-1 me-2 mb-1 ">
          {curRecord ? "edit" : "add"}
        </button>
      </div>
      <ul className="max-w-md max-h-80 overflow-auto divide-y divide-gray-200 cursor-pointer border-t">
        {list.map((record) => {
          return (
            <li
              className="group"
              onClick={() => jumpToRecord(record)}
              onContextMenu={(e) => {
                e.preventDefault()
                openEditPage(record)
              }}
              key={record.id}>
              <div className="flex items-center rtl:space-x-reverse pl-2 ">
                <div className="flex-1 min-w-0 py-1  ">
                  <p className="text-xs font-medium text-gray-900 truncate flex">
                    {record.favIconUrl && <img src={record.favIconUrl} className="h-4 w-4 mr-1"></img>}
                    <span>{record.title}</span>
                  </p>
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
                    className="px-1 h-full text-sm font-medium text-blue-700 bg-white border-l hover:bg-gray-100">
                    <Trash size={20} />
                  </button>
                </div>
                <ProgressRing className="block  group-hover:hidden " progress={Math.round(record.position.progress)} />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function ProgressRing(props: { progress: number; className?: string }) {
  const { progress, className = "" } = props
  const radius = 20
  const stroke = 3
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference
  return (
    <div style={{ height: radius * 2, width: radius * 2 }} className={"relative " + className}>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#2A4DD0"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
        <span>{progress}</span>
      </div>
    </div>
  )
}
