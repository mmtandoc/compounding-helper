import React from "react"
import { IconBaseProps, IconType } from "react-icons"

type HtmlButtonAttributes = JSX.IntrinsicElements["button"]

export interface ButtonProps extends HtmlButtonAttributes {
  startIcon?: IconType
  startIconProps?: IconBaseProps
  endIcon?: IconType
  endIconProps?: IconBaseProps
  size?: "extra-small" | "small" | "medium" | "large"
  theme?: "primary" | "neutral"
  variant?: "text" | "contained" // | "outline"
}

const Button = (props: ButtonProps) => {
  const {
    size = "medium",
    theme = "neutral",
    variant = "contained",
    children,
    className,
    startIcon: StartIcon,
    startIconProps,
    endIcon: EndIcon,
    endIconProps,
    ...buttonProps
  } = props
  return (
    <button
      {...buttonProps}
      type={buttonProps.type ?? "button"}
      className={`button ${className ?? ""} ${size ?? ""} ${theme ?? ""} ${
        variant ?? ""
      }`}
    >
      {StartIcon && (
        <span className="start-icon">
          <StartIcon {...startIconProps} />
        </span>
      )}
      {children}
      {EndIcon && (
        <span className="end-icon">
          <EndIcon {...endIconProps} />
        </span>
      )}
      <style jsx>{`
        @mixin button-variant-text($fgColor, $disabledFgColor) {
          border: none;
          background-color: transparent;
          color: $fgColor;

          &:hover {
            background-color: rgba(0, 0, 0, 0.04);
            border-color: transparent;
          }

          &:active {
            background-color: transparent;
            border-color: transparent;
          }

          &:disabled {
            background-color: transparent;
            color: $disabledFgColor;
            border-color: transparent;
          }
        }

        .start-icon {
          margin-right: 0.3rem;
        }

        .end-icon {
          margin-left: 0.3rem;
        }

        .button {
          position: relative;
          display: inline-block;
          border-radius: 0.5rem;
          line-height: 2rem;
          font-weight: normal;
          font-family: inherit;
          white-space: nowrap;
          vertical-align: middle;
          cursor: pointer;
          user-select: none;
          text-decoration: none;
          appearance: none;

          &:disabled {
            cursor: default;
          }

          // === Sizes ===
          &.large {
            font-size: var(--button-font-size-large);
            padding: 0.45rem 1.3rem;
          }

          &.small {
            font-size: var(--button-font-size-small);
            padding: 0.15rem 0.8rem;
          }

          &.medium {
            font-size: var(--button-font-size);
            padding: 0.3rem 1.2rem;
          }

          &.extra-small {
            font-size: var(--button-font-size-small);
            padding: 0.1rem 0.1rem;
          }
          // Themes

          &.neutral {
            border: 1px solid var(--color-button-border);
            background-color: var(--color-button-bg);
            color: var(--color-button-fg);

            &:hover {
              background-color: var(--color-button-hover-bg);
              border-color: var(--color-button-hover-border);
            }

            &:active {
              background-color: var(--color-button-active-bg);
              border-color: var(--color-button-active-border);
            }

            &:disabled {
              background-color: var(--color-button-disabled-bg);
              color: var(--color-button-disabled-fg);
              border-color: var(--color-button-disabled-border);
            }

            &.text {
              @include button-variant-text(
                var(--color-button-fg),
                var(--color-button-disabled-fg)
              );
            }
          }

          &.primary {
            border: var(--border-default);
            border-color: var(--color-button-primary-border);
            background-color: var(--color-button-primary-bg);
            color: var(--color-button-primary-fg);

            &:hover {
              background-color: var(--color-button-primary-hover-bg);
              border-color: var(--color-button-primary-hover-border);
            }

            &:active {
              background-color: var(--color-button-primary-active-bg);
              border-color: var(--color-button-primary-active-border);
            }

            &:disabled {
              background-color: var(--color-button-primary-disabled-bg);
              color: var(--color-button-primary-disabled-fg);
              border-color: var(--color-button-primary-disabled-border);
            }

            &.text {
              @include button-variant-text(
                var(--color-button-primary-fg),
                var(--color-button-primary-disabled-fg)
              );
            }
          }
        }
      `}</style>
    </button>
  )
}

export default Button
