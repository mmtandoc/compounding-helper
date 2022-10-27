import { RHFBooleanRadioGroup } from "components/BooleanRadioGroup"
import { RHFRadioGroup } from "components/RadioGroup"
import { useEffect } from "react"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import form from "styles/form"
import ExposureRisksInputs from "./ExposureRisksInputs"
import useUpdateFieldConditionally from "lib/hooks/useUpdateFieldConditionally"
import IngredientEntry from "components/compound/ingredient/IngredientEntry"
import RationaleList from "./RationaleList"
import Input from "components/common/forms/Input"
import Select from "components/common/forms/Select"
import TextArea from "components/common/forms/TextArea"
import {
  NullPartialIngredientFields,
  NullPartialRiskAssessmentFields,
} from "lib/fields"
import { nestedForm } from "lib/rhf/nestedForm"

type Props = {
  formMethods: UseFormReturn<NullPartialRiskAssessmentFields>
  showPastSdsRevisions?: boolean
}

const emptyIngredientValues: NullPartialIngredientFields = {
  order: NaN,
  chemicalId: null,
  physicalForm: null,
  sdsId: null,
  isCommercialProduct: null,
  commercialProduct: {
    name: null,
    din: null,
    hasNoDin: null,
    hasProductMonographConcerns: null,
    concernsDescription: null,
  },
}

const RiskAssessmentEntry = (props: Props) => {
  const { formMethods, showPastSdsRevisions = false } = props

  const { register, control, watch, setValue, getValues } = formMethods

  const [isWorkflowUninterrupted, glovesRequired, coatRequired, maskRequired] =
    watch([
      "isWorkflowUninterrupted",
      "ppe.gloves.required",
      "ppe.coat.required",
      "ppe.mask.required",
    ])

  const ingredientsArrayMethods = useFieldArray({
    control: control,
    name: "compound.ingredients",
  })

  const ingredientFields = ingredientsArrayMethods.fields

  const ingredients = watch("compound.ingredients")

  const usesCommercialProduct = ingredients?.some(
    (i) => i?.isCommercialProduct === true,
  )

  useEffect(() => {
    if (
      ingredients &&
      ingredients.length === 0 &&
      ingredientFields.length === 0
    ) {
      ingredientsArrayMethods.append(emptyIngredientValues)
    }
  }, [ingredients, ingredientFields, ingredientsArrayMethods])

  useUpdateFieldConditionally({
    updateCondition: coatRequired === false || coatRequired === null,
    fields: [["ppe.coat.type", null]],
    register,
    setValue,
  })

  useUpdateFieldConditionally({
    updateCondition: glovesRequired === false || glovesRequired === null,
    fields: [["ppe.gloves.type", null]],
    register,
    setValue,
  })

  useUpdateFieldConditionally({
    updateCondition: maskRequired === false || maskRequired === null,
    fields: [["ppe.mask.type", null]],
    register,
    setValue,
  })

  register("id")
  return (
    <>
      <div className="form-group">
        <label htmlFor="compound-name">Compound name:</label>
        <Input
          id="compound-name"
          type="text"
          {...register("compound.name")}
          autoComplete="off"
          size={40}
        />
      </div>
      <fieldset>
        <legend>Ingredients:</legend>
        {ingredientFields.map((field, index) => (
          <IngredientEntry
            key={field.id}
            field={field}
            name={`compound.ingredients`}
            index={index}
            formMethods={nestedForm(
              formMethods,
              `compound.ingredients.${index}` as "compound.ingredients.1",
            )}
            arrayMethods={ingredientsArrayMethods}
            reset={() => {
              formMethods.resetField(`compound.ingredients.${index}`, {
                defaultValue: emptyIngredientValues,
              })
            }}
            showPastSdsRevisions={showPastSdsRevisions}
          />
        ))}
        <div>
          <button
            type="button"
            className="add-button"
            value="add"
            onClick={() =>
              ingredientsArrayMethods.append(emptyIngredientValues)
            }
          >
            Add Ingredient
          </button>
        </div>
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
        <RHFRadioGroup
          name="complexity"
          radioOptions={[
            ["simple", "Simple"],
            ["moderate", "Moderate"],
            ["complex", "Complex"],
          ]}
        />
      </fieldset>
      <fieldset>
        <legend>Is this compound only prepared occasionally?</legend>
        <RHFBooleanRadioGroup name="isPreparedOccasionally" />
      </fieldset>
      <fieldset>
        <legend>How often is this compound prepared?</legend>
        <RHFRadioGroup
          name="preparationFrequency"
          radioOptions={[
            ["daily", "Daily"],
            ["weekly", "Weekly"],
            ["monthly", "Monthly"],
          ]}
        />
      </fieldset>
      <fieldset>
        <legend>
          <label htmlFor="is-small-quantity">
            Are there only small quantities of ingredients being prepared?
          </label>
        </legend>
        <div className="form-group">
          <RHFBooleanRadioGroup id="is-small-quantity" name="isSmallQuantity" />
        </div>
      </fieldset>
      <fieldset>
        <legend>
          On average, what quantity of this preparation is being prepared at a
          time?
        </legend>
        <div className="form-group row">
          <Input
            id="average-preparation-amount-value"
            {...register("averagePreparationAmount.quantity", {
              //valueAsNumber: true,
              setValueAs: (val) => {
                if (typeof val === "number") {
                  return val
                }
                return (val?.trim?.() ?? "") === "" ? null : Number(val)
              },
            })}
            type="text"
            size={3}
          />
          <Select
            id="average-preparation-amount-unit"
            name="averagePreparationAmount.unit"
            initialOption
          >
            <option value="g">g</option>
            <option value="ml">ml</option>
          </Select>
        </div>
      </fieldset>
      <fieldset>
        <legend>
          Do the concentration of ingredients in the product present a health
          risk to the compounder?
        </legend>
        <RHFBooleanRadioGroup
          id="is-concentration-health-risk"
          name="isConcentrationHealthRisk"
        />
      </fieldset>
      <fieldset>
        <legend>
          Does preparation require special education or competencies for your
          compounding personnel?
        </legend>
        <RHFBooleanRadioGroup
          id="require-special-education"
          name="requireSpecialEducation"
        />
      </fieldset>
      <fieldset>
        <legend>Are there verification steps during compounding?</legend>
        <RHFBooleanRadioGroup
          id="has-verification-steps"
          name="hasVerificationSteps"
        />
      </fieldset>
      <fieldset>
        <legend>
          Do you have appropriate facilities and equipment to prepare this
          compound?
        </legend>
        <RHFBooleanRadioGroup
          id="have-appropriate-facilities"
          name="haveAppropriateFacilities"
        />
      </fieldset>
      <fieldset>
        <legend>
          Is ventilation required for preparation (as per section 8 of SDS or
          product monograph)?
        </legend>
        <RHFBooleanRadioGroup
          id="require-ventilation"
          name="requireVentilation"
        />
      </fieldset>
      <fieldset>
        <legend>Is your workflow uninterrupted?</legend>
        <RHFBooleanRadioGroup
          id="is-workflow-uninterrupted"
          name="isWorkflowUninterrupted"
        />
      </fieldset>
      <div className={`form-group`} hidden={isWorkflowUninterrupted !== false}>
        <label
          htmlFor="interrupted-workflow-process"
          className={isWorkflowUninterrupted ? "disabled" : ""}
        >
          If no, describe your processes to address the situation in order to
          meet standards:
        </label>
        <TextArea
          {...register("workflowStandardsProcess", {
            disabled: isWorkflowUninterrupted !== false,
            deps: "isWorkflowUninterrupted",
          })}
          id="interrupted-workflow-process"
          cols={30}
          rows={7}
        />
      </div>
      <fieldset>
        <legend>Is there a risk of microbial contamination?</legend>
        <RHFBooleanRadioGroup
          id="microbial-contamination-risk"
          name="microbialContaminationRisk"
        />
      </fieldset>
      <fieldset>
        <legend>
          Is there risk of cross contamination with other products?
        </legend>
        <RHFBooleanRadioGroup
          id="cross-contamination-risk"
          name="crossContaminationRisk"
        />
      </fieldset>
      <fieldset className="row grow">
        <legend>
          Exposure risk to compounding personnel (as per section 2 of the SDS or
          product monograph)
        </legend>
        <ExposureRisksInputs
          name="exposureRisks.sds"
          category="From SDS"
          register={register}
          sdsIds={ingredients
            ?.map((ing) => ing.sdsId)
            .filter<number>((id): id is number => typeof id === "number")}
        />
        {usesCommercialProduct && (
          <ExposureRisksInputs
            name="exposureRisks.productMonograph"
            category="From Product Monograph"
            register={register}
          />
        )}
      </fieldset>
      <fieldset>
        <legend>
          PPE deemed necessary (as per SDS, product monograph) and assessment of
          risk:
        </legend>
        <fieldset className="row">
          <legend>Gloves:</legend>
          <div className="form-group">
            <label>Required?</label>
            <RHFBooleanRadioGroup
              id="ppe-gloves-required"
              name="ppe.gloves.required"
              rules={{ deps: "ppe.gloves.type" }}
            />
          </div>
          <div className="form-group">
            <label className={!glovesRequired ? "disabled" : ""}>Type:</label>
            <Select
              name="ppe.gloves.type"
              rules={{
                disabled: !glovesRequired,
              }}
              id="ppe-gloves"
              initialOption
            >
              <option value="regular">Regular gloves</option>
              <option value="chemotherapy">Chemotherapy gloves</option>
              <option value="double">Double gloves</option>
            </Select>
          </div>
        </fieldset>
        <fieldset className="row">
          <legend>Coat:</legend>
          <div className="form-group">
            <label>Required?</label>
            <RHFBooleanRadioGroup
              id="ppe-coat-required"
              name="ppe.coat.required"
              rules={{ deps: "ppe.coat.type" }}
            />
          </div>
          <div className="form-group">
            <label className={!coatRequired ? "disabled" : ""}>Type:</label>
            <Select
              name="ppe.coat.type"
              rules={{
                disabled: !coatRequired,
              }}
              id="ppe-coat-type"
              initialOption
            >
              <option value="designated">Designated coat</option>
              <option value="disposable">Disposable coat</option>
            </Select>
          </div>
        </fieldset>
        <fieldset className="row">
          <legend>Mask:</legend>
          <div className="form-group">
            <label>Required?</label>
            <RHFBooleanRadioGroup
              id="ppe-mask-required"
              name="ppe.mask.required"
              rules={{ deps: "ppe.mask.type" }}
            />
          </div>
          <div className="form-group">
            <label className={!maskRequired ? "disabled" : ""}>Type:</label>
            <Input
              {...register("ppe.mask.type", {
                disabled: !maskRequired,
              })}
              type="text"
              id="ppe-mask-type"
              disabled={!maskRequired}
            />
          </div>
        </fieldset>
        <fieldset className="row">
          <legend>Eye Protection:</legend>
          <div className="form-group">
            <label>Required?</label>
            <RHFBooleanRadioGroup
              id="ppe-eye-protection-required"
              name="ppe.eyeProtection.required"
            />
          </div>
        </fieldset>
        <div className="form-group">
          <label>Other:</label>
          <Input
            {...register("ppe.other")}
            type="text"
            id="ppe-other"
            size={100}
          />
        </div>
      </fieldset>
      <fieldset>
        <legend>Is an eye wash station required?</legend>
        <RHFBooleanRadioGroup
          id="require-eye-wash-station"
          name="requireEyeWashStation"
        />
      </fieldset>
      <fieldset>
        <legend>Is a safety shower required?</legend>
        <RHFBooleanRadioGroup
          id="require-safety-shower"
          name="requireSafetyShower"
        />
      </fieldset>
      <fieldset>
        <div id="risk-level-container" className="form-group">
          <label>Risk level assigned:</label>
          <Select name="riskLevel" id="risk-level-select" initialOption>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </Select>
        </div>
        <div className="form-group">
          <label htmlFor="rationale">
            Rationale and other risk mitigation measures:
          </label>
          <RationaleList
            getValues={getValues}
            register={register}
            setValue={setValue}
          />
        </div>
      </fieldset>
      <fieldset>
        <div className="form-group">
          <label>
            <span>Compounding supervisor:</span>
            <Input
              type="text"
              {...register("compoundingSupervisor")}
              size={30}
            />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="date-assessed">Date assessed:</label>
          <Input type="date" {...register("dateAssessed")} id="date-assessed" />
        </div>
      </fieldset>
      <style jsx global>
        {form}
      </style>
      <style jsx>{`
        #risk-level-select {
          width: min-content;
        }
      `}</style>
    </>
  )
}

export default RiskAssessmentEntry
