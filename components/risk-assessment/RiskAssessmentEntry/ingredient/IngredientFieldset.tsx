import ChemicalSearch from "./ChemicalSearch"
import React, { useEffect } from "react"
import {
  Control,
  FieldArrayWithId,
  FieldError,
  UseFieldArrayReturn,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form"
import useSWR from "swr"
import { SetRequired } from "type-fest"
import { JsonError } from "types/common"
import { ChemicalAll, SdsWithRelations } from "types/models"
import { RHFBooleanRadioGroup } from "components/BooleanRadioGroup"
import { NullPartialRiskAssessmentFields } from ".."
import { Vendor } from "@prisma/client"
import { useClearDisabledField } from "../helpers"
import SdsSelect from "./SdsSelect"

interface IngredientFieldsetProps
  extends SetRequired<
    Partial<UseFieldArrayReturn<NullPartialRiskAssessmentFields>>,
    "remove" | "update" | "move" | "fields"
  > {
  id?: string
  error?: FieldError
  field: FieldArrayWithId<NullPartialRiskAssessmentFields>
  index: number
  register: UseFormRegister<NullPartialRiskAssessmentFields>
  setValue: UseFormSetValue<NullPartialRiskAssessmentFields>

  getValues: UseFormGetValues<NullPartialRiskAssessmentFields>
  control: Control<NullPartialRiskAssessmentFields>
  reset: () => void
  watch: UseFormWatch<NullPartialRiskAssessmentFields>
}

const IngredientFieldset = ({
  index,
  register,
  setValue,
  fields,
  control,
  remove,
  reset,
  move,
  watch,
}: IngredientFieldsetProps) => {
  const ingredient = watch(`ingredients.${index}`)

  const { data: chemicalData, error: chemicalError } = useSWR<
    ChemicalAll,
    JsonError
  >(!ingredient?.chemicalId ? null : `/api/chemicals/${ingredient.chemicalId}`)

  const { data: vendorsData, error: vendorsError } = useSWR<
    Vendor[],
    JsonError
  >(`/api/vendors`)

  const { data: sdsesData, error: sdsesError } = useSWR<
    SdsWithRelations[],
    JsonError
  >(
    !ingredient?.chemicalId
      ? null
      : `/api/sds?chemicalId=${ingredient.chemicalId}`,
  )

  //TODO: Handle error
  if (chemicalError) {
    console.log(chemicalError)
  }

  if (sdsesError) {
    console.log(sdsesError)
  }

  if (vendorsError) {
    console.log(vendorsError)
  }

  const isCommercialProduct = watch(
    `ingredients.${index}.commercialProduct.isCommercialProduct`,
  ) as boolean

  const hasNoDin = watch(`ingredients.${index}.commercialProduct.hasNoDin`)

  const hasProductMonographConcerns = watch(
    `ingredients.${index}.commercialProduct.hasProductMonographConcerns`,
  )

  useClearDisabledField({
    clearConditional: isCommercialProduct !== true,
    names: [
      `ingredients.${index}.commercialProduct.hasProductMonographConcerns`,
      `ingredients.${index}.commercialProduct.name`,
      `ingredients.${index}.commercialProduct.din`,
    ],
    register,
    setValue,
  })

  useClearDisabledField({
    clearConditional: hasNoDin === true,
    names: [`ingredients.${index}.commercialProduct.din`],
    register,
    setValue,
  })

  //TODO: Handle loading better

  const isLoading =
    !!ingredient?.chemicalId && (!chemicalData || !sdsesData || !vendorsData)

  useEffect(() => {
    if (
      !isLoading &&
      !ingredient?.sdsId &&
      !!sdsesData &&
      sdsesData.length > 0
    ) {
      register(`ingredients.${index}.sdsId`)
      setValue(`ingredients.${index}.sdsId`, sdsesData[0].id)
    }
  }, [index, ingredient?.sdsId, isLoading, register, sdsesData, setValue])

  if (isLoading) {
    return <div>Loading...</div>
  }

  //TODO: Show past revisions only in certain situations
  const showPastRevisions = false

  const selectedSds = sdsesData?.find((sds) => sds.id === ingredient?.sdsId)

  return (
    <fieldset className="ingredient-fieldset">
      <div className="ingredient-body">
        <div className="inputs-container">
          <div className="row">
            <input
              type="hidden"
              {...register(`ingredients.${index}.id`, { valueAsNumber: true })}
            />
            <div className="form-group">
              <label htmlFor={`i${index}-chemical-search`}>
                Chemical name:{" "}
              </label>
              <div className="row">
                <ChemicalSearch
                  id={`i${index}-chemical-search`}
                  name={`ingredients.${index}.chemicalId`}
                  control={control}
                  rules={{ required: !isCommercialProduct }}
                  size={30}
                />

                <button type="button" disabled={!ingredient?.chemicalId}>
                  ...
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor={`i${index}-physical-form`}>Physical form: </label>
              <select
                {...register(`ingredients.${index}.physicalForm` as const, {
                  required: true,
                  setValueAs: (val) => (!val ? undefined : val),
                })}
                id={`i${index}-physical-form`}
                className="physical-form"
              >
                <option value="cream">Cream</option>
                <option value="ointment">Ointment</option>
                <option value="powder">Powder</option>
                <option value="liquid">Liquid</option>
                <option value="solid">Solid</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="form-group">
              <label htmlFor={`i${index}-sds-select`}>Safety Datasheet</label>
              <div className="row">
                <SdsSelect
                  chemical={chemicalData}
                  vendors={vendorsData}
                  sdses={sdsesData}
                  showPastRevisions={showPastRevisions}
                  ingredientIndex={index}
                  register={register}
                  disabled={!ingredient?.chemicalId}
                  required={!isCommercialProduct}
                />
                <button type="button" disabled={!ingredient?.sdsId}>
                  ...
                </button>
              </div>
            </div>
          </div>
          <div className="row">
              <div className="form-group">
                <label htmlFor={`i${index}-is-commercial-product`}>
                  Is a commercial product?
                </label>
                <RHFBooleanRadioGroup
                  id={`i${index}-is-commercial-product`}
                  name={`ingredients.${index}.commercialProduct.isCommercialProduct`}
                  control={control}
                  className="is-commercial-product"
                />
              </div>
              </div>
          {isCommercialProduct && (
            <div className="row">
              <div className="form-group">
                <label
                  htmlFor={`i${index}-commercial-product`}
                  className={!isCommercialProduct ? "disabled" : ""}
                >
                  Product name:
                </label>
                <input
                  {...register(
                    `ingredients.${index}.commercialProduct.name` as const,
                    {
                      required: isCommercialProduct,
                      disabled: !isCommercialProduct,
                      setValueAs: (value) => {
                        return value === "" || !value ? null : value
                      },
                    },
                  )}
                  type="text"
                  readOnly={!isCommercialProduct}
                  size={25}
                  id={`i${index}-commercial-product`}
                />
              </div>
              <div className="form-group">
                <label className={`${!isCommercialProduct ? "disabled" : ""}`}>
                  <span>Product DIN:</span>
                  <div className="row">
                    <input
                      {...register(
                        `ingredients.${index}.commercialProduct.din` as const,
                        {
                          required:
                            !!isCommercialProduct &&
                            !ingredient?.commercialProduct?.hasNoDin,
                          disabled:
                            !isCommercialProduct ||
                            !!ingredient?.commercialProduct?.hasNoDin,
                        },
                      )}
                      inputMode="numeric"
                      type="text"
                      readOnly={!isCommercialProduct}
                      size={7}
                    />
                    <label>
                      <input
                        type="checkbox"
                        {...register(
                          `ingredients.${index}.commercialProduct.hasNoDin`,
                              {
                                disabled: !isCommercialProduct,
                                deps: [
                                  `ingredients.${index}.commercialProduct.din`,
                                ],
                              },
                        )}
                      />
                      <span>No DIN</span>
                    </label>
                  </div>
                </label>
              </div>
            </div>
          )}

          {isCommercialProduct && (
            <div className="row">
              <div className="form-group">
                <label
                  htmlFor={`i${index}-has-product-monograph-concerns`}
                  className={!isCommercialProduct ? "disabled" : ""}
                >
                  Does the product monograph have any concerns?
                </label>
                <RHFBooleanRadioGroup
                  id={`i${index}-has-product-monograph-concerns`}
                  name={`ingredients.${index}.commercialProduct.hasProductMonographConcerns`}
                  control={control}
                  disabled={!isCommercialProduct}
                  className="has-product-monograph-concerns"
                  rules={{
                    required: isCommercialProduct,
                  }}
                />
          </div>
            </div>
          )}
          {hasProductMonographConcerns && (
            <div className="row">
            <div
              className={`form-group ${
                !hasProductMonographConcerns ? "hidden" : ""
              }`}
              style={{ width: "100%" }}
            >
              <label
                htmlFor={`i${index}-commercial-product-concerns-desc`}
                className={!hasProductMonographConcerns ? "disabled" : ""}
              >
                Please describe health concerns on the product monograph:
              </label>
              <textarea
                {...register(
                  `ingredients.${index}.commercialProduct.concernsDescription`,
                  {
                    required: !!hasProductMonographConcerns,
                    disabled: !hasProductMonographConcerns,
                    setValueAs: (value) => {
                      return value === "" ? undefined : value
                    },
                    /* deps: [
                      `ingredients.${index}.isCommercialProduct`,
                      `ingredients.${index}.commercialProduct.hasProductMonographConcerns`,
                    ], */
                  },
                )}
                id={`i${index}-commercial-product-concerns-desc`}
                cols={30}
                readOnly={!hasProductMonographConcerns}
              />
            </div>
          </div>
          )}
        </div>
        <div className="safety-info">
          <fieldset>
            <legend>Safety Information:</legend>
            <div>
              <span className="label">Niosh Table:</span>
              {chemicalData?.nioshTable === undefined
                ? "N/A"
                : chemicalData?.nioshTable === -1
                ? "No"
                : `Table ${chemicalData?.nioshTable}`}
            </div>
            <div>
              <span className="label">SDS HMIS health hazard level:</span>
              <span>{selectedSds?.hmisHealthHazard ?? "N/A"}</span>
            </div>
            {ingredient && ingredient.sdsId && selectedSds && (
              <div>
                <span className="label">SDS health hazards:</span>
                <ul className="health-hazard-list">
                  {selectedSds.healthHazards.map((h, i) => (
                    <li key={i}>{`${
                      h.hazardCategory.hazardClass.name
                    } - Category ${h.hazardCategory.level}${
                      !h.additionalInfo ? "" : ` (${h.additionalInfo})`
                    }`}</li>
                  ))}
                </ul>
              </div>
            )}
          </fieldset>
        </div>
      </div>
      <div className="ingredient-actions">
        <button
          type="button"
          className="remove-button"
          value="remove"
          onClick={() => remove(index)}
        >
          Remove
        </button>
        <button
          type="button"
          className="clear-button"
          value="clear"
          onClick={() => reset()}
        >
          Clear
        </button>
        <button
          type="button"
          className="move-up-button"
          disabled={index === 0}
          onClick={() => index > 0 && move(index, index - 1)}
        >
          Move up
        </button>
        <button
          type="button"
          className="move-down-button"
          disabled={index + 1 === fields.length}
          onClick={() => index < fields.length && move(index, index + 1)}
        >
          Move down
        </button>
      </div>
      <style jsx>{`
        .inputs-container {
          margin-bottom: 0.8rem;
        }

        @media (min-width: 992px) {
          .ingredient-body {
            display: flex;
            column-gap: 0.5rem;
            align-items: stretch;
          }

          .inputs-container {
            flex: 1;
            margin-bottom: unset;
          }

          .safety-info {
            min-width: 30%;
            margin-left: auto;
            align-self: stretch;
          }

          .safety-info > fieldset {
            height: 100%;
          }
        }

        .ingredient-actions {
          margin-top: 0.8rem;
          display: flex;
          column-gap: 0.7rem;
        }

        .label {
          margin-right: 0.5rem;
        }
        .health-hazard-list {
          margin-top: 0;
          margin-bottom: 0;
          font-size: 1.3rem;
          padding-left: 2rem;
        }

        .hmis-health-hazard {
          width: min-content;
        }
      `}</style>
    </fieldset>
  )
}

export default IngredientFieldset
