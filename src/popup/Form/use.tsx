import { useCallback, useEffect } from "react"

export function useValidity(
  value: string | boolean,
  ref: React.RefObject<HTMLInputElement>,
  validity: ((value: any) => string | boolean) | undefined
) {
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
