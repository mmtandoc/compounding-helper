import React, { FocusEventHandler, useEffect, useState } from "react"
import SuggestionItem from "./SuggestionItem"
import SuggestionsList from "./SuggestionsList"

export type AutocompleteProps<T> = {
  name: string
  id?: string
  item?: T
  query?: string
  getItemValue: (item: T | undefined | null) => string
  renderSuggestion: (item: T) => JSX.Element
  items: T[]
  onItemChange?: (val?: T | null) => void
  onQueryChange?: (query: string) => void
  width?: string | number
  minLength: number
  readOnly?: boolean
  onFocus?: FocusEventHandler<HTMLInputElement>
  onBlur?: FocusEventHandler<HTMLInputElement>
  inputRef?: React.LegacyRef<HTMLInputElement>
}

const AutocompleteInput = <T,>(props: AutocompleteProps<T>) => {
  const {
    getItemValue,
    item,
    items,
    inputRef,
    onBlur,
    onFocus,
    onItemChange,
    onQueryChange,
  } = props

  const didMount = React.useRef(false)

  const [inputQuery, setInputQuery] = useState(getItemValue(item))

  React.useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    onQueryChange?.(inputQuery)
  }, [inputQuery, onQueryChange])

  useEffect(() => {
    setInputQuery(getItemValue(item))
  }, [item, getItemValue])

  const [selectedIndex, setSelectedIndex] = useState<number | undefined>()

  const [suggestionsVisible, setSuggestionsVisible] = useState<boolean>(false)

  const handleSuggestionClick = (item: T) => {
    setInputQuery(getItemValue(item))
    setSuggestionsVisible(false)
    props.onItemChange?.(item)
  }

  const suggestions: T[] = items

  const suggestionItems = suggestions.map((e, i) => (
    <SuggestionItem
      key={i}
      index={i}
      item={e}
      getItemValue={getItemValue}
      onClick={handleSuggestionClick}
      renderSuggestion={props.renderSuggestion}
      isSelected={i === selectedIndex}
    />
  ))

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowUp":
        setSuggestionsVisible(true)
        let prevIndex: number | undefined
        switch (selectedIndex) {
          case undefined:
            prevIndex = suggestions.length - 1
            break
          case 0:
            prevIndex = undefined
            break
          default:
            prevIndex = selectedIndex - 1
            break
        }

        setSelectedIndex(prevIndex)
        break
      case "ArrowDown":
        setSuggestionsVisible(true)
        let nextIndex: number | undefined
        if ((selectedIndex ?? -1) < suggestions.length - 1) {
          nextIndex = (selectedIndex ?? -1) + 1
        } else {
          nextIndex = undefined
        }

        setSelectedIndex(nextIndex)
        break
      case "Enter":
        if (selectedIndex === undefined) {
          if (suggestions.length > 0) {
            onItemChange?.(suggestions[0])
          }
        } else {
          setInputQuery(getItemValue(suggestions[selectedIndex]))
          onItemChange?.(suggestions[selectedIndex])
          setSuggestionsVisible(false)
        }
        break
      default:
        return
    }
  }

  const handleInputQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIndex(undefined)
    setSuggestionsVisible(true)
    setInputQuery(e.target.value)
    if (!e.target.value.trim() && item) {
      onItemChange?.(null)
    }
  }

  const displaySuggestionsList =
    inputQuery &&
    inputQuery.length >= props.minLength &&
    suggestions.length !== 0 &&
    suggestionsVisible

  return (
    <div className="autocomplete" id={props.id}>
      <div>
        <input
          name={props.name}
          type="search"
          maxLength={500}
          value={inputQuery}
          onChange={handleInputQueryChange}
          onKeyDown={handleKeyDown}
          readOnly={props.readOnly}
          onFocus={onFocus}
          onBlur={(e) => {
            onBlur?.(e)
            setSuggestionsVisible(false)
          }}
          ref={inputRef}
          size={
            typeof props.width === "string" ? Number(props.width) : props.width
          }
        />
      </div>
      {displaySuggestionsList && (
        <SuggestionsList
          suggestions={suggestionItems}
          selectedIndex={selectedIndex}
        ></SuggestionsList>
      )}
      <style jsx>{`
        .autocomplete {
          position: relative;
          width: min-content;
        }
        input {
          display: flex;
          flex: 100%;
          width: auto;
        }

        input:read-only {
          outline: none;
          border-color: transparent;
          background-color: transparent;
        }
      `}</style>
    </div>
  )
}

AutocompleteInput.defaultProps = {
  readOnly: false,
  width: 50,
  minLength: 3,
}

export default AutocompleteInput
