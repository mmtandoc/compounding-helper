import {
  CustomContentProps,
  MaterialDesignContent,
  SnackbarContent,
} from "notistack"
import React, { ReactNode } from "react"
import { IconType } from "react-icons"
import { MdCheckCircle, MdError, MdInfo, MdWarning } from "react-icons/md"

type AlertProps = CustomContentProps

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (props, ref) => {
    return (
      <div className="alert" ref={ref}>
        <MaterialDesignContent {...props} />

        <style jsx global>{`
          .alert {
            .notistack-MuiContent {
              font-size: var(--font-size-sm);
            }

            .notistack-MuiContent-error {
              background-color: var(--color-danger-subtle);
              color: var(--color-danger-fg);
              border-color: var(--color-danger-muted);
            }

            .notistack-MuiContent-warning {
              background-color: var(--color-attention-subtle);
              color: var(--color-attention-fg);
              border-color: var(--color-attention-muted);
            }

            .notistack-MuiContent-success {
              background-color: var(--color-success-subtle);
              color: var(--color-success-fg);
              border-color: var(--color-success-muted);
            }

            .notistack-MuiContent-info {
              background-color: var(--color-accent-subtle);
              color: var(--color-accent-fg);
              border-color: var(--color-accent-muted);
            }
          }
        `}</style>
      </div>
      /* <style jsx>{`
    <div className={`alert ${variant}`}>
      {AlertIcon && (
        <div className="icon">
          <AlertIcon height="2em" />
        </div>
      )}
        .alert {
          padding: 0.6rem 1.6rem;
          border-radius: 0.4rem;
          display: flex;
          align-items: center;

          > .icon {
            display: flex;
            font-size: var(--font-size-lg);
            opacity: 0.9;
            margin-right: 0.6rem;
          }

          &.error {
            background-color: var(--color-danger-subtle);
            color: var(--color-danger-fg);
            border-color: var(--color-danger-muted);
          }

          &.warning {
            background-color: var(--color-attention-subtle);
            color: var(--color-attention-fg);
            border-color: var(--color-attention-muted);
          }

          &.success {
            background-color: var(--color-success-subtle);
            color: var(--color-success-fg);
            border-color: var(--color-success-muted);
          }

          &.info {
            background-color: var(--color-accent-subtle);
            color: var(--color-accent-fg);
            border-color: var(--color-accent-muted);
          }
        }
      `}</style>
    </div> */
    )
  },
)

Alert.displayName = "Alert"
