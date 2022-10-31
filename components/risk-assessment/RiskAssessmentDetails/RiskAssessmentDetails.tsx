import React from "react"

import { BooleanRadioGroup } from "components/BooleanRadioGroup"
import { IngredientDetails } from "components/compound/ingredient/IngredientDetails"
import { RadioGroup } from "components/RadioGroup"
import { capitalize } from "lib/utils"
import form from "styles/form"
import { RiskAssessmentAll } from "types/models"

type Props = {
  data: RiskAssessmentAll
}

const RiskAssessmentDetails = ({ data }: Props) => {
  return (
    <div className="risk-assessment-details">
      <div className="form-group row">
        <label htmlFor="compound-name">Compound name:</label>
        <span>{data.compound.name}</span>
      </div>
      <fieldset>
        <legend>Ingredients:</legend>
        {data.compound.ingredients.map((ingredient, index) => (
          <IngredientDetails key={index} ingredient={ingredient} />
        ))}
      </fieldset>
      <fieldset>
        <legend>
          How complex is the compound? (As per{" "}
          <a
            href="https://www.uspnf.com/sites/default/files/usp_pdf/EN/USPNF/revisions/gc795.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            USP 795
          </a>
          )
        </legend>
        <RadioGroup
          readOnly={true}
          radioOptions={[
            ["simple", "Simple"],
            ["moderate", "Moderate"],
            ["complex", "Complex"],
          ]}
          selectedValue={data.complexity}
        />
      </fieldset>
      <fieldset>
        <legend>How often is this compound prepared?</legend>
        <RadioGroup
          readOnly={true}
          radioOptions={[
            ["daily", "Daily"],
            ["weekly", "Weekly"],
            ["monthly", "Monthly"],
          ]}
          selectedValue={data.preparationFrequency}
        />
      </fieldset>
      <fieldset>
        <legend>Is this compound only prepared occasionally?</legend>
        <BooleanRadioGroup
          readOnly={true}
          selectedValue={data.isPreparedOccasionally}
        />
      </fieldset>
      <fieldset>
        <legend>
          <label htmlFor="is-small-quantity">
            Are there only small quantities of ingredients being prepared?
          </label>
        </legend>
        <div className="form-group">
          <BooleanRadioGroup
            readOnly={true}
            selectedValue={data.isSmallQuantity}
          />
        </div>
      </fieldset>
      <fieldset>
        <legend>
          On average, what quantity of this preparation is being prepared at a
          time?
        </legend>
        <div className="form-group row">
          <span>
            {data.averagePreparationAmountQuantity}{" "}
            {data.averagePreparationAmountUnit}
          </span>
        </div>
      </fieldset>
      <fieldset>
        <legend>
          Do the concentration of ingredients in the product present a health
          risk to the compounder?
        </legend>
        <BooleanRadioGroup
          readOnly={true}
          selectedValue={data.isConcentrationHealthRisk}
        />
      </fieldset>
      <fieldset>
        <legend>
          Does preparation require special education or competencies for your
          compounding personnel?
        </legend>
        <BooleanRadioGroup
          readOnly={true}
          selectedValue={data.requireSpecialEducation}
        />
      </fieldset>
      <fieldset>
        <legend>Are there verification steps during compounding?</legend>
        <BooleanRadioGroup
          readOnly={true}
          selectedValue={data.hasVerificationSteps}
        />
      </fieldset>
      <fieldset>
        <legend>
          Do you have appropriate facilities and equipment to prepare this
          compound?
        </legend>
        <BooleanRadioGroup
          readOnly={true}
          selectedValue={data.haveAppropriateFacilities}
        />
      </fieldset>
      <fieldset>
        <legend>
          Is ventilation required for preparation (as per section 8 of SDS or
          product monograph)?
        </legend>
        <BooleanRadioGroup
          readOnly={true}
          selectedValue={data.requireVentilation}
        />
      </fieldset>
      <fieldset>
        <legend>Is your workflow uninterrupted?</legend>
        <BooleanRadioGroup
          readOnly={true}
          selectedValue={data.isWorkflowUninterrupted}
        />
        {data.isWorkflowUninterrupted === false && (
          <div
            className={`form-group ${
              data.isWorkflowUninterrupted !== false ? "hidden" : ""
            }`}
          >
            <label
              htmlFor="interrupted-workflow-process"
              className={data.isWorkflowUninterrupted ? "disabled" : ""}
            >
              If no, describe your processes to address the situation in order
              to meet standards:
            </label>
            <textarea
              value={data.workflowStandardsProcess ?? ""}
              readOnly={true}
              cols={20}
            />
          </div>
        )}
      </fieldset>
      <fieldset>
        <legend>Is there a risk of microbial contamination?</legend>
        <BooleanRadioGroup
          readOnly={true}
          selectedValue={data.microbialContaminationRisk}
        />
      </fieldset>
      <fieldset>
        <legend>
          Is there risk of cross contamination with other products?
        </legend>
        <BooleanRadioGroup
          readOnly={true}
          selectedValue={data.crossContaminationRisk}
        />
      </fieldset>
      <fieldset>
        <legend>
          Exposure risk to compounding personnel (as per section 2 of the SDS or
          product monograph)
        </legend>
        <div className="row grow">
          <ExposureRisksDisplay
            category="From SDS"
            values={{
              skin: data.sdsSkinExposureRisk as boolean,
              eye: data.sdsEyeExposureRisk as boolean,
              oral: data.sdsEyeExposureRisk as boolean,
              inhalation: data.sdsInhalationExposureRisk as boolean,
              other: data.sdsOtherExposureRiskDescription,
            }}
          />
          {data.compound.ingredients.some(
            (e) => e.commercialProductDin && e.commercialProductName,
          ) && (
            <ExposureRisksDisplay
              category="From Product Monograph"
              values={{
                skin: data.pmSkinExposureRisk as boolean,
                eye: data.pmEyeExposureRisk as boolean,
                oral: data.pmEyeExposureRisk as boolean,
                inhalation: data.pmInhalationExposureRisk as boolean,
                other: data.pmOtherExposureRiskDescription,
              }}
            />
          )}
        </div>
      </fieldset>
      <fieldset>
        <legend>
          PPE deemed necessary (as per SDS, product monograph) and assessment of
          risk:
        </legend>
        <div className="row grow wrap">
          <fieldset>
            <legend>Gloves:</legend>
            <div className="form-group">
              <label>Required?</label>
              <BooleanRadioGroup
                readOnly={true}
                name="ppe.gloves.required"
                selectedValue={data.ppeGlovesRequired}
              />
            </div>
            {data.ppeGlovesRequired && (
              <div className="form-group row wrap">
                <span className="label">Type:</span>
                <span>{capitalize(data.ppeGlovesType as string)} gloves</span>
              </div>
            )}
          </fieldset>
          <fieldset>
            <legend>Coat:</legend>
            <div className="form-group">
              <span className="label">Required?</span>
              <BooleanRadioGroup
                readOnly={true}
                name="ppe.coat.required"
                selectedValue={data.ppeCoatRequired}
              />
            </div>
            {data.ppeCoatRequired && (
              <div className="form-group row wrap">
                <span className="label">Type:</span>
                <span>{capitalize(data.ppeCoatType as string)} coat</span>
              </div>
            )}
          </fieldset>
          <fieldset>
            <legend>Mask:</legend>
            <div className="form-group">
              <span className="label">Required?</span>
              <BooleanRadioGroup
                readOnly={true}
                name="ppe.mask.required"
                selectedValue={data.ppeMaskRequired}
              />
            </div>
            {data.ppeMaskRequired && (
              <div className="form-group row wrap">
                <span className="label">Type:</span>
                <span>{capitalize(data.ppeMaskType as string)}</span>
              </div>
            )}
          </fieldset>
          <fieldset className="row">
            <legend>Eye Protection:</legend>
            <div className="form-group">
              <label>Required?</label>
              <BooleanRadioGroup
                readOnly={true}
                name="ppe.eyeProtection.required"
                selectedValue={data.ppeEyeProtectionRequired}
              />
            </div>
          </fieldset>
          <fieldset>
            <legend>Other:</legend>
            <span>{data.ppeOther ? data.ppeOther : "N/A"}</span>
          </fieldset>
        </div>
      </fieldset>
      <fieldset>
        <legend>Is an eye wash station required?</legend>
        <BooleanRadioGroup
          readOnly={true}
          name="requireEyeWashStation"
          selectedValue={data.requireEyeWashStation}
        />
      </fieldset>
      <fieldset>
        <legend>Is a safety shower required?</legend>
        <BooleanRadioGroup
          readOnly={true}
          name="requireSafetyShower"
          selectedValue={data.requireSafetyShower}
        />
      </fieldset>
      <fieldset>
        <div className="form-group row" style={{ fontSize: "2rem" }}>
          <span className="label">Risk level assigned:</span>
          <span>{data.riskLevel}</span>
        </div>
        <div className="form-group">
          <span className="label">
            Rationale and other risk mitigation measures:
          </span>
          <ul style={{ marginTop: 0 }}>
            {data.automaticRationale.map((value, index) => (
              <li key={index}>{value}</li>
            ))}
            {data.additionalRationale.map((value, index) => (
              <li key={index}>{value}</li>
            ))}
          </ul>
        </div>
      </fieldset>
      <fieldset>
        <div className="form-group row">
          <span className="label">Compounding supervisor:</span>
          <span>{data.compoundingSupervisor}</span>
        </div>
        <div className="form-group row">
          <span className="label">Date assessed:</span>
          <span>{data.dateAssessed.toLocaleDateString("en-CA")}</span>
        </div>
      </fieldset>
      <style jsx global>
        {form}
      </style>
      <style jsx global>{`
        .risk-assessment-details > .form-group {
          padding-left: 1.2rem;
        }

        textarea:read-only {
          outline: none;
          resize: none;
        }

        input[type="radio"] {
          accent-color: black;
        }

        .boolean-radio-group label,
        .radio-group label {
          display: flex;
          align-items: center;
        }

        :root {
          --radio-background-color: #f3f3f3;
          --radio-color: black;
          --radio-border-color: black;
          --radio-size: 1.2rem;
        }

        input[type="radio"] {
          appearance: none;

          border-radius: 50%;
          width: var(--radio-size);
          height: var(--radio-size);

          border: none;
          box-shadow: 0 0 0 1px black;
          transition: 0.2s all linear;
          margin-right: 0.5rem;
          background-color: var(--radio-background-color);
        }

        input[type="radio"]:checked {
          border: 0.35rem solid var(--radio-background-color);
          background-color: var(--radio-color);
          box-shadow: 0 0 0 1px black;
        }
      `}</style>
    </div>
  )
}

type ExposureRisksInputsProps = {
  category: string
  values: {
    skin: boolean
    eye: boolean
    inhalation: boolean
    oral: boolean
    other: string | null
  }
  disabled?: boolean
}

const ExposureRisksDisplay = ({
  category,
  values,
}: ExposureRisksInputsProps) => {
  return (
    <fieldset className="exposure-risks-container">
      <legend>{category}:</legend>
      <div className="exposure-risks-row">
        <div className="form-group">
          <label>Skin:</label>
          <BooleanRadioGroup selectedValue={values.skin} readOnly={true} />
        </div>
        <div className="form-group">
          <label>Eye:</label>
          <BooleanRadioGroup selectedValue={values.eye} readOnly={true} />
        </div>
        <div className="form-group">
          <label>Inhalation:</label>
          <BooleanRadioGroup
            selectedValue={values.inhalation}
            readOnly={true}
          />
        </div>
        <div className="form-group">
          <label>Oral:</label>
          <BooleanRadioGroup selectedValue={values.oral} readOnly={true} />
        </div>
      </div>
      <div className="row">
        <div className="form-group">
          <label>Other:</label>
          <BooleanRadioGroup
            selectedValue={values.other !== null}
            readOnly={true}
          />
        </div>
        <div className="form-group" style={{ flexGrow: 1 }}>
          <label className={values.other === null ? "disabled" : ""}>
            Description:
          </label>
          <input
            type="text"
            value={values.other ?? ""}
            disabled={values.other === null}
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <style jsx>{`
        .exposure-risks-row {
          display: flex;
          column-gap: 2rem;
          margin-bottom: 1rem;
        }

        .exposure-risks-row > div {
          flex: 1;
        }

        .exposure-risks-row > div:not(:last-child) {
          border-right: 1px solid black;
        }
      `}</style>
    </fieldset>
  )
}

export default RiskAssessmentDetails
