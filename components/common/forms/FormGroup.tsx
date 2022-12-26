import React from "react"
import css from "styled-jsx/css"

//TODO: Refactor into BaseFormGroup with 'as' prop supporting any element type

type FormGroupProps = JSX.IntrinsicElements["div"] & { row?: boolean }

export const FormGroup = (props: FormGroupProps) => {
  const { row = false, children, ...divProps } = props
  return (
    <div
      {...divProps}
      className={`${divProps.className ?? ""} form-group ${row ? "row" : ""}`}
    >
      {children}
      <style jsx global>
        {style}
      </style>
    </div>
  )
}

type LabelFormGroupProps = JSX.IntrinsicElements["label"] & { row?: boolean }

export const LabelFormGroup = (props: LabelFormGroupProps) => {
  const { row = false, children, ...labelProps } = props
  return (
    <label
      {...labelProps}
      className={`${labelProps.className ?? ""} form-group ${row ? "row" : ""}`}
    >
      {children}
      <style jsx global>
        {style}
      </style>
    </label>
  )
}

const style = css.global`
  %form-group-label {
    font-weight: 600;

    &:not(:only-child) {
      margin-bottom: 0.3rem;
    }

    > span:only-child,
    > :not(span:first-child) {
      font-weight: initial;

      * {
        font-weight: initial;
      }
    }

    &:not(.row) > :where(span, p):first-child {
      width: fit-content;
      margin-bottom: 0.3rem;
      display: block;
    }
  }

  .form-group {
    padding-block: 0.1rem 0.1rem;
    min-inline-size: min-content;
    display: flex;
    flex-direction: column;

    &.row {
      flex-direction: row;
    }

    textarea {
      resize: vertical;
      width: 100%;
    }

    > :where(label, .label) {
      @extend %form-group-label;
      width: fit-content;
    }

    &.row > :where(label, .label) {
      margin-bottom: 0;
    }
  }

  label.form-group,
  .label.form-group {
    @extend %form-group-label;

    > span:only-child:not(span:first-child) {
      font-weight: initial;

      * {
        font-weight: initial;
      }
    }
  }
`
