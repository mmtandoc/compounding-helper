import { RiskAssessment } from "@prisma/client"
import { capitalize } from "lodash"
import Link from "next/link"
import { useMemo } from "react"

import Fieldset from "components/common/forms/Fieldset"
import { FormGroup } from "components/common/forms/FormGroup"
import Table from "components/common/Table"
import { Quantity } from "lib/fields"
import { toIsoDateString } from "lib/utils"
import { MfrAll } from "types/models"

import { FormulaDetailsTable } from "./FormulaDetailsTable"

interface MfrEntryProps {
  data: MfrAll
}

const MfrDetails = (props: MfrEntryProps) => {
  const { data } = props

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
        <textarea value={data.calculations ?? "None"} readOnly={true} />
      </FormGroup>
      <FormGroup>
        <label>Compounding method:</label>
        <textarea value={data.compoundingMethod ?? "None"} readOnly={true} />
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
        <textarea value={data.packaging ?? "None"} readOnly={true} />
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
      <style jsx>{`
        .mfr-details {
          position: relative;

          > :global(.form-group) {
            padding-inline: 0.75em;
          }

          > :global(*) {
            margin-bottom: 0.5rem;
          }
        }

        :global(.info) {
          position: absolute;
          right: 0;
          top: 0;
        }

        :global(.ref-number) {
          font-size: var(--font-size-xl);
        }

        .risk-assessment-link {
          font-size: var(--font-size-sm);
        }

        ul {
          margin-block: 0;
        }

        textarea {
          resize: none;
        }

        :global(.expected-yield) {
          justify-content: end;
          padding-right: 1rem;
        }

        :global(.ingredients-table) {
          width: 100%;
          margin-bottom: 1rem;
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

export default MfrDetails
