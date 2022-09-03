import axios from "axios"
import { RHFBooleanRadioGroup } from "components/BooleanRadioGroup"
import { RHFRadioGroup } from "components/RadioGroup"
import { useEffect, useState } from "react"
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { RiskAssessmentFields } from "types/fields"
import { NullPartialDeep } from "types/util"
import ExposureRisksInputs from "./ExposureRisksInputs"
import { useClearDisabledField } from "./helpers"
import IngredientFieldset from "./IngredientFieldset"
import RationaleList from "./RationaleList"

export type NullPartialRiskAssessmentFields =
  NullPartialDeep<RiskAssessmentFields>

type Props = {
  values?: NullPartialRiskAssessmentFields
}

const RiskAssessmentEntry = (props: Props) => {
  const defaultValues: NullPartialRiskAssessmentFields = {
    compoundName: null,
    ingredients: [
      {
        chemicalId: null,
        physicalForm: null,
        productId: null,
        sdsId: null,
        commercialProduct: {
          isCommercialProduct: null,
          name: null,
          din: null,
          hasProductMonographConcerns: null,
          concernsDescription: null,
        },
      },
    ],
    complexity: null,
    averagePreparationAmount: null,
    crossContaminationRisk: null,
    hasVerificationSteps: null,
    haveAppropriateFacilities: null,
    isConcentrationHealthRisk: null,
    isPreparedOccasionally: null,
    isSmallQuantity: null,
    isWorkflowUninterrupted: null,
    workflowStandardsProcess: null,
    microbialContaminationRisk: null,
    requireEyeWashStation: null,
    requireSafetyShower: null,
    requireSpecialEducation: null,
    requireVentilation: null,
    riskLevel: null,
    exposureRisks: {
      sds: {
        eye: null,
        oral: null,
        inhalation: null,
        skin: null,
        other: null,
        otherDescription: null,
      },
      productMonograph: {
        eye: null,
        oral: null,
        inhalation: null,
        skin: null,
        other: null,
        otherDescription: null,
      },
    },
    ppe: {
      mask: { required: null, type: null },
      coat: { required: null, type: null },
      gloves: { required: null, type: null },
      eyeProtection: { required: null },
    },
    preparationFrequency: null,
    rationaleList: {
      automatic: [],
      additional: [],
    },
    dateAssessed: new Date().toLocaleDateString(),
  }

  const [saveSuccessful, setSaveSuccessful] = useState<boolean | undefined>()

  const formMethods = useForm<NullPartialRiskAssessmentFields>({
    defaultValues,
  })

  const { register, reset, control, handleSubmit, watch, setValue, getValues } =
    formMethods

  const [isWorkflowUninterrupted, glovesRequired, coatRequired, maskRequired] =
    watch([
      "isWorkflowUninterrupted",
      "ppe.gloves.required",
      "ppe.coat.required",
      "ppe.mask.required",
    ])

  useEffect(() => {
    if (props.values) {
      reset(props.values)
    }
  }, [props.values, reset])

  const { fields: ingredientFields, ...ingredientsArrayMethods } =
    useFieldArray({
      control: control,
      name: "ingredients",
      rules: { required: true },
    })

  const ingredients = watch("ingredients")

  const usesCommercialProduct = ingredients?.some(
    (i) => i?.commercialProduct?.isCommercialProduct === true,
  )

  useEffect(() => {
    if (ingredientFields.length === 0) {
      ingredientsArrayMethods.append({
        chemicalId: null,
        physicalForm: null,
        productId: null,
        sdsId: null,
        commercialProduct: {
          isCommercialProduct: null,
          name: null,
          din: null,
          hasProductMonographConcerns: null,
          concernsDescription: null,
        },
      })
    }
  }, [ingredientFields, ingredientsArrayMethods])

  /*    //TODO: Handle error
    const { data: chemicalsData, error: chemicalError } = useSWR<
    ChemicalAll[],
    JsonError
  >(
    !ingredients || ingredients.length === 0
      ? null
      : [
          ingredients?.map((ingredient) =>
            ingredient?.chemicalId
              ? `/api/chemicals/${ingredient.chemicalId}`
              : null,
          ),
        ],
  )

  if (chemicalError) {
    console.log(chemicalError)
  } */

  useClearDisabledField({
    clearConditional: coatRequired !== true,
    names: ["ppe.coat.type"],
    register,
    setValue,
  })

  useClearDisabledField({
    clearConditional: glovesRequired !== true,
    names: ["ppe.gloves.type"],
    register,
    setValue,
  })

  useClearDisabledField({
    clearConditional: maskRequired !== true,
    names: ["ppe.mask.type"],
    register,
    setValue,
  })

  const onSubmit: SubmitHandler<NullPartialRiskAssessmentFields> = async (
    data,
  ) => {
    await axios
      .post("/api/risk-assessments", data)
      .then((res) => {
        setSaveSuccessful(true)
      })
      .catch((reason) => {
        //TODO: Handle error
        console.log(JSON.stringify(reason))
        setSaveSuccessful(false)
      })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (data) => {
        setSaveSuccessful(false)
      })}
      autoComplete="off"
    >
      <button
        type="button"
        onClick={() => {
          const testValues: RiskAssessmentFields = {
            compoundName: "TEST COMPOUND",
            ingredients: [
              {
                chemicalId: 1,
                productId: 1,
                sdsId: 1,
                physicalForm: "cream",
                commercialProduct: {
                  isCommercialProduct: true,
                  name: "TEST COMMERICAL PRODUCT",
                  din: 123456,
                  hasProductMonographConcerns: true,
                  concernsDescription: "TEST PRODUCT MONOGRAPH CONCERNS",
                },
              },
              {
                chemicalId: 2,
                productId: 2,
                sdsId: 2,
                physicalForm: "cream",
                commercialProduct: {
                  isCommercialProduct: false,
                  name: null,
                  din: null,
                  hasProductMonographConcerns: null,
                  concernsDescription: null,
                },
              },
            ],
            complexity: "complex",
            averagePreparationAmount: {
              quantity: 5,
              unit: "g",
            },
            crossContaminationRisk: false,
            hasVerificationSteps: false,
            haveAppropriateFacilities: true,
            isConcentrationHealthRisk: false,
            isPreparedOccasionally: true,
            isSmallQuantity: true,
            isWorkflowUninterrupted: false,
            workflowStandardsProcess:
              "TEST WORKFLOW INTERRUPTION MITIGATION STANDARDS DESCRIPTION",
            microbialContaminationRisk: false,
            requireEyeWashStation: false,
            requireSafetyShower: false,
            requireSpecialEducation: false,
            requireVentilation: true,
            riskLevel: "A",
            exposureRisks: {
              sds: {
                eye: true,
                oral: false,
                inhalation: true,
                skin: true,
                other: false,
                otherDescription: null,
              },
              productMonograph: {
                eye: true,
                oral: false,
                inhalation: false,
                skin: true,
                other: false,
                otherDescription: null,
              },
            },
            ppe: {
              mask: { required: true, type: "Disposable" },
              coat: { required: true, type: "designated" },
              gloves: { required: false, type: null },
              eyeProtection: { required: true },
            },
            preparationFrequency: "monthly",
            rationaleList: {
              automatic: [],
              additional: [
                "TEST ADDITIONAL RATIONALE 1",
                "TEST ADDITIONAL RATIONALE 2",
              ],
            },
            dateAssessed: new Date().toLocaleDateString(),
          }
          reset(testValues, { keepDefaultValues: true })
        }}
      >
        FILL WITH TEST
      </button>
      <button type="button" onClick={() => reset()}>
        Reset
      </button>
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
            onClick={() => ingredientsArrayMethods.append(null)}
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
      <div>
        <button type="submit">Submit</button>
        {saveSuccessful !== undefined && (
          <p color={saveSuccessful ? "green" : "red"}>
            {saveSuccessful ? "Saved" : "Error"}
          </p>
        )}
      </div>
      <style jsx global>{`
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

        .form-group textarea {
          resize: vertical;
          width: 100%;
        }

        .form-group > label {
          font-weight: 600;
          display: block;
          width: fit-content;
        }

        form-group:not(.row) > label {
          margin-bottom: 0.3rem;
        }

        .label {
          font-weight: 600;
          //display: inline-block;
          //margin-right: 0.5rem;
        }

        label.disabled {
          color: dimgray;
        }

        .form-group input,
        .form-group select {
          width: fit-content;
        }

        .row {
          display: flex;
          flex-direction: row !important;
          gap: 0.7rem;
          //padding: 0;
        }

        .row.grow > * {
          //flex: 1;
          flex-grow: 1;
        }

        .row > * {
          //margin: 0;
        }

        .col {
          display: flex;
          flex-direction: column !important;
        }
      `}</style>

      <style jsx>{`
        form {
          width: 90%;
          margin-bottom: 5rem;
          align-self: center;
        }

        #risk-level-select {
          width: min-content;
        }

        input[type="date"] {
          width: fit-content;
        }
      `}</style>
    </form>
  )
}

export default RiskAssessmentEntry
