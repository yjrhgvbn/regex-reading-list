import { createContext, useCallback, useRef } from "react"

export type StateType = Record<string, any>
export type FormValidity<T extends StateType> = { [key in keyof T]?: (value: T[key]) => boolean | string }
interface CustomerFormProps<State extends StateType = StateType> {
  state: State
  children: React.ReactNode
  onChange: <T extends string | boolean>(key: string, value: T) => void
  onSaved?: (isValid: boolean) => void
  onCancel?: () => void
  validity?: FormValidity<State>
}
export const FormContext = createContext<Pick<CustomerFormProps, "state" | "onChange" | "validity">>({
  state: {},
  onChange: () => {}
})
export function CustomerForm(props: CustomerFormProps) {
  const { validity, state, onChange, onSaved } = props
  const ref = useRef<HTMLFormElement>(null)
  const handleSaved = useCallback(() => {
    let isValid = true
    ref.current?.reportValidity()
    if (validity) {
      for (const key in validity) {
        if (validity[key]!(state[key]) !== true) {
          isValid = false
        }
      }
    }
    if (onSaved) onSaved(isValid)
  }, [validity, state, onSaved])

  return (
    <FormContext.Provider value={{ state, onChange, validity }}>
      <form ref={ref}>
        {props.children}
        <div className="flex justify-around">
          <button
            onClick={handleSaved}
            type="submit"
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
      </form>
    </FormContext.Provider>
  )
}
