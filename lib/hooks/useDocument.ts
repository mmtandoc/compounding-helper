import { useEffect, useState } from "react"

export const useDocument = () => {
  const [myDocument, setMyDocument] = useState<Document | null>(null)

  useEffect(() => {
    setMyDocument(document)
  }, [])

  return myDocument
}
