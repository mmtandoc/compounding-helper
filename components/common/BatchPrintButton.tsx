import { SnackbarKey, closeSnackbar, enqueueSnackbar } from "notistack"
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useReactToPrint } from "react-to-print"

import { Button } from "components/ui"
import { ButtonProps } from "components/ui/Button"

type Props = {
  documentTitle?: string
  children: ReactNode
  documents: (ReactNode | ((props: { onLoaded: () => void }) => JSX.Element))[]
} & ButtonProps

export const BatchPrintButton = (props: Props) => {
  const { documents, documentTitle, children, ...buttonProps } = props

  const componentRef = useRef(null)

  const [isPrinting, setIsPrinting] = useState(false)

  const [docsLoadedCount, setDocsLoadedCount] = useState(
    documents.filter((doc) => typeof doc !== "function").length,
  )

  useEffect(() => {
    setDocsLoadedCount(
      documents.filter((doc) => typeof doc !== "function").length,
    )
  }, [documents])

  // We store the resolve Promise being used in `onBeforeGetContent` here
  const promiseResolveRef = React.useRef<((_?: unknown) => void) | null>(null)

  const isLoaded = useMemo(
    () => docsLoadedCount === documents.length,
    [docsLoadedCount, documents.length],
  )

  // We watch for the state to change here, and for the Promise resolve to be available
  useEffect(() => {
    if (isPrinting && promiseResolveRef.current && isLoaded) {
      // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
      promiseResolveRef.current()
    }
  }, [isLoaded, isPrinting])

  const printPrepAlertKeyRef = React.useRef<SnackbarKey | null>(null)

  const handlePrintAll = useReactToPrint({
    content: () => componentRef.current,
    documentTitle,
    bodyClass: "print-body",
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        const key = enqueueSnackbar("Preparing to print...", {
          autoHideDuration: 5000,
        })
        printPrepAlertKeyRef.current = key
        promiseResolveRef.current = resolve
        setIsPrinting(true)
      })
    },
    onAfterPrint: () => {
      // Reset the Promise resolve so we can print again
      promiseResolveRef.current = null
      setIsPrinting(false)
      setDocsLoadedCount(
        documents.filter((doc) => typeof doc !== "function").length,
      )

      const key = printPrepAlertKeyRef.current
      if (key === null) return

      closeSnackbar(key)
      printPrepAlertKeyRef.current = null
    },
  })

  const handleLoaded = useCallback(() => {
    setDocsLoadedCount((prevCount) => prevCount + 1)
  }, [])

  return (
    <div className="batch-print-button">
      <div style={{ display: "none" }}>
        <div className="print-body" ref={componentRef}>
          {isPrinting &&
            documents.map((Doc, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="page-break" />}
                {typeof Doc === "function" ? (
                  <Doc onLoaded={handleLoaded} />
                ) : (
                  Doc
                )}
              </React.Fragment>
            ))}
        </div>
      </div>
      <Button
        {...buttonProps}
        onClick={(e) => {
          buttonProps?.onClick?.(e)
          handlePrintAll()
        }}
      >
        {children}
      </Button>
      <style jsx global>{`
        @media all {
          .page-break {
            display: none;
          }
        }

        @media print {
          html,
          body {
            height: initial !important;
            overflow: initial !important;
            -webkit-print-color-adjust: exact;
          }

          .print-body {
            margin: 0;
            padding: 0;
          }

          .print-hide {
            display: none !important;
          }

          .page-break {
            margin-top: 1rem;
            display: block;
            break-before: always;
          }
        }

        @page {
          size: auto;
          margin: 1.5cm;
          font-size: 12px;
          print-color-adjust: exact;
        }
      `}</style>
    </div>
  )
}
