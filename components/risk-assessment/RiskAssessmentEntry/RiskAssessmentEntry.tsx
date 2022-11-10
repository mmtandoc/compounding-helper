import { useEffect } from "react"
import { UseFormReturn, useFieldArray } from "react-hook-form"

import { RHFBooleanRadioGroup } from "components/BooleanRadioGroup"
import Button from "components/common/Button"
import Fieldset from "components/common/forms/Fieldset"
import { FormGroup } from "components/common/forms/FormGroup"
import Input from "components/common/forms/Input"
import Select from "components/common/forms/Select"
import TextArea from "components/common/forms/TextArea"
import IngredientEntry from "components/compound/ingredient/IngredientEntry"
import { RHFRadioGroup } from "components/RadioGroup"
import {
  NullPartialIngredientFields,
  NullPartialRiskAssessmentFields,
} from "lib/fields"
import useUpdateFieldConditionally from "lib/hooks/useUpdateFieldConditionally"
import { nestedForm } from "lib/rhf/nestedForm"

import ExposureRisksInputs from "./ExposureRisksInputs"
import RationaleList from "./RationaleList"

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

  const { register, control, watch, setValue, getValues, clearErrors } =
    formMethods

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

  useEffect(() => {
    if (maskRequired === false) {
      clearErrors("ppe.mask.type")
    }
  }, [maskRequired, clearErrors])

  useEffect(() => {
    if (coatRequired === false) {
      clearErrors("ppe.coat.type")
    }
  }, [coatRequired, clearErrors])

  useEffect(() => {
    if (glovesRequired === false) {
      clearErrors("ppe.gloves.type")
    }
  }, [glovesRequired, clearErrors])

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
      <FormGroup>
        <label htmlFor="compound-name">Compound name:</label>
        <Input
          id="compound-name"
          type="text"
          {...register("compound.name")}
          autoComplete="off"
          size={40}
        />
      </FormGroup>
      <Fieldset legend="Ingredients:">
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
          <Button
            className="add-button"
            size="small"
            value="add"
            onClick={() =>
              ingredientsArrayMethods.append(emptyIngredientValues)
            }
          >
            Add Ingredient
          </Button>
        </div>
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
        <RHFRadioGroup
          name="complexity"
          radioOptions={[
            ["simple", "Simple"],
            ["moderate", "Moderate"],
            ["complex", "Complex"],
          ]}
        />
      </Fieldset>
      <Fieldset legend="Is this compound only prepared occasionally?">
        <RHFBooleanRadioGroup name="isPreparedOccasionally" />
      </Fieldset>
      <Fieldset legend="How often is this compound prepared?">
        <RHFRadioGroup
          name="preparationFrequency"
          radioOptions={[
            ["daily", "Daily"],
            ["weekly", "Weekly"],
            ["monthly", "Monthly"],
          ]}
        />
      </Fieldset>
      <Fieldset legend="Are there only small quantities of ingredients being prepared?">
        <FormGroup>
          <RHFBooleanRadioGroup id="is-small-quantity" name="isSmallQuantity" />
        </FormGroup>
      </Fieldset>
      <Fieldset legend="On average, what quantity of this preparation is being prepared at a time?">
        <FormGroup row>
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
        </FormGroup>
      </Fieldset>
      <Fieldset legend="Do the concentration of ingredients in the product present a health risk to the compounder?">
        <RHFBooleanRadioGroup
          id="is-concentration-health-risk"
          name="isConcentrationHealthRisk"
        />
      </Fieldset>
      <Fieldset legend="Does preparation require special education or competencies for your compounding personnel?">
        <RHFBooleanRadioGroup
          id="require-special-education"
          name="requireSpecialEducation"
        />
      </Fieldset>
      <Fieldset legend="Are there verification steps during compounding?">
        <RHFBooleanRadioGroup
          id="has-verification-steps"
          name="hasVerificationSteps"
        />
      </Fieldset>
      <Fieldset legend="Do you have appropriate facilities and equipment to prepare this compound?">
        <RHFBooleanRadioGroup
          id="have-appropriate-facilities"
          name="haveAppropriateFacilities"
        />
      </Fieldset>
      <Fieldset legend="Is ventilation required for preparation (as per section 8 of SDS or product monograph)?">
        <RHFBooleanRadioGroup
          id="require-ventilation"
          name="requireVentilation"
        />
      </Fieldset>
      <Fieldset legend="Is your workflow uninterrupted?">
        <RHFBooleanRadioGroup
          id="is-workflow-uninterrupted"
          name="isWorkflowUninterrupted"
        />
      </Fieldset>
      <FormGroup hidden={isWorkflowUninterrupted !== false}>
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
      </FormGroup>
      <Fieldset legend="Is there a risk of microbial contamination?">
        <RHFBooleanRadioGroup
          id="microbial-contamination-risk"
          name="microbialContaminationRisk"
        />
      </Fieldset>
      <Fieldset legend="Is there risk of cross contamination with other products?">
        <RHFBooleanRadioGroup
          id="cross-contamination-risk"
          name="crossContaminationRisk"
        />
      </Fieldset>
      <Fieldset
        legend="Exposure risk to compounding personnel (as per section 2 of the SDS or product monograph)"
        className="row grow"
      >
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
      </Fieldset>
      <Fieldset legend="PPE deemed necessary (as per SDS, product monograph) and assessment of risk:">
        <Fieldset legend="Gloves:" className="row">
          <FormGroup>
            <label>Required?</label>
            <RHFBooleanRadioGroup
              id="ppe-gloves-required"
              name="ppe.gloves.required"
            />
          </FormGroup>
          <FormGroup>
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
          </FormGroup>
        </Fieldset>
        <Fieldset legend="Coat:" className="row">
          <FormGroup>
            <label>Required?</label>
            <RHFBooleanRadioGroup
              id="ppe-coat-required"
              name="ppe.coat.required"
            />
          </FormGroup>
          <FormGroup>
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
          </FormGroup>
        </Fieldset>
        <Fieldset legend="Mask:" className="row">
          <FormGroup>
            <label>Required?</label>
            <RHFBooleanRadioGroup
              id="ppe-mask-required"
              name="ppe.mask.required"
            />
          </FormGroup>
          <FormGroup>
            <label className={!maskRequired ? "disabled" : ""}>Type:</label>
            <Input
              {...register("ppe.mask.type", {
                disabled: !maskRequired,
              })}
              type="text"
              id="ppe-mask-type"
              disabled={!maskRequired}
            />
          </FormGroup>
        </Fieldset>
        <Fieldset legend="Eye Protection:" className="row">
          <FormGroup>
            <label>Required?</label>
            <RHFBooleanRadioGroup
              id="ppe-eye-protection-required"
              name="ppe.eyeProtection.required"
            />
          </FormGroup>
        </Fieldset>
        <FormGroup>
          <label>Other:</label>
          <Input
            {...register("ppe.other")}
            type="text"
            id="ppe-other"
            size={100}
          />
        </FormGroup>
      </Fieldset>
      <Fieldset legend="Is an eye wash station required?">
        <RHFBooleanRadioGroup
          id="require-eye-wash-station"
          name="requireEyeWashStation"
        />
      </Fieldset>
      <Fieldset legend="Is a safety shower required?">
        <RHFBooleanRadioGroup
          id="require-safety-shower"
          name="requireSafetyShower"
        />
      </Fieldset>
      <Fieldset>
        <div id="risk-level-container" className="form-group">
          <label>Risk level assigned:</label>
          <Select name="riskLevel" id="risk-level-select" initialOption>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </Select>
        </div>
        <FormGroup>
          <label htmlFor="rationale">
            Rationale and other risk mitigation measures:
          </label>
          <RationaleList
            getValues={getValues}
            register={register}
            setValue={setValue}
          />
        </FormGroup>
      </Fieldset>
      <Fieldset>
        <FormGroup>
          <label>
            <span>Compounding supervisor:</span>
            <Input
              type="text"
              {...register("compoundingSupervisor")}
              size={30}
            />
          </label>
        </FormGroup>
        <FormGroup>
          <label htmlFor="date-assessed">Date assessed:</label>
          <Input type="date" {...register("dateAssessed")} id="date-assessed" />
        </FormGroup>
      </Fieldset>
      <style jsx>{`
        #risk-level-select {
          width: min-content;
        }
      `}</style>
    </>
  )
}

export default RiskAssessmentEntry
