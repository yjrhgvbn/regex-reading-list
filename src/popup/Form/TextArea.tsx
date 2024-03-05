import { useCallback, useContext, useEffect, useId, useRef } from "react"

import { FormContext } from "./Form"
import { useValidity } from "./use"

interface FormInputProps {
  label: string
  id?: string
  filed: string
  disabled?: boolean
  onChange?: (value: string) => void
}
export function FormTextArea(props: FormInputProps) {
  const { label, id = useId(), filed, disabled, onChange } = props
  const ref = useRef<HTMLTextAreaElement>(null)
  const formContext = useContext(FormContext)
  const value = formContext.state[filed] as string
  const { onChange: contextOnChange } = formContext
  const { handleValidity } = useValidity(filed, ref)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      contextOnChange(filed, value)
      onChange && onChange(value)
      handleValidity(value)
    },
    [filed, onChange, contextOnChange, handleValidity]
  )

  return (
    <div className="mb-6">
      <label for-html={id} className="block mb-2 text-sm font-medium text-gray-900 ">
        {label}
      </label>
      <textarea
        ref={ref}
        onChange={handleChange}
        value={value}
        id={id}
        disabled={disabled}
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>
  )
}
