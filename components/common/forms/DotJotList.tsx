import React, { useState } from "react"
import { MdClose } from "react-icons/md"

import Button from "components/common/Button"

import IconButton from "../IconButton"

type DotJotItem = { text: string; readOnly?: boolean }

type DotJotListProps = {
  className?: string
  readOnly?: boolean
  onChange?: (items: DotJotItem[]) => void
  onBlur?: () => void
  items?: DotJotItem[]
  size?: number
}

//TODO: Support drag-and-drop reordering

const DotJotList = React.forwardRef<HTMLInputElement, DotJotListProps>(
  (props, ref) => {
    const {
      className,
      items = [],
      readOnly = false,
      onChange,
      onBlur,
      size,
    } = props

    const [newItemText, setNewItemText] = useState("")

    const handleRemove = (index: number) => {
      onChange?.([...items.slice(0, index), ...items.slice(index + 1)])
    }

    const handleAddNewItem = () => {
      onChange?.([...items, { text: newItemText.trim(), readOnly: false }])
      setNewItemText("")
    }

    return (
      <div className={`dot-jot-list ${className ?? ""}`}>
        <ul>
          {items.map((item, i) => (
            <DotJotItem
              key={i}
              index={i}
              readOnly={item?.readOnly}
              text={item.text}
              onRemove={handleRemove}
            />
          ))}
          {!readOnly && (
            <li>
              <div className="new-item-row row">
                <input
                  className="new-item-text-input"
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  onBlur={onBlur}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      if (newItemText.trim()) {
                        handleAddNewItem()
                      }
                    }
                  }}
                  ref={ref}
                  size={size}
                />
                <Button
                  className="add-item-button small"
                  onClick={handleAddNewItem}
                  disabled={!newItemText.trim()}
                >
                  Add
                </Button>
              </div>
            </li>
          )}
        </ul>
        <style jsx>{`
          ul {
            margin-block-start: 0;
            margin-block-end: 0;
          }
          .new-item-text-input {
            width: ${size ? "initial" : "100%"};
          }
        `}</style>
      </div>
    )
  },
)

DotJotList.displayName = "DotJotList"

interface DotJotItemProps {
  text: string
  readOnly?: boolean
  index: number
  onRemove?: (index: number) => void
}

const DotJotItem = (props: DotJotItemProps) => {
  const { readOnly = false, text, index, onRemove } = props
  return (
    <li>
      <div className="item-container">
        {text === undefined ? (
          <input type="text" name="" id="" />
        ) : (
          <span>{text}</span>
        )}
        {!readOnly && (
          <IconButton
            icon={MdClose}
            className="remove-item-button"
            value="remove"
            onClick={() => onRemove?.(index)}
            size="extra-small"
          />
        )}
      </div>
      <style jsx>{`
        .item-container {
          display: flex;
          align-items: center;
        }
        .item-container > .remove-item-button {
          display: flex;
          justify-content: center;
          align-items: center;
          width: min-content;
          height: min-content;
          margin-left: 0.5rem;
          padding: 0;
        }
      `}</style>
    </li>
  )
}

export { DotJotList as default, DotJotItem }
