import css from "styled-jsx/css"

const form = css.global`
  legend {
    font-weight: 600;
  }

  form > .form-group {
    padding-inline: 0.75em;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    margin-inline: 2px;
    /*padding-block: 0.35em 0.625em;*/
    padding-block: 0.1rem 0.1rem;
    //margin-right: 1.5rem;
    min-inline-size: min-content;
  }

  .form-group input,
  .form-group select {
    width: fit-content;
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

  .label {
    font-weight: 600;
    //display: inline-block;
    //margin-right: 0.5rem;
  }

  label > input[type="checkbox"] + span,
  label > input[type="radio"] + span {
    font-weight: normal;
  }

  label.disabled {
    color: dimgray;
  }

  .row {
    display: flex;
    flex-direction: row !important;
    gap: 0.7rem;
  }

  .row.grow > * {
    flex: 1;
    //flex-grow: 1;
  }

  .col {
    display: flex;
    flex-direction: column !important;
  }
`

export default form
