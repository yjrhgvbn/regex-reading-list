import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import clsx from "clsx"
import { Edit, Trash } from "lucide-react"
import { memo, useCallback } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import type { ReadRecord } from "~interface"

import { useNavigate } from "../use"
import { ProgressRing } from "./ProgressRing"

interface RecordListDragItemProps {
  record: ReadRecord
  deleteRecord?: (record: ReadRecord) => void
}

export const RecordListDragItem = memo((props: RecordListDragItemProps) => {
  const { record, deleteRecord } = props
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: record.id })
  const navigate = useNavigate()
  const jumpToRecord = useCallback(async () => {
    await sendToBackground<{ record: ReadRecord }>({
      name: "openPage",
      body: { record }
    })
  }, [record])

  const onDeleteRecord = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      deleteRecord(record)
    },
    [deleteRecord]
  )

  const openEditPage = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      navigate("edit", { id: record.id })
    },
    [navigate]
  )
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }
  return (
    <li
      className={clsx("group border-b ")}
      onClick={jumpToRecord}
      onContextMenu={openEditPage}
      key={record.id}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}>
      <RecordItem record={record}>
        <div className="hidden self-stretch group-hover:flex items-center text-base font-semibold text-gray-900 ">
          <button
            onClick={openEditPage}
            type="button"
            className="px-1 h-full text-sm font-medium text-blue-700 bg-white border-l hover:bg-gray-100">
            <Edit size={20} />
          </button>
          <button
            onClick={onDeleteRecord}
            type="button"
            className="px-1 h-full text-sm font-medium text-blue-700 bg-white border-l hover:bg-gray-100">
            <Trash size={20} />
          </button>
        </div>
        <ProgressRing className="block group-hover:hidden " progress={Math.round(record.position.progress)} />
      </RecordItem>
    </li>
  )
})
interface RecordItemProps {
  record: ReadRecord
  children?: React.ReactNode
  isDragging?: boolean
}
export function RecordItem(props: RecordItemProps) {
  const { record, children, isDragging } = props
  return (
    <div className={clsx("flex items-center rtl:space-x-reverse pl-2 bg-white", isDragging && "border cursor-move")}>
      <div className="flex-1 min-w-0 py-1  ">
        <p className="text-xs font-medium text-gray-900 truncate flex">
          {record.favIconUrl && <img src={record.favIconUrl} className="h-4 w-4 mr-1"></img>}
          <span>{record.title}</span>
        </p>
        <p className="text-xs text-gray-500 truncate ">{record.currentUrl}</p>
      </div>
      {children}
    </div>
  )
}

export default RecordListDragItem
