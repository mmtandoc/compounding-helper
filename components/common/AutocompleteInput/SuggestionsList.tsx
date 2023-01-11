import React from "react"

const SuggestionsList = (props: {
  selectedIndex?: number
  suggestions?: JSX.Element[]
}) => {
  return (
    <ul className="suggestions-list">
      {props.suggestions}
      <style jsx>{`
        .suggestions-list {
          position: absolute;
          background-color: var(--color-suggestion-bg);
          width: 100%;
          z-index: 1;
          margin: -1px 0 0 0;
          list-style-type: none;
          padding-left: 0;
          border: var(--suggestion-border);
        }

        .suggestions-list > :global(li) {
          padding-left: 1rem;
          cursor: default;
        }

        .suggestions-list > :global(li.selected) {
          color: var(--color-suggestion-focus-fg);
          background-color: var(--color-suggestion-focus-bg);
        }

        .suggestions-list > :global(li:hover) {
          background-color: var(--color-suggestion-hover-bg);
        }
      `}</style>
    </ul>
  )
}

export default SuggestionsList
