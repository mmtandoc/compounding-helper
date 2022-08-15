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
          background-color: white;
          width: 100%;
          z-index: 1;
          margin: -1px 0 0 0;
          list-style-type: none;
          padding-left: 0;
          border: black solid 1px;
        }

        .suggestions-list > :global(li) {
          padding-left: 1rem;
          cursor: default;
        }

        .suggestions-list > :global(li.selected) {
          background-color: lightblue;
        }

        .suggestions-list > :global(li:hover) {
          background-color: lightgray;
        }
      `}</style>
    </ul>
  )
}

export default SuggestionsList
