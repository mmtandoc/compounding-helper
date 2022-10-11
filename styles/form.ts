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
    display: block;
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

  .form-group > :where(label, .label),
  label.form-group,
  .label.form-group {
    font-weight: 600;
    display: block;
    width: fit-content;
  }

  :where(.form-group
      > :where(label, .label), :where(label, .label).form-group):not(:only-child) {
    margin-bottom: 0.3rem;
  }

  :where(label, .label).form-group {
    font-weight: 600;
  }

  :where(.form-group > :where(label, .label), :where(label, .label).form-group)
    > :where(span:only-child, :not(span:first-child)) {
    font-weight: initial;
  }

  :where(.form-group > :where(label, .label), :where(label, .label).form-group)
    > :where(span:only-child, :not(span:first-child))
    * {
    font-weight: initial;
  }

  .form-group.row > :where(label, .label) {
    margin-bottom: 0;
  }

  :where(.form-group:not(.row)
      > :where(label, .label), :where(label, .label).form-group:not(.row))
    > :where(span, p):first-child {
    width: fit-content;
    margin-bottom: 0.3rem;
    display: block;
  }

  .label {
    font-weight: 600;
  }

  label.disabled {
    color: dimgray;
  }
`

export default form
