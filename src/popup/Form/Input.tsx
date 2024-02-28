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
export function FormInput(props: FormInputProps) {
  const { label, id = useId(), filed, disabled, onChange } = props
  const ref = useRef<HTMLInputElement>(null)
  const formContext = useContext(FormContext)
  const value = formContext.state[filed] as string
  const validity = formContext.validity?.[filed]
  const { onChange: contextOnChange } = formContext
  const { handleValidity } = useValidity(value, ref, validity)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      contextOnChange(filed, value)
      onChange && onChange(value)
      handleValidity(value)
    },
    [filed, onChange, contextOnChange, validity]
  )

  return (
    <div className="mb-6">
      <label for-html={id} className="block mb-2 text-sm font-medium text-gray-900 ">
        {label}
      </label>
      <input
        ref={ref}
        onChange={handleChange}
        value={value}
        type="text"
        id={id}
        disabled={disabled}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
      />
    </div>
  )
}
