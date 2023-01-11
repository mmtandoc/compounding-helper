import { RiskAssessment } from "@prisma/client"
import { capitalize } from "lodash"
import Link from "next/link"
import { useMemo, useState } from "react"

import { Button, Table } from "components/ui"
import { Fieldset, FormGroup, TextArea } from "components/ui/forms"
import { Quantity } from "lib/fields"
import { toIsoDateString } from "lib/utils"
import { MfrAll } from "types/models"

import { FormulaDetailsTable } from "./FormulaDetailsTable"

interface MfrEntryProps {
  data: MfrAll
}

const MfrDetails = (props: MfrEntryProps) => {
  const { data } = props

  const [showPlainText, setShowPlainText] = useState(false)

  const requiredPpe = useMemo(
    () => (data.riskAssessment ? getRequiredPpeList(data.riskAssessment) : []),
    [data],
  )

  return (
    <div className="mfr-details">
      <Fieldset className="info">
        <FormGroup row className="ref-number">
          <label>Ref #:</label>
          <span>{`MFR-${String(data.compoundId).padStart(3, "0")}-${String(
            data.version,
          ).padStart(2, "0")}`}</span>
        </FormGroup>
      </Fieldset>
      <FormGroup row>
        <label>Compound:</label>
        <span>{data.compound.name}</span>
      </FormGroup>
      <FormGroup row>
        <label>Pharmaceutical form:</label>
        <span>{data.pharmaceuticalForm}</span>
      </FormGroup>
      <FormGroup row>
        <label>Route of administration:</label>
        <span>{data.routeOfAdministration}</span>
      </FormGroup>
      <FormGroup row style={{ justifyContent: "space-between" }}></FormGroup>
      <FormGroup row></FormGroup>
      <Fieldset legend="Formula:">
        <FormulaDetailsTable
          compound={data.compound}
          quantities={data.quantities as Quantity[]}
        />
        <FormGroup row className="expected-yield">
          <label>Expected yield:</label>
          <span>{`${data.expectedYieldAmount.toFixed(2)} ${
            data.expectedYieldUnit
          }`}</span>
        </FormGroup>
      </Fieldset>
      <FormGroup>
        <label>Referenced risk assessment:</label>
        <div className="row">
          <span>
            ID #{data.riskAssessment.id} -{" "}
            {toIsoDateString(data.riskAssessment.dateAssessed)}
          </span>
          <Link
            className="risk-assessment-link"
            href={`/risk-assessments/${data.riskAssessment.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View
          </Link>
        </div>
      </FormGroup>
      <FormGroup row style={{ alignItems: "center" }}>
        <span className="label">Risk level:</span>
        <span>{data.riskAssessment.riskLevel ?? "N/A"}</span>
      </FormGroup>
      <Fieldset legend="Required PPE:">
        <ul className="required-ppe-list">
          {requiredPpe.map((ppe, i) => (
            <li key={i}>{ppe}</li>
          ))}
        </ul>
      </Fieldset>
      <Fieldset legend="Training:">
        <ul>
          {data.training.length > 0 ? (
            data.training.map((val, i) => <li key={i}>{val}</li>)
          ) : (
            <li>No specialized training required.</li>
          )}
        </ul>
      </Fieldset>
      <Fieldset legend="Required equipment:">
        <ul>
          {data.requiredEquipment.map((val, i) => (
            <li key={i}>{val}</li>
          ))}
        </ul>
      </Fieldset>
      <FormGroup>
        <label>Calculations:</label>
        <TextArea value={data.calculations ?? "None"} readOnly autoResize />
      </FormGroup>
      <FormGroup>
        <label>Compounding method:</label>
        <TextArea
          value={data.compoundingMethod ?? "None"}
          readOnly
          autoResize
        />
      </FormGroup>
      <Fieldset legend="Stability and storage:">
        <FormGroup row>
          <label>Beyond use date:</label>
          <span>{`${data.beyondUseDateValue} ${data.beyondUseDateUnit}`}</span>
        </FormGroup>
        <FormGroup row>
          <label>Storage:</label>
          <span>{data.storage}</span>
        </FormGroup>
      </Fieldset>
      <FormGroup>
        <label>Quality controls:</label>
        <Table
          data={
            data.qualityControls as {
              name: string
              expectedSpecification: string
            }[]
          }
          columns={[
            {
              label: "Quality controls",
              accessorPath: "name",
              cellStyle: { width: "min-content" },
            },
            {
              label: "Expected specifications",
              accessorPath: "expectedSpecification",
            },
          ]}
        />
      </FormGroup>
      <FormGroup>
        <label>Packaging:</label>
        <TextArea value={data.packaging ?? "None"} readOnly autoResize />
      </FormGroup>
      <Fieldset legend="Labelling:" className="preset-options-fieldset">
        <ul>
          {data.labelling.map((val, i) => (
            <li key={i}>{val}</li>
          ))}
        </ul>
      </Fieldset>
      <Fieldset legend="References:">
        <ul>
          {data.references.map((val, i) => (
            <li key={i}>{val}</li>
          ))}
        </ul>
      </Fieldset>
      <Fieldset>
        <FormGroup row>
          <label>Effective date:</label>
          <span>{toIsoDateString(data.effectiveDate)}</span>
        </FormGroup>
        <FormGroup row>
          <label>Developed by:</label>
          <span>{data.developedBy}</span>
        </FormGroup>
        <FormGroup row>
          <label>Verified by:</label>
          <span>{data.verifiedBy ?? "N/A"}</span>
        </FormGroup>
      </Fieldset>
      <Fieldset className="plain-text print-hide">
        <div className="row">
          <Button size="small" onClick={() => setShowPlainText(!showPlainText)}>
            {showPlainText ? "Hide" : "Show"} plain text
          </Button>
          <Button
            size="small"
            onClick={() =>
              navigator.clipboard.writeText(convertToPlainText(data))
            }
          >
            Copy plain text to clipboard
          </Button>
        </div>
        <TextArea
          hidden={!showPlainText}
          readOnly
          autoResize
          value={convertToPlainText(data)}
        />
      </Fieldset>
      <style jsx>{`
        ul {
          margin-block: 0;
        }
      `}</style>
      <style jsx global>{`
        .mfr-details {
          position: relative;

          > .form-group {
            padding-inline: 0.75em;
          }

          > * {
            margin-bottom: 0.5rem;
          }
        }

        .info {
          position: absolute;
          right: 0;
          top: 0;
        }

        .ref-number {
          font-size: var(--font-size-xl);
        }

        .risk-assessment-link {
          font-size: var(--font-size-sm);
        }

        .expected-yield {
          justify-content: end;
          padding-right: 1rem;
        }

        .ingredients-table {
          width: 100%;
          margin-bottom: 1rem;
        }

        .plain-text {
          > textarea {
            margin-top: 1rem;
            width: 100%;
            font-family: monospace;
          }
        }
      `}</style>
    </div>
  )
}

const getRequiredPpeList = (riskAssessment: RiskAssessment) => {
  const requiredPpe = []
  if (riskAssessment?.ppeGlovesRequired) {
    requiredPpe.push(capitalize(`${riskAssessment.ppeGlovesType} gloves`))
  }
  if (riskAssessment?.ppeCoatRequired) {
    requiredPpe.push(capitalize(`${riskAssessment.ppeCoatType} coat`))
  }
  if (riskAssessment?.ppeMaskRequired) {
    requiredPpe.push(capitalize(`${riskAssessment.ppeMaskType} mask`))
  }
  if (riskAssessment?.ppeEyeProtectionRequired) {
    requiredPpe.push(capitalize(`Eye protection`))
  }
  if (riskAssessment?.ppeOther) {
    requiredPpe.push(capitalize(riskAssessment.ppeOther))
  }
  return requiredPpe
}

const convertToPlainText = (data: MfrAll): string => {
  const refNumber = `MFR-${String(data.compoundId).padStart(3, "0")}-${String(
    data.version,
  ).padStart(2, "0")}`

  const riskAssessmentTitle = `ID #${
    data.riskAssessment.id
  } - ${toIsoDateString(data.riskAssessment.dateAssessed)}`

  const arrayToTextList = (array: string[]) =>
    array.map((val) => ` - ${val}`).join("\n")

  const text = `COMPOUND NAME: ${data.compound.name}
REF #: ${refNumber}

REFERENCED RISK ASSESSMENT: ${riskAssessmentTitle}
RISK LEVEL: ${data.riskAssessment.riskLevel}

REQUIRED PPE:
${arrayToTextList(getRequiredPpeList(data.riskAssessment))}

TRAINING:
${arrayToTextList(data.training)}

REQUIRED EQUIPMENT:
${arrayToTextList(data.requiredEquipment)}

${
  data.calculations
    ? `CALCULATIONS:
${data.calculations}\n`
    : ""
}
COMPOUNDING METHOD:
${data.compoundingMethod}

BUD: ${data.beyondUseDateValue} ${data.beyondUseDateUnit} / STORAGE: ${
    data.storage
  }

QUALITY CONTROLS:
${arrayToTextList(
  (
    data.qualityControls as {
      name: string
      expectedSpecification: string
    }[]
  ).map((qc) => `${qc.name}: ${qc.expectedSpecification}`),
)}

PACKAGING:
${data.packaging}

LABELLING:
${arrayToTextList(data.labelling)}

REFERENCES:
${arrayToTextList(data.references)}

EFFECTIVE DATE: ${toIsoDateString(data.effectiveDate)} / DEVELOPED BY: ${
    data.developedBy
  }${data.verifiedBy ? `/ VERIFIED BY: ${data.verifiedBy}` : ""}`

  return text.toUpperCase()
}

export default MfrDetails
