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
import { useClearDisabledField } from "components/risk-assessment/RiskAssessmentEntry/helpers"

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

  useEffect(() => {
    if (
      ingredient &&
      ingredient.sdsId !== null &&
      !!sdsesData &&
      !sdsesData.map((sds) => sds.id).includes(ingredient.sdsId)
    ) {
      register(`ingredients.${index}.sdsId`)
      setValue(`ingredients.${index}.sdsId`, sdsesData?.[0]?.id)
    }
  }, [index, ingredient, register, sdsesData, setValue])

  const isCommercialProduct = watch(
    `ingredients.${index}.commercialProduct.isCommercialProduct`,
  )

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

  //TODO: Handle loading better

  const isLoading =
    !!ingredient?.chemicalId && (!chemicalData || !sdsesData || !vendorsData)

  useEffect(() => {
    if (
      !isLoading &&
      !!ingredient?.sdsId &&
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
      <div className="row">
        <div>
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
                />

                <button type="button" disabled={!ingredient?.chemicalId}>
                  ...
                </button>
              </div>
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
            <div>
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
              <div
                className={`form-group ${!isCommercialProduct ? "hidden" : ""}`}
              >
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
                    required: !!isCommercialProduct,
                  }}
                />
              </div>
            </div>
            <div className={`col ${!isCommercialProduct ? "hidden" : ""}`}>
              <div className="form-group">
                <label
                  htmlFor={`i${index}-commercial-product`}
                  className={!isCommercialProduct ? "disabled" : ""}
                >
                  Commerical product name:
                </label>
                <input
                  {...register(
                    `ingredients.${index}.commercialProduct.name` as const,
                    {
                      required: !!isCommercialProduct,
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
              <div className="form-group row">
                <label
                  className={`col ${!isCommercialProduct ? "disabled" : ""}`}
                >
                  <span>Commerical product DIN:</span>
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
                          { disabled: !isCommercialProduct },
                        )}
                      />
                      <span>No DIN</span>
                    </label>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div
            className={`row ${!hasProductMonographConcerns ? "hidden" : ""}`}
          >
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
                      `ingredients.${index}.isCommericalProduct`,
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
        </div>
        <div style={{ minWidth: "30%", marginLeft: "auto" }}>
          <fieldset className="safety-info">
            <legend>Safety Information:</legend>
            <div>
              <span className="label" style={{ marginRight: "0.5rem" }}>
                Niosh Table:{" "}
              </span>
              {chemicalData?.nioshTable === undefined
                ? "N/A"
                : chemicalData?.nioshTable === -1
                ? "No"
                : `Table ${chemicalData?.nioshTable}`}
            </div>
            <div>
              <span className="label" style={{ marginRight: "0.5rem" }}>
                SDS HMIS health hazard level:{" "}
              </span>
              <span>{selectedSds?.hmisHealthHazard ?? "N/A"}</span>
            </div>
            {ingredient && ingredient.sdsId && selectedSds && (
              <div>
                <span className="label">SDS health hazards:</span>
                <ul
                  id={`i${index}-health-hazard-list`}
                  className="health-hazard-list"
                >
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
      <div>
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
        .health-hazard-list {
          margin-top: 0;
          margin-bottom: 0;
          font-size: 1.3rem;
          padding-left: 2rem;
        }

        .hmis-health-hazard {
          width: min-content;
        }

        .safety-info {
          height: 100%;
        }
      `}</style>
    </fieldset>
  )
}

type SdsSelectProps = {
  chemical?: ChemicalAll
  sdses?: SdsWithRelations[]
  vendors?: Vendor[]
  showPastRevisions: boolean
  register: UseFormRegister<NullPartialRiskAssessmentFields>
  ingredientIndex: number
  disabled?: boolean
  required?: boolean
}

const SdsSelect = ({
  chemical,
  sdses,
  vendors,
  showPastRevisions,
  register,
  ingredientIndex,
  disabled = true,
  required = true,
}: SdsSelectProps) => {
  const sdsProductMap = new Map<number, SdsWithRelations[]>()
  if (sdses !== undefined) {
    for (const sds of sdses) {
      sdsProductMap.set(
        sds.productId,
        [...(sdsProductMap.get(sds.productId) ?? []), sds].sort(
          (a, b) => b.revisionDate.getTime() - a.revisionDate.getTime(),
        ),
      )
    }
  }

  return (
    <select
      {...register(`ingredients.${ingredientIndex}.sdsId`, {
        setValueAs: (val) => (val !== null ? parseInt(val) : null),
        required: required,
        //deps: `ingredients.${ingredientIndex}.chemicalId`,
        disabled: disabled,
      })}
      id={`i${ingredientIndex}-sds-select`}
      className="sds-select"
    >
      {chemical !== undefined &&
        sdses !== undefined &&
        Array.from(sdsProductMap.entries()).map(([pid, sdsArray]) => {
          const product = chemical?.products.find((p) => p.id === pid)

          if (!product || sdsArray.length === 0) {
            return
          }

          const productLabel = `${product.name} (${
            vendors?.find((v) => v.id === product.vendorId)?.name ?? "ERROR"
          })`

          if (showPastRevisions) {
            return (
              <optgroup label={productLabel} key={pid}>
                {sdsArray.map((sds) => (
                  <option key={sds.id} value={sds.id}>
                    {`${productLabel} - ${sds.revisionDate
                      .toISOString()
                      .slice(0, 10)}`}
                  </option>
                ))}
              </optgroup>
            )
          }
          const sds = sdsArray[0]
          return (
            <option key={sds.id} value={sds.id}>
              {`${productLabel} - ${sds.revisionDate
                .toISOString()
                .slice(0, 10)}`}
            </option>
          )
        })}
      <style jsx>{`
        select.sds-select {
          min-width: 30rem;
        }
      `}</style>
    </select>
  )
}

export default IngredientFieldset
