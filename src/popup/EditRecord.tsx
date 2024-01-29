import { createContext, useCallback, useContext, useEffect, useId, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import type { MessageRespone, ReadRecord } from "~interface"

import { useNavigate } from "./use"

interface EditRecordProps {
  changeouter: (route: string) => void
}

export function EditRecord() {
  const navigate = useNavigate()
  const [formState, setFormState] = useState({
    title: "",
    url: "",
    mark: "",
    isRegex: false,
    id: ""
  })
  useEffect(() => {
    sendToBackground<
      never,
      MessageRespone<{
        url: string
        isRegex: boolean
        title: string
        id?: string
      }>
    >({
      name: "getActivePage"
    }).then((res) => {
      setFormState({
        ...formState,
        url: res.body.url,
        title: res.body.title,
        id: res.body.id,
        isRegex: res.body.isRegex ?? false
      })
    })
  }, [])

  function handleValueChange(key: string, value: string | boolean) {
    setFormState({ ...formState, [key]: value })
  }

  async function onSave() {
    await sendToBackground<Partial<ReadRecord>, MessageRespone<ReadRecord[]>>({
      name: "updatePageRecord",
      body: {
        id: formState.id,
        title: formState.title,
        match: {
          type: formState.isRegex ? "regex" : "string",
          value: formState.url
        }
      }
    })
    navigate(-1)
  }
  function onCancel() {
    navigate(-1)
  }

  return (
    <CustomerForm state={formState} onChange={handleValueChange} onSaved={onSave} onCancel={onCancel}>
      <FormInput label="title" filed="title" />
      <Formtoggle label="isRegex" filed="isRegex" />
      <FormInput label="url" filed="url" />
      <FormInput label="mark" filed="mark" />
    </CustomerForm>
  )
}
export default EditRecord

interface CustomerFormProps {
  state: Record<string, string | boolean>
  children: React.ReactNode
  onChange: <T extends string | boolean>(key: string, value: T) => void
  onSaved?: () => void
  onCancel?: () => void
}
const FormContext = createContext<Pick<CustomerFormProps, "state" | "onChange">>({ state: {}, onChange: () => {} })
function CustomerForm(props: CustomerFormProps) {
  return (
    <FormContext.Provider value={{ state: props.state, onChange: props.onChange }}>
      {props.children}
      <div className="flex justify-around">
        <button
          onClick={props.onSaved}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
          保存
        </button>
        <button
          onClick={props.onCancel}
          type="button"
          className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 ">
          取消
        </button>
      </div>
    </FormContext.Provider>
  )
}

interface FormInputProps {
  label: string
  id?: string
  filed: string
}
function FormInput(props: FormInputProps) {
  const { label, id = useId(), filed } = props
  const formContext = useContext(FormContext)
  const value = formContext.state[filed].toString()
  const onChange = formContext.onChange
  return (
    <div className="mb-6">
      <label for-html={id} className="block mb-2 text-sm font-medium text-gray-900 ">
        {label}
      </label>
      <input
        onChange={(e) => onChange(filed, e.target.value)}
        value={value}
        type="text"
        id={id}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      />
    </div>
  )
}

interface FormToggleProps {
  label: string
  id?: string
  filed: string
}

function Formtoggle(props: FormToggleProps) {
  const { label, id = useId(), filed } = props
  const formContext = useContext(FormContext)
  const value = Boolean(formContext.state[filed])
  const onChange = formContext.onChange
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={value}
        className="sr-only peer"
        onChange={(e) => onChange(filed, e.target.checked)}
        id={id}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-600"></div>
      <span className="ms-3 text-sm font-medium text-gray-900">{label}</span>
    </label>
  )
}
