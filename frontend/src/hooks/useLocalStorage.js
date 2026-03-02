import { useCallback } from 'react'

export const useLocalStorage = (key, initialValue) => {
  const getItem = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  }, [key, initialValue])

  const setItem = useCallback((value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }, [key])

  return [getItem(), setItem]
}
