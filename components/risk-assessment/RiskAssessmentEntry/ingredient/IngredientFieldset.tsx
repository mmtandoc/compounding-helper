import ChemicalSearch from "../../../chemical/ChemicalSearch"
import React, { useEffect } from "react"
import {
  FieldArrayWithId,
  FieldError,
  UseFieldArrayReturn,
  UseFormReturn,
} from "react-hook-form"
import useSWR from "swr"
import { JsonError } from "types/common"
import { ChemicalAll, SdsWithRelations } from "types/models"
import { RHFBooleanRadioGroup } from "components/BooleanRadioGroup"
import { NullPartialRiskAssessmentFields } from "lib/fields"
import { Vendor } from "@prisma/client"
import useUpdateFieldConditionally from "lib/hooks/useUpdateFieldConditionally"
import SdsSelect from "./SdsSelect"
import Input from "components/common/forms/Input"
import Select from "components/common/forms/Select"
import TextArea from "components/common/forms/TextArea"

interface IngredientFieldsetProps {
  id?: string
  error?: FieldError
  field: FieldArrayWithId<NullPartialRiskAssessmentFields>
  index: number
  formMethods: UseFormReturn<NullPartialRiskAssessmentFields>
  arrayMethods: UseFieldArrayReturn<NullPartialRiskAssessmentFields>
  showPastSdsRevisions?: boolean
  reset: () => void
}

const IngredientFieldset = ({
  index,
  reset,
  formMethods,
  arrayMethods,
  showPastSdsRevisions = false,
}: IngredientFieldsetProps) => {
  const { register, setValue, watch, trigger, getFieldState } = formMethods

  const { fields, move, remove } = arrayMethods

  //const ingredient = watch(`ingredients.${index}`)
  const [chemicalId, sdsId] = watch([
    `ingredients.${index}.chemicalId`,
    `ingredients.${index}.sdsId`,
  ])

  const { data: chemicalData, error: chemicalError } = useSWR<
    ChemicalAll,
    JsonError
  >(!chemicalId ? null : `/api/chemicals/${chemicalId}`)

  const { data: vendorsData, error: vendorsError } = useSWR<
    Vendor[],
    JsonError
  >(`/api/vendors`)

  //TODO: Use mutate to fill "/sds/[id]" keys based on data retrieved
  const { data: sdsesData, error: sdsesError } = useSWR<
    SdsWithRelations[],
    JsonError
  >(
    !chemicalId
      ? null
      : `/api/sds?chemicalId=${chemicalId}${
          !showPastSdsRevisions ? "&latestOnly" : ""
        }`,
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

  const isCommercialProduct = watch(`ingredients.${index}.isCommercialProduct`)

  const hasNoDin = watch(`ingredients.${index}.commercialProduct.hasNoDin`)

  const hasProductMonographConcerns = watch(
    `ingredients.${index}.commercialProduct.hasProductMonographConcerns`,
  )

  const order = watch(`ingredients.${index}.order`)

  useEffect(() => {
    if (order !== index + 1) {
      register(`ingredients.${index}.order`)
      setValue(`ingredients.${index}.order`, index + 1)
    }
  }, [index, register, setValue, order])

  useUpdateFieldConditionally({
    updateCondition: isCommercialProduct !== true,
    fields: [
      [`ingredients.${index}.commercialProduct.name`, null],
      [`ingredients.${index}.commercialProduct.din`, null],
      [
        `ingredients.${index}.commercialProduct.hasProductMonographConcerns`,
        null,
      ],
    ],
    register,
    setValue,
  })

  useUpdateFieldConditionally({
    updateCondition: hasNoDin === true,
    fields: [[`ingredients.${index}.commercialProduct.din`, null]],
    register,
    setValue,
  })

  //TODO: Handle loading better

  const isLoading =
    !!chemicalId && (!chemicalData || !sdsesData || !vendorsData)

  useEffect(() => {
    if (!isLoading && !sdsId && !!sdsesData && sdsesData.length > 0) {
      register(`ingredients.${index}.sdsId`)
      setValue(`ingredients.${index}.sdsId`, sdsesData[0].id)
    }
  }, [index, sdsId, isLoading, register, sdsesData, setValue])

  useUpdateFieldConditionally({
    updateCondition: hasNoDin === true,
    fields: [[`ingredients.${index}.commercialProduct.din`, null]],
    register,
    setValue,
  })

  // Fix issue where DIN field remains invalid until onBlur event of hasNoDin checkbox
  useEffect(() => {
    if (
      hasNoDin &&
      getFieldState(`ingredients.${index}.commercialProduct.din`).error
    ) {
      trigger(`ingredients.${index}.commercialProduct.din`)
    }
  }, [getFieldState, hasNoDin, index, trigger])

  if (isLoading) {
    return <div>Loading...</div>
  }

  const selectedSds = sdsesData?.find((sds) => sds.id === sdsId)

  return (
    <fieldset className="ingredient-fieldset">
      <div className="ingredient-body">
        <div className="inputs-container">
          <div className="row">
            <div className="form-group">
              <label htmlFor={`i${index}-chemical-search`}>
                Chemical name:{" "}
              </label>
              <div className="row">
                <ChemicalSearch
                  id={`i${index}-chemical-search`}
                  name={`ingredients.${index}.chemicalId`}
                  onItemChange={() => {
                    console.log("onItemChange")
                    register(`ingredients.${index}.sdsId`)
                    setValue(`ingredients.${index}.sdsId`, null)
                  }}
                  size={30}
                  defaultValue={null}
                />

                <button type="button" disabled={!chemicalId}>
                  ...
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor={`i${index}-physical-form`}>Physical form: </label>
              <Select
                name={`ingredients.${index}.physicalForm`}
                id={`i${index}-physical-form`}
                className="physical-form"
                initialOption={{ value: "none", label: "-- Select a form --" }}
              >
                <option value="cream">Cream</option>
                <option value="ointment">Ointment</option>
                <option value="powder">Powder</option>
                <option value="liquid">Liquid</option>
                <option value="solid">Solid</option>
              </Select>
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
                  showAllRevisions={showPastSdsRevisions}
                  ingredientIndex={index}
                  disabled={!chemicalId}
                  required={
                    isCommercialProduct === null || !isCommercialProduct
                  }
                />
                <button type="button" disabled={!sdsId}>
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
                name={`ingredients.${index}.isCommercialProduct`}
                className="is-commercial-product"
                rules={{
                  deps: [`ingredients.${index}.chemicalId`],
                }}
              />
            </div>
          </div>
          <div className="row" hidden={!isCommercialProduct}>
            <div className="form-group">
              <label
                htmlFor={`i${index}-commercial-product`}
                className={!isCommercialProduct ? "disabled" : ""}
              >
                Product name:
              </label>
              <Input
                {...register(
                  `ingredients.${index}.commercialProduct.name` as const,
                  {
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
                  <Input
                    {...register(`ingredients.${index}.commercialProduct.din`, {
                      disabled: !isCommercialProduct || !!hasNoDin,
                    })}
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
                          deps: `ingredients.${index}.commercialProduct.din`,
                        },
                      )}
                    />
                    <span>No DIN</span>
                  </label>
                </div>
              </label>
            </div>
          </div>

          <div className="row" hidden={!isCommercialProduct}>
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
                disabled={!isCommercialProduct}
                className="has-product-monograph-concerns"
              />
            </div>
          </div>
          <div className="row" hidden={!hasProductMonographConcerns}>
            <div className="form-group" style={{ width: "100%" }}>
              <label
                htmlFor={`i${index}-commercial-product-concerns-desc`}
                className={!hasProductMonographConcerns ? "disabled" : ""}
              >
                Please describe health concerns on the product monograph:
              </label>
              <TextArea
                {...register(
                  `ingredients.${index}.commercialProduct.concernsDescription`,
                  {
                    disabled: !hasProductMonographConcerns,
                    setValueAs: (value) => {
                      return value === "" ? undefined : value
                    },
                  },
                )}
                id={`i${index}-commercial-product-concerns-desc`}
                cols={30}
                readOnly={!hasProductMonographConcerns}
              />
            </div>
          </div>
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
            {sdsId && selectedSds && (
              <div>
                <span className="label">SDS health hazards:</span>
                <ul className="health-hazard-list">
                  {selectedSds.healthHazards.map((h, i) => (
                    <li key={i}>
                      {h.hazardCategory.hazardClass.name} - Category{" "}
                      {h.hazardCategory.level}
                      {h.hazardCategory.shortDescription
                        ? ` - ${h.hazardCategory.shortDescription}`
                        : ""}
                      {!h.additionalInfo ? "" : ` (${h.additionalInfo})`}
                    </li>
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
