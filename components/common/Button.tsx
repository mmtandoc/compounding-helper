import React from "react"

type HtmlButtonAttributes = JSX.IntrinsicElements["button"]

interface Props extends HtmlButtonAttributes {
  size?: "small" | "normal" | "large"
  theme?: "primary" | "secondary" | "tertiary" | "neutral"
}

const Button = (props: Props) => {
  const { size, theme, children, className, ...buttonProps } = props
  return (
    <button
      {...buttonProps}
      type={buttonProps.type ?? "button"}
      className={`${className ?? ""} ${size ?? ""} ${theme ?? ""}`}
    >
      {children}
      <style jsx>{`
        %button-small {
          font-size: var(--button-font-size-small) !important;
          padding: 0.15rem 0.8rem;
        }

        %button-medium {
          font-size: var(--button-font-size);
          padding: 0.3rem 1.2rem;
        }

        %button-large {
          font-size: var(--button-font-size-large) !important;
          padding: 0.45rem 1.3rem;
        }

        button,
        .button {
          @extend %button-medium;

          position: relative;
          display: inline-block;
          border-radius: 0.5rem;
          line-height: 2rem;
          font-weight: 500;
          font-family: inherit;
          white-space: nowrap;
          vertical-align: middle;
          cursor: pointer;
          user-select: none;
          border: 1px solid var(--color-button-border);
          background-color: var(--color-button-bg);
          color: var(--color-button-fg);
          text-decoration: none;
          appearance: none;

          &.large {
            @extend %button-large;
          }

          &.small {
            @extend %button-small;
          }

          &:disabled {
            background-color: var(--color-button-disabled-bg);
            color: var(--color-button-disabled-fg);
            border-color: var(--color-button-disabled-border);
            cursor: default;
          }

          &:hover:not(:disabled) {
            background-color: var(--color-button-hover-bg);
            border-color: var(--color-button-hover-border);
          }

          &.primary {
            background-color: var(--color-primary);
            color: var(--color-white);
            border-color: var(--color-primary);

            &:hover:not(:disabled) {
              background-color: var(--color-primary-light);
              color: var(--color-white);
              border-color: var(--color-primary-light);
            }
          }
        }
      `}</style>
    </button>
  )
}

export default Button
