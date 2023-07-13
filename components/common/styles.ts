/* styles.js */
import css from "styled-jsx/css"

export const printDetails = css.global`
  @media print {
    html {
      font-size: 52%;
    }

    h1 {
      margin: 0 0 2rem;
    }

    textarea {
      border: 1px solid black;
    }

    input[type="radio"] {
      height: 1.3rem !important;
      width: 1.3rem !important;
    }

    textarea,
    select,
    input {
      //font-size: 3rem;
    }

    body {
      background-color: white !important;
    }

    button {
      display: none !important;
    }

    .print-body {
      margin: 0;
      padding: 0;

      .details fieldset,
      .details .form-group {
        page-break-inside: avoid;
        display: block;
      }

      .details a {
        color: currentColor !important;
        text-decoration: none !important;
        text-decoration-line: none;
        outline: none !important;
      }

      .print-hide {
        display: none !important;
      }
    }
  }

  @page {
    size: auto;
    margin: 1.5cm;
    font-size: 12px;
    print-color-adjust: exact;
  }
`
