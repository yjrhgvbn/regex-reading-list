import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext } from "@dnd-kit/sortable"
import { useCallback, useEffect, useState } from "react"
import { createPortal } from "react-dom"

import { sendToBackground } from "@plasmohq/messaging"

import type { GetPageInfoMessage, GetPageInfoRequest } from "~background/messages/getPageInfo"
import type { RemovePageRecordMessage, RemovePageRecordRequest } from "~background/messages/removePageRecord"
import type { SwapPageRecordMessage, SwapPageRecordRequest } from "~background/messages/swapPageRecord"
import type { MessageRespone, ReadRecord } from "~interface"

import { useNavigate } from "../use"
import RecordListDragItem, { RecordItem } from "./ListItem"

export function RecordList() {
  const navigate = useNavigate()
  const [list, setList] = useState<ReadRecord[]>([])
  const [curRecord, setCurRecord] = useState<ReadRecord>()
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const draggingRecord = list.find((record) => record.id === draggingId)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  )
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

  function createNewRecord() {
    navigate("edit")
  }

  const deleteRecord = useCallback(
    (item: ReadRecord) => {
      sendToBackground<RemovePageRecordRequest, RemovePageRecordMessage>({
        name: "removePageRecord",
        body: { id: item.id }
      }).then((res) => {
        if (!res.body) return
        setList(res.body)
      })
    },
    [setList]
  )

  const swapRecord = useCallback(
    (id: string, overId: string) => {
      const index = list.findIndex((item) => item.id === id)
      const overIndex = list.findIndex((item) => item.id === overId)
      if (index === -1 || overIndex === -1) return
      const [removed] = list.splice(index, 1)
      list.splice(overIndex, 0, removed)
      setList([...list])
      sendToBackground<SwapPageRecordRequest, SwapPageRecordMessage>({
        name: "swapPageRecord",
        body: { id, overId }
      }).then((res) => {
        if (!res.body) return
        setList(res.body)
      })
    },
    [list, setList]
  )

  return (
    <div className="pt-1">
      <div className="flex justify-between items-center px-2 text-gray-700 font-medium">
        <div className="truncate">{curRecord ? curRecord?.title : "click add to save process"}</div>
        <button
          onClick={createNewRecord}
          type="button"
          className="text-gray-900 hover:bg-gray-200 hover:text-blue-700 border-gray-300 focus:outline-none bg-gray-100 rounded-md font-medium ext-sm px-2 py-1 me-2 mb-1 ">
          {curRecord ? "edit" : "add"}
        </button>
      </div>
      <DndContext
        sensors={sensors}
        onDragStart={({ active }) => {
          setDraggingId(active.id as string)
        }}
        onDragEnd={({ over }) => {
          if (over) {
            swapRecord(draggingId!, over.id as string)
          }
          setDraggingId(null)
        }}>
        <SortableContext items={list.map((item) => item.id)}>
          <ul className="max-w-md max-h-80 overflow-auto cursor-pointer border-t">
            {list.map((record) => {
              return <RecordListDragItem record={record} deleteRecord={deleteRecord} key={record.id} />
            })}
          </ul>
        </SortableContext>
        {createPortal(
          <DragOverlay adjustScale={true}>
            {draggingRecord ? <RecordItem record={draggingRecord} isDragging /> : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  )
}
