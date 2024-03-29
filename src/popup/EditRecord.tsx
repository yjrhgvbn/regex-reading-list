import { useEffect, useState } from "react"
import TimeAgo from "react-timeago"

import { sendToBackground } from "@plasmohq/messaging"

import type { GetPageInfoMessage, GetPageInfoRequest } from "~background/messages/getPageInfo"
import type { GetRecordMessage, GetRecordRequest } from "~background/messages/getRecord"

import { CustomerForm, FormInput, Formtoggle } from "./Form"
import type { FormValidity } from "./Form/Form"
import { FormTextArea } from "./Form/TextArea"
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
    currentUrl: "",
    favIconUrl: "",
    createAt: new Date().getTime(),
    progress: 0
  })
  useEffect(() => {
    if (!id) {
      sendToBackground<GetPageInfoRequest, GetPageInfoMessage>({ name: "getPageInfo" }).then((res) => {
        if (!res.body) return
        setFormState({
          ...formState,
          ...res.body,
          id: res.body.id || "",
          isRegex: res.body.isRegex ?? false,
          favIconUrl: res.body.favIconUrl || ""
        })
      })
    } else {
      sendToBackground<GetRecordRequest, GetRecordMessage>({ name: "getRecord", body: { id } }).then((res) => {
        if (!res.body) return
        setFormState({
          ...formState,
          ...res.body,
          id: res.body.id || "",
          isRegex: res.body.isRegex ?? false,
          favIconUrl: res.body.favIconUrl || ""
        })
      })
    }
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
    const body = {
      id: formState.id,
      title: formState.title,
      match: {
        type: formState.isRegex ? "regex" : "string",
        value: formState.url
      }
    }
    await sendToBackground({
      name: formState.id ? "updatePageRecord" : "addPageRecord",
      body
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
    <div className="m-2">
      <div className="mb-2">
        <div className="flex justify-between">
          {formState.favIconUrl && <img src={formState.favIconUrl} className="h-4 w-4 mr-2"></img>}
          <div className="text-gray-500">
            {`${Math.round(formState.progress)}% · `}
            <TimeAgo
              date={formState.createAt}
              // formatter={(value, unit, suffix) => <span className="text-gray-500">{`${value} ${unit} ${suffix}`}</span>}
            />
          </div>
        </div>
        <span>{formState.currentUrl}</span>
      </div>
      <div className="border-t -mx-2 mb-2"></div>
      <CustomerForm
        state={formState}
        onChange={handleValueChange}
        onSaved={onSave}
        onCancel={onCancel}
        validity={validity}>
        <FormInput label="title" filed="title" />
        <Formtoggle label="isRegex" filed="isRegex" onChange={onRegexChange} />
        <FormTextArea label="url" filed="url" disabled={!formState.isRegex} />
        <FormInput label="mark" filed="mark" />
      </CustomerForm>
    </div>
  )
}

export default EditRecord
