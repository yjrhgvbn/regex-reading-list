import { useCallback, useContext, useEffect } from "react"

import { FormContext } from "./Form"

export function useValidity(filed: string, ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement>) {
  const formContext = useContext(FormContext)
  const value = formContext.state[filed] as string
  const validity = formContext.validity?.[filed]
  const handleValidity = useCallback(
    (value: string | boolean) => {
      const inputRef = ref.current
      if (validity && inputRef) {
        const validityRes = validity(value)
        if (validityRes === true) return inputRef.setCustomValidity("")
        inputRef.setCustomValidity(typeof validityRes === "string" ? validityRes : "校验失败")
        inputRef.reportValidity()
      }
    },
    [validity]
  )

  useEffect(() => {
    handleValidity(value)
  }, [value])
  return { handleValidity }
}
