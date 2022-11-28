import React from "react"

import { BooleanRadioGroup } from "components/BooleanRadioGroup"
import Fieldset from "components/common/forms/Fieldset"
import { FormGroup } from "components/common/forms/FormGroup"
import { IngredientDetails } from "components/compound/ingredient/IngredientDetails"
import { RadioGroup } from "components/RadioGroup"
import { capitalize } from "lib/utils"
import { RiskAssessmentAll } from "types/models"

type Props = {
  data: RiskAssessmentAll
}

const RiskAssessmentDetails = ({ data }: Props) => {
  return (
    <div className="risk-assessment-details">
      <FormGroup row>
        <label htmlFor="compound-name">Compound name:</label>
        <span>{data.compound.name}</span>
      </FormGroup>
      <Fieldset legend="Ingredients:">
        {data.compound.ingredients.map((ingredient, index) => (
          <IngredientDetails key={index} ingredient={ingredient} />
        ))}
      </Fieldset>
      <Fieldset
        legend={
          <>
            How complex is the compound? (As per{" "}
            <a
              href="https://www.uspnf.com/sites/default/files/usp_pdf/EN/USPNF/revisions/gc795.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              USP 795
            </a>
            )
          </>
        }
      >
        <RadioGroup
          readOnly={true}
          radioOptions={[
            ["simple", "Simple"],
            ["moderate", "Moderate"],
            ["complex", "Complex"],
          ]}
          selectedValue={data.complexity}
        />
      </Fieldset>
      <Fieldset legend="How often is this compound prepared?">
        <RadioGroup
          readOnly={true}
          radioOptions={[
            ["daily", "Daily"],
            ["weekly", "Weekly"],
            ["monthly", "Monthly"],
            ["lessThanMonthly", "Less than monthly"],
          ]}
          selectedValue={data.preparationFrequency}
        />
      </Fieldset>
      <Fieldset legend="Is this compound only prepared occasionally?">
        <BooleanRadioGroup
          readOnly={true}
          selectedValue={data.isPreparedOccasionally}
        />
      </Fieldset>
      <Fieldset legend="Are there only small quantities of ingredients being prepared?">
        <FormGroup>
          <BooleanRadioGroup
            readOnly={true}
            selectedValue={data.isSmallQuantity}
          />
        </FormGroup>
      </Fieldset>
      <Fieldset legend="On average, what quantity of this preparation is being prepared at a time?">
        <FormGroup row>
          <span>
            {data.averagePreparationAmountQuantity}{" "}
            {data.averagePreparationAmountUnit}
          </span>
        </FormGroup>
      </Fieldset>
      <Fieldset legend="Do the concentration of ingredients in the product present a health risk to the compounder?">
        <BooleanRadioGroup
          readOnly={true}
          selectedValue={data.isConcentrationHealthRisk}
        />
      </Fieldset>
      <Fieldset legend="Does preparation require special education or competencies for your compounding personnel?">
        <BooleanRadioGroup
          readOnly={true}
          selectedValue={data.requireSpecialEducation}
        />
      </Fieldset>
      <Fieldset legend="Are there verification steps during compounding?">
        <BooleanRadioGroup
          readOnly={true}
          selectedValue={data.hasVerificationSteps}
        />
      </Fieldset>
      <Fieldset legend="Do you have appropriate facilities and equipment to prepare this compound?">
        <BooleanRadioGroup
          readOnly={true}
          selectedValue={data.haveAppropriateFacilities}
        />
      </Fieldset>
      <Fieldset legend="Is ventilation required for preparation (as per section 8 of SDS or product monograph)?">
        <BooleanRadioGroup
          readOnly={true}
          selectedValue={data.requireVentilation}
        />
      </Fieldset>
      <Fieldset legend="Is your workflow uninterrupted?">
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
      </Fieldset>
      <Fieldset legend="Is there a risk of microbial contamination?">
        <BooleanRadioGroup
          readOnly={true}
          selectedValue={data.microbialContaminationRisk}
        />
      </Fieldset>
      <Fieldset legend="Is there risk of cross contamination with other products?">
        <BooleanRadioGroup
          readOnly={true}
          selectedValue={data.crossContaminationRisk}
        />
      </Fieldset>
      <Fieldset legend="Exposure risk to compounding personnel (as per section 2 of the SDS or product monograph)">
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
      </Fieldset>
      <Fieldset legend="PPE deemed necessary (as per SDS, product monograph) and assessment of risk:">
        <div className="row grow wrap">
          <Fieldset legend="Gloves:">
            <FormGroup>
              <label>Required?</label>
              <BooleanRadioGroup
                readOnly={true}
                name="ppe.gloves.required"
                selectedValue={data.ppeGlovesRequired}
              />
            </FormGroup>
            {data.ppeGlovesRequired && (
              <div className="form-group row wrap">
                <span className="label">Type:</span>
                <span>{capitalize(data.ppeGlovesType as string)} gloves</span>
              </div>
            )}
          </Fieldset>
          <Fieldset legend="Coat:">
            <FormGroup>
              <span className="label">Required?</span>
              <BooleanRadioGroup
                readOnly={true}
                name="ppe.coat.required"
                selectedValue={data.ppeCoatRequired}
              />
            </FormGroup>
            {data.ppeCoatRequired && (
              <div className="form-group row wrap">
                <span className="label">Type:</span>
                <span>{capitalize(data.ppeCoatType as string)} coat</span>
              </div>
            )}
          </Fieldset>
          <Fieldset legend="Mask:">
            <FormGroup>
              <span className="label">Required?</span>
              <BooleanRadioGroup
                readOnly={true}
                name="ppe.mask.required"
                selectedValue={data.ppeMaskRequired}
              />
            </FormGroup>
            {data.ppeMaskRequired && (
              <div className="form-group row wrap">
                <span className="label">Type:</span>
                <span>{capitalize(data.ppeMaskType as string)}</span>
              </div>
            )}
          </Fieldset>
          <Fieldset className="row" legend="Eye Protection:">
            <FormGroup>
              <label>Required?</label>
              <BooleanRadioGroup
                readOnly={true}
                name="ppe.eyeProtection.required"
                selectedValue={data.ppeEyeProtectionRequired}
              />
            </FormGroup>
          </Fieldset>
          <Fieldset legend="Other:">
            <span>{data.ppeOther ? data.ppeOther : "N/A"}</span>
          </Fieldset>
        </div>
      </Fieldset>
      <Fieldset legend="Is an eye wash station required?">
        <BooleanRadioGroup
          readOnly={true}
          name="requireEyeWashStation"
          selectedValue={data.requireEyeWashStation}
        />
      </Fieldset>
      <Fieldset legend="Is a safety shower required?">
        <BooleanRadioGroup
          readOnly={true}
          name="requireSafetyShower"
          selectedValue={data.requireSafetyShower}
        />
      </Fieldset>
      <Fieldset>
        <div className="form-group row" style={{ fontSize: "2rem" }}>
          <span className="label">Risk level assigned:</span>
          <span>{data.riskLevel}</span>
        </div>
        <FormGroup>
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
        </FormGroup>
      </Fieldset>
      <Fieldset>
        <FormGroup row>
          <span className="label">Compounding supervisor:</span>
          <span>{data.compoundingSupervisor}</span>
        </FormGroup>
        <FormGroup row>
          <span className="label">Date assessed:</span>
          <span>{data.dateAssessed.toLocaleDateString("en-CA")}</span>
        </FormGroup>
      </Fieldset>
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
    <Fieldset legend={`${category}:`} className="exposure-risks-container">
      <div className="exposure-risks-row">
        <FormGroup>
          <label>Skin:</label>
          <BooleanRadioGroup selectedValue={values.skin} readOnly={true} />
        </FormGroup>
        <FormGroup>
          <label>Eye:</label>
          <BooleanRadioGroup selectedValue={values.eye} readOnly={true} />
        </FormGroup>
        <FormGroup>
          <label>Inhalation:</label>
          <BooleanRadioGroup
            selectedValue={values.inhalation}
            readOnly={true}
          />
        </FormGroup>
        <FormGroup>
          <label>Oral:</label>
          <BooleanRadioGroup selectedValue={values.oral} readOnly={true} />
        </FormGroup>
      </div>
      <div className="row">
        <FormGroup>
          <label>Other:</label>
          <BooleanRadioGroup
            selectedValue={values.other !== null}
            readOnly={true}
          />
        </FormGroup>
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
    </Fieldset>
  )
}

export default RiskAssessmentDetails
