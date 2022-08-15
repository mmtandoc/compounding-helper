import React from "react"

const SuggestionItem = <T,>(props: {
  index: number
  item: T
  getItemValue: (item: T) => string
  renderSuggestion: (item: T) => JSX.Element
  onClick?: (item: T) => void
  isSelected?: boolean
}) => {
  const handleClick = () => {
    props.onClick?.(props.item)
  }
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <li
      role="option"
      className={props.isSelected ? "selected" : undefined}
      onMouseDown={(e) => e.preventDefault()}
      onClick={handleClick}
      aria-selected={props.isSelected}
    >
      {props.renderSuggestion(props.item)}
    </li>
  )
}

SuggestionItem.defaultProps = {
  onClick: () => undefined,
}

export default SuggestionItem
