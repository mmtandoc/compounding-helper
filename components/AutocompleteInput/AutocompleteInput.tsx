import React, { useEffect, useState } from "react"
import SuggestionItem from "./SuggestionItem"
import SuggestionsList from "./SuggestionsList"

export type AutocompleteProps<T> = {
  name: string
  id?: string
  item?: T | null
  query?: string
  getItemValue: (item: T | undefined | null) => string
  renderSuggestion: (item: T) => JSX.Element
  items: T[]
  onItemChange?: (val: T) => void
  onQueryChange?: (query: string) => void
  width?: string | number
  minLength: number
  readOnly?: boolean
}

const AutocompleteInput = <T,>(props: AutocompleteProps<T>) => {
  const { getItemValue, item, items } = props

  const [inputQuery, setInputQuery] = useState(getItemValue(item))

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
            props.onItemChange?.(suggestions[0])
          }
        } else {
          setInputQuery(getItemValue(suggestions[selectedIndex]))
          props.onItemChange?.(suggestions[selectedIndex])
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
    props.onQueryChange?.(e.target.value)
  }

  const displaySuggestionsList =
    inputQuery &&
    inputQuery.length >= props.minLength &&
    suggestions.length !== 0 &&
    suggestionsVisible

  return (
    <div className="autocomplete" id={props.id}>
      <div style={{ display: "flex", flex: "100%" }}>
        <input
          name={props.name}
          type="search"
          maxLength={500}
          value={inputQuery}
          onChange={handleInputQueryChange}
          onKeyDown={handleKeyDown}
          readOnly={props.readOnly}
          onFocus={() => console.log("onFocus")}
          onBlur={() => setSuggestionsVisible(false)}
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