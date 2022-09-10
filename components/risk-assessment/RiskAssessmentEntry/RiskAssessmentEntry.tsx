import { RHFBooleanRadioGroup } from "components/BooleanRadioGroup"
import { RHFRadioGroup } from "components/RadioGroup"
import { useEffect } from "react"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import form from "styles/form"
import { RiskAssessmentFields } from "types/fields"
import { NullPartialDeep } from "types/util"
import ExposureRisksInputs from "./ExposureRisksInputs"
import { useClearDisabledField } from "./helpers"
import IngredientFieldset from "./ingredient/IngredientFieldset"
import RationaleList from "./RationaleList"

export type NullPartialRiskAssessmentFields =
  NullPartialDeep<RiskAssessmentFields>

type Props = {
  values?: NullPartialRiskAssessmentFields
  formMethods: UseFormReturn<NullPartialRiskAssessmentFields>
}

const RiskAssessmentEntry = (props: Props) => {
  const { values, formMethods } = props

  const { register, reset, control, watch, setValue, getValues } = formMethods

  const [isWorkflowUninterrupted, glovesRequired, coatRequired, maskRequired] =
    watch([
      "isWorkflowUninterrupted",
      "ppe.gloves.required",
      "ppe.coat.required",
      "ppe.mask.required",
    ])

  const { fields: ingredientFields, ...ingredientsArrayMethods } =
    useFieldArray({
      control: control,
      name: "ingredients",
      rules: { required: true },
    })

  const ingredients = watch("ingredients")

  useEffect(() => {
    reset(values)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, JSON.stringify(values)])

  const usesCommercialProduct = ingredients?.some(
    (i) => i?.commercialProduct?.isCommercialProduct === true,
  )

  useEffect(() => {
    if (
      ingredients &&
      ingredients.length === 0 &&
      ingredientFields.length === 0
    ) {
      ingredientsArrayMethods.append({
        id: null,
        chemicalId: null,
        physicalForm: null,
        productId: null,
        sdsId: null,
        commercialProduct: {
          isCommercialProduct: null,
          name: null,
          din: null,
          hasNoDin: null,
          hasProductMonographConcerns: null,
          concernsDescription: null,
        },
      })
    }
  }, [ingredients, ingredientFields, ingredientsArrayMethods])

  useClearDisabledField({
    clearConditional: coatRequired === false || coatRequired === null,
    names: ["ppe.coat.type"],
    register,
    setValue,
  })

  useClearDisabledField({
    clearConditional: glovesRequired === false || glovesRequired === null,
    names: ["ppe.gloves.type"],
    register,
    setValue,
  })

  useClearDisabledField({
    clearConditional: maskRequired === false || maskRequired === null,
    names: ["ppe.mask.type"],
    register,
    setValue,
  })

  return (
    <>
      <div className="form-group">
        <label htmlFor="compound-name">Compound name:</label>
        <input
          id="compound-name"
          type="text"
          {...register("compoundName", { required: true })}
          autoComplete="off"
          size={40}
        />
      </div>
      <fieldset>
        <legend>Ingredients:</legend>
        {ingredientFields.map((field, index) => (
          <IngredientFieldset
            fields={ingredientFields}
            key={field.id}
            field={field}
            index={index}
            register={register}
            setValue={setValue}
            getValues={getValues}
            control={control}
            remove={ingredientsArrayMethods.remove}
            update={ingredientsArrayMethods.update}
            move={ingredientsArrayMethods.move}
            reset={() => {
              formMethods.resetField(`ingredients.${index}`, {
                defaultValue: {
                  chemicalId: null,
                  physicalForm: null,
                  productId: null,
                  sdsId: null,
                  commercialProduct: {
                    isCommercialProduct: null,
                    name: null,
                    din: null,
                    hasNoDin: null,
                    hasProductMonographConcerns: null,
                    concernsDescription: null,
                  },
                },
              })
            }}
            watch={watch}
          />
        ))}
        <div>
          <button
            type="button"
            className="add-button"
            value="add"
            onClick={() =>
              ingredientsArrayMethods.append({
                id: null,
                chemicalId: null,
                physicalForm: null,
                productId: null,
                sdsId: null,
                commercialProduct: {
                  isCommercialProduct: null,
                  name: null,
                  din: null,
                  hasNoDin: null,
                  hasProductMonographConcerns: null,
                  concernsDescription: null,
                },
              })
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
          control={control}
          rules={{ required: true }}
          radioOptions={[
            ["simple", "Simple"],
            ["moderate", "Moderate"],
            ["complex", "Complex"],
          ]}
        />
      </fieldset>
      <fieldset>
        <legend>Is this compound only prepared occasionally?</legend>
        <RHFBooleanRadioGroup
          name="isPreparedOccasionally"
          control={control}
          rules={{ required: true }}
        />
      </fieldset>
      <fieldset>
        <legend>How often is this compound prepared?</legend>
        <RHFRadioGroup
          name="preparationFrequency"
          control={control}
          rules={{ required: true }}
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
          <RHFBooleanRadioGroup
            id="is-small-quantity"
            name="isSmallQuantity"
            control={control}
            rules={{ required: true }}
          />
        </div>
      </fieldset>
      <fieldset>
        <legend>
          On average, what quantity of this preparation is being prepared at a
          time?
        </legend>
        <div className="form-group row">
          <input
            id="average-preparation-amount-value"
            {...register("averagePreparationAmount.quantity", {
              required: true,
              valueAsNumber: true,
            })}
            step="0.1"
            type="number"
            size={3}
          />
          <select
            id="average-preparation-amount-unit"
            {...register("averagePreparationAmount.unit", {
              required: true,
            })}
            defaultValue={undefined}
          >
            <option value="g">g</option>
            <option value="ml">ml</option>
          </select>
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
          control={control}
          rules={{
            required: true,
          }}
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
          control={control}
          rules={{
            required: true,
            validate: (value) => {
              return value !== undefined
            },
          }}
        />
      </fieldset>
      <fieldset>
        <legend>Are there verification steps during compounding?</legend>
        <RHFBooleanRadioGroup
          id="has-verification-steps"
          name="hasVerificationSteps"
          control={control}
          rules={{ required: true }}
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
          control={control}
          rules={{ required: true }}
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
          control={control}
          rules={{ required: true }}
        />
      </fieldset>
      <fieldset>
        <legend>Is your workflow uninterrupted?</legend>
        <RHFBooleanRadioGroup
          id="is-workflow-uninterrupted"
          name="isWorkflowUninterrupted"
          control={control}
          rules={{ required: true }}
        />
      </fieldset>
      {isWorkflowUninterrupted === false && (
        <div
          className={`form-group ${
            isWorkflowUninterrupted !== false ? "hidden" : ""
          }`}
        >
          <label
            htmlFor="interrupted-workflow-process"
            className={isWorkflowUninterrupted ? "disabled" : ""}
          >
            If no, describe your processes to address the situation in order to
            meet standards:
          </label>
          <textarea
            {...register("workflowStandardsProcess", {
              disabled: !!isWorkflowUninterrupted,
              required: isWorkflowUninterrupted === false,
              deps: "isWorkflowUninterrupted",
            })}
            id="interrupted-workflow-process"
            cols={30}
            rows={7}
          />
        </div>
      )}
      <fieldset>
        <legend>Is there a risk of microbial contamination?</legend>
        <RHFBooleanRadioGroup
          id="microbial-contamination-risk"
          name="microbialContaminationRisk"
          control={control}
          rules={{ required: true }}
        />
      </fieldset>
      <fieldset>
        <legend>
          Is there risk of cross contamination with other products?
        </legend>
        <RHFBooleanRadioGroup
          id="cross-contamination-risk"
          name="crossContaminationRisk"
          control={control}
          rules={{ required: true }}
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
          control={control}
          sdsIds={ingredients
            ?.map((ing) => ing.sdsId)
            .filter<number>((id): id is number => typeof id === "number")}
        />
        {usesCommercialProduct && (
          <ExposureRisksInputs
            name="exposureRisks.productMonograph"
            category="From Product Monograph"
            register={register}
            control={control}
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
              control={control}
              rules={{ required: true }}
            />
          </div>
          <div className="form-group">
            <label className={!glovesRequired ? "disabled" : ""}>Type:</label>
            <select
              {...register("ppe.gloves.type", {
                disabled: !glovesRequired,
                required: !!glovesRequired,
              })}
              id="ppe-gloves"
              defaultValue={undefined}
            >
              <option value="regular">Regular gloves</option>
              <option value="chemotherapy">Chemotherapy gloves</option>
              <option value="double">Double gloves</option>
            </select>
          </div>
        </fieldset>
        <fieldset className="row">
          <legend>Coat:</legend>
          <div className="form-group">
            <label>Required?</label>
            <RHFBooleanRadioGroup
              id="ppe-coat-required"
              name="ppe.coat.required"
              control={control}
              rules={{ required: true }}
            />
          </div>
          <div className="form-group">
            <label className={!coatRequired ? "disabled" : ""}>Type:</label>
            <select
              {...register("ppe.coat.type", {
                disabled: !coatRequired,
                required: !!coatRequired,
              })}
              id="ppe-coat-type"
              defaultValue={undefined}
            >
              <option value="designated">Designated coat</option>
              <option value="disposable">Disposable coat</option>
            </select>
          </div>
        </fieldset>
        <fieldset className="row">
          <legend>Mask:</legend>
          <div className="form-group">
            <label>Required?</label>
            <RHFBooleanRadioGroup
              id="ppe-mask-required"
              name="ppe.mask.required"
              control={control}
              rules={{ required: true }}
            />
          </div>
          <div className="form-group">
            <label className={!maskRequired ? "disabled" : ""}>Type:</label>
            <input
              {...register("ppe.mask.type", {
                disabled: !maskRequired,
                required: !!maskRequired,
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
              control={control}
              rules={{ required: true }}
            />
          </div>
        </fieldset>
        <div className="form-group">
          <label>Other:</label>
          <input
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
          control={control}
          rules={{ required: true }}
        />
      </fieldset>
      <fieldset>
        <legend>Is a safety shower required?</legend>
        <RHFBooleanRadioGroup
          id="require-safety-shower"
          name="requireSafetyShower"
          control={control}
          rules={{ required: true }}
        />
      </fieldset>
      <fieldset>
        <div id="risk-level-container" className="form-group">
          <label>Risk level assigned:</label>
          <select
            {...register("riskLevel", { required: true })}
            id="risk-level-select"
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="rationale">
            Rationale and other risk mitigation measures:
          </label>
          <RationaleList
            control={control}
            getValues={getValues}
            register={register}
            setValue={setValue}
            watch={watch}
          />
          {/* <textarea
            {...register("rationale", { required: true })}
            id="rationale"
            cols={30}
            rows={5}
          ></textarea> */}
        </div>
        <div className="form-group">
          <label htmlFor="date-assessed">Date assessed:</label>
          <input
            type="date"
            {...register("dateAssessed", { required: true })}
            id="date-assessed"
          />
        </div>
      </fieldset>
      <style jsx global>
        {form}
      </style>
      <style jsx global>{`
        .form-group textarea {
          resize: vertical;
          width: 100%;
        }
      `}</style>

      <style jsx>{`
        #risk-level-select {
          width: min-content;
        }

        input[type="date"] {
          width: fit-content;
        }
      `}</style>
    </>
  )
}

export default RiskAssessmentEntry
