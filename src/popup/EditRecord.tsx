import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import type { GetPageInfoMessage, GetPageInfoRequest } from "~background/messages/getPageInfo"
import type { MessageRespone, ReadRecord } from "~interface"

import { CustomerForm, FormInput, Formtoggle } from "./Form"
import type { FormValidity } from "./Form/Form"
import { useNavigate } from "./use"

export function EditRecord(props: { id?: string }) {
  const { id } = props
  const navigate = useNavigate()
  const [formState, setFormState] = useState({
    title: "",
    url: "",
    mark: "",
    isRegex: false,
    id: "",
    currentUrl: ""
  })
  useEffect(() => {
    sendToBackground<GetPageInfoRequest, GetPageInfoMessage>({ name: "getPageInfo", body: { id } }).then((res) => {
      setFormState({
        ...formState,
        url: res.body.url,
        title: res.body.title,
        id: res.body.id || "",
        isRegex: res.body.isRegex ?? false,
        currentUrl: res.body.currentUrl
      })
    })
  }, [])

  function handleValueChange(key: string, value: string | boolean) {
    setFormState({ ...formState, [key]: value })
  }

  const validity: FormValidity<typeof formState> = {
    url: () => {
      try {
        if (formState.isRegex) {
          if (!new RegExp(formState.url).test(formState.currentUrl)) return "正则表达式必须匹配"
        }
        return true
      } catch (e) {
        return "正则表达式错误"
      }
    }
  }

  async function onSave(isValid: boolean) {
    if (!isValid) return
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

  function onRegexChange(value: boolean) {
    const newSate = { ...formState, isRegex: value }
    if (!value) newSate.url = formState.currentUrl
    setFormState(newSate)
  }
  return (
    <>
      <div className="mb-2">{formState.currentUrl} </div>
      <CustomerForm
        state={formState}
        onChange={handleValueChange}
        onSaved={onSave}
        onCancel={onCancel}
        validity={validity}>
        <FormInput label="title" filed="title" />
        <Formtoggle label="isRegex" filed="isRegex" onChange={onRegexChange} />
        <FormInput label="url" filed="url" disabled={!formState.isRegex} />
        <FormInput label="mark" filed="mark" />
      </CustomerForm>
    </>
  )
}
export default EditRecord
