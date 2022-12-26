import { createContext } from "react"

export const PageRefContext =
  createContext<React.RefObject<HTMLDivElement> | null>(null)
