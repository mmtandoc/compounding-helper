import React, { ReactNode, useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"

import { printDetails } from "components/common/styles"
import { Button } from "components/ui"
import { ButtonProps } from "components/ui/Button"

export const BatchPrintButton = (
  props: {
    documentTitle?: string
    documents: ReactNode[]
    children: ReactNode
  } & ButtonProps,
) => {
  const { documents, documentTitle, children, ...buttonProps } = props

  const componentRef = useRef(null)

  const [isPrinting, setIsPrinting] = useState(false)

  // We store the resolve Promise being used in `onBeforeGetContent` here
  const promiseResolveRef = React.useRef<((_?: any) => void) | null>(null)

  // We watch for the state to change here, and for the Promise resolve to be available
  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
      promiseResolveRef.current()
    }
  }, [isPrinting])

  const handlePrintAll = useReactToPrint({
    content: () => componentRef.current,
    documentTitle,
    bodyClass: "print-body",
    onBeforeGetContent: () => {
      return new Promise<undefined>((resolve) => {
        promiseResolveRef.current = resolve
        setIsPrinting(true)
      })
    },
    onAfterPrint: () => {
      // Reset the Promise resolve so we can print again
      promiseResolveRef.current = null
      setIsPrinting(false)
    },
  })

  return (
    <div className="batch-print-button">
      <div style={{ display: "none" }}>
        <div className="print-body" ref={componentRef}>
          {isPrinting &&
            documents.map((doc, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="page-break" />}
                {doc}
              </React.Fragment>
            ))}
        </div>
      </div>
      <Button
        {...buttonProps}
        onClick={(e) => {
          //buttonProps?.onClick?.(e)
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
