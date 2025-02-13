import { useRef } from 'react'

export function useInitialValue<T>(value: T, condition = true): T {
  let initialValue = useRef(value).current
  return condition ? initialValue : value
}
