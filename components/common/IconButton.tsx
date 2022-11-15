import React from "react"
import { IconBaseProps, IconType } from "react-icons"
import css from "styled-jsx/css"

import Button, { ButtonProps } from "./Button"

type IconButtonProps = ButtonProps & {
  icon: IconType
  iconProps?: IconBaseProps
}

const IconButton = (props: IconButtonProps) => {
  const { icon: Icon, iconProps, children, className, ...buttonProps } = props
  return (
    <Button
      {...buttonProps}
      className={`${className ?? ""} icon-button ${styleClassName}`}
    >
      <Icon {...iconProps} />
      {children}
      {styles}
    </Button>
  )
}

const { className: styleClassName, styles } = css.resolve`
  %icon-button-extra-small {
    padding: 0.15rem 0.2rem;
    column-gap: 0.1rem;
  }

  %icon-button-small {
    padding: 0.3rem 0.4rem;
    column-gap: 0.2rem;
  }

  %icon-button-medium {
    padding: 0.6rem 0.7rem;
    column-gap: 0.3rem;
  }

  %icon-button-large {
    padding: 0.9rem 1.2rem;
    column-gap: 0.5rem;
  }

  button.icon-button {
    @extend %icon-button-medium;

    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: min-content;
    height: min-content;
    margin-left: 0.5rem;

    &.extra-small {
      @extend %icon-button-extra-small;
    }

    &.small {
      @extend %icon-button-small;
    }

    &.medium {
      @extend %icon-button-medium;
    }

    &.large {
      @extend %icon-button-large;
    }
  }
`
export default IconButton
