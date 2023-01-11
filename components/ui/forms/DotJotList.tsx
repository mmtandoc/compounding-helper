import { debounce } from "lodash"
import React, { useEffect, useMemo, useState } from "react"
import { MdClose } from "react-icons/md"

import { Button, IconButton } from "components/ui"
import { Input } from "components/ui/forms"

type DotJotItem = { text: string; readOnly?: boolean }

type DotJotListProps = {
  name?: string
  className?: string
  readOnly?: boolean
  editable?: boolean
  onChange?: (items: DotJotItem[]) => void
  onBlur?: () => void
  items?: DotJotItem[]
  size?: number
}

//TODO: Support drag-and-drop reordering

const DotJotList = React.forwardRef<HTMLInputElement, DotJotListProps>(
  (props, ref) => {
    const {
      name,
      className,
      items = [],
      readOnly = false,
      editable = false,
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

    const handleItemChange = (index: number, text: string) => {
      items[index] = { text, readOnly: false }
      onChange?.([...items])
    }

    return (
      <div className={`dot-jot-list ${className ?? ""}`}>
        <ul>
          {items.map((item, i) => (
            <DotJotItem
              name={name ? `${name}.${i}` : undefined}
              key={i}
              index={i}
              readOnly={item?.readOnly}
              editable={editable}
              text={item.text}
              onRemove={handleRemove}
              onChange={handleItemChange}
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
            margin-top: 0;
            margin-bottom: 0;
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
  name?: string
  text: string
  readOnly?: boolean
  editable?: boolean
  index: number
  onRemove?: (index: number) => void
  onChange?: (index: number, text: string) => void
  size?: number
}

const DotJotItem = (props: DotJotItemProps) => {
  const {
    name,
    readOnly = false,
    editable = false,
    text,
    index,
    onRemove,
    onChange,
    size,
  } = props

  const [itemText, setItemText] = useState(text)

  useEffect(() => {
    setItemText(text)
  }, [text])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemText(e.target.value)

    if (onChange) {
      handleChangeDebounced?.(index, e.target.value)
    }
  }

  const handleChangeDebounced = useMemo(
    () => (onChange ? debounce(onChange, 300) : undefined),
    [onChange],
  )

  return (
    <li>
      <div className="item-container">
        {!readOnly && editable ? (
          <Input
            name={name}
            className="item-text-input"
            type="text"
            value={itemText}
            onChange={handleChange}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
              onChange?.(index, e.target.value)
            }
            size={size}
            fullWidth={!size}
          />
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

          > :global(.input-container) {
            flex-grow: ${size ? "unset" : "1"};
            margin: 0.1rem 0;
          }
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

export default DotJotList
