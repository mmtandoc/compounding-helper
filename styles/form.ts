import css from "styled-jsx/css"

const form = css.global`
  legend {
    font-weight: 600;
  }

  form > .form-group {
    padding-inline: 0.75em;
  }

  .form-group {
    padding-block: 0.1rem 0.1rem;
    min-inline-size: min-content;
  }

  .form-group:not(.row) > * {
    display: block;
  }

  .form-group input:not([type="radio", type="checkbox"]),
  .form-group select {
    width: fit-content;
  }

  .form-group textarea {
    resize: vertical;
    width: 100%;
  }

  .form-group > label {
    font-weight: 600;
    display: block;
    width: fit-content;
    margin-bottom: 0.3rem;
  }

  .form-group.row > label {
    margin-bottom: 0;
  }

  .form-group label > span:first-child {
    font-weight: 600;
    display: block;
    width: fit-content;
    margin-bottom: 0.3rem;
  }

  .label {
    font-weight: 600;
  }

  label > input:where([type="checkbox"], [type="radio"]) + span {
    font-weight: normal;
  }

  label.disabled {
    color: dimgray;
  }
`

export default form