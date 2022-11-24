import _ from "lodash"
import React, { ReactNode } from "react"
import {
  FieldValues,
  RegisterOptions,
  UseControllerProps,
  useController,
  useFormContext,
} from "react-hook-form"
import { Merge } from "type-fest"

import ErrorContainer from "./ErrorContainer"

type SelectAttributes = JSX.IntrinsicElements["select"]

interface SelectProps extends SelectAttributes {
  children: ReactNode
  fullWidth?: boolean
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (props, ref) => {
    const { children, fullWidth, ...selectProps } = props

    selectProps.className = `${selectProps.className ?? ""}${
      fullWidth ? " full-width" : ""
    }`

    return (
      <select {...selectProps} ref={ref}>
        {children}
        <style jsx>{`
          select {
            font-size: 1.6rem;
            border: 1px solid var(--color-select-border);
            background-color: var(--color-select-bg);
            border-radius: 0.3rem;
            appearance: none;
            padding-right: 2.4rem;

            /*
            SVG icon from boxicons (boxicons.com)
            The MIT License (MIT)

            Copyright (c) 2015-2021 Aniket Suvarna

            Permission is hereby granted, free of charge, to any person obtaining a copy
            of this software and associated documentation files (the "Software"), to deal
            in the Software without restriction, including without limitation the rights
            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
            copies of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions:

            The above copyright notice and this permission notice shall be included in all
            copies or substantial portions of the Software.

            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
            */
            background-image: url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z'/></svg>");
            background-repeat: no-repeat;
            background-position: right 0 center;
            background-size: 1.6rem;

            &:hover {
              background-color: var(--color-select-hover-bg);
              border-color: var(--color-select-hover-border);
            }

            &:active {
              background-color: var(--color-select-active-bg);
              border-color: var(--color-select-active-border);
            }

            > :global(option) {
              background-color: var(--color-field-bg);
            }

            &:disabled {
              border-color: var(--color-select-disabled-border);
              background-color: var(--color-select-disabled-bg);
              color: var(--color-select-disabled-fg);
              background-image: url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' fill='lightgray' width='24' height='24' viewBox='0 0 24 24'><path d='M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z'/></svg>");
              pointer-events: none;
            }

            .invalid &,
            &.invalid {
              background-color: var(--color-field-invalid-bg) !important;
            }

            &.full-width {
              width: 100%;
            }
          }
        `}</style>
      </select>
    )
  },
)

Select.displayName = "Select"

export default Select
