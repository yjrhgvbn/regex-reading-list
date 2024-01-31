import { useCallback, useContext, useId, useRef } from "react"

import { FormContext } from "./Form"
import { useValidity } from "./use"

interface FormToggleProps {
  label: string
  id?: string
  filed: string
  onChange?: (value: boolean) => void
}
export function Formtoggle(props: FormToggleProps) {
  const { label, id = useId(), filed, onChange } = props
  const ref = useRef<HTMLInputElement>(null)
  const formContext = useContext(FormContext)
  const value = Boolean(formContext.state[filed])
  const validity = formContext.validity?.[filed]
  const { onChange: contextOnChange } = formContext
  const { handleValidity } = useValidity(value, ref, validity)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.checked
      contextOnChange(filed, value)
      onChange && onChange(value)
      handleValidity(value)
    },
    [filed, onChange, contextOnChange, validity]
  )

  return (
    <label className="relative flex items-center cursor-pointer">
      <input ref={ref} type="checkbox" checked={value} className="sr-only peer" onChange={handleChange} id={id} />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-600"></div>
      <span className="ms-3 text-sm font-medium text-gray-900">{label}</span>
    </label>
  )
}
