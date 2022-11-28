import { Vendor } from "@prisma/client"
import { useEffect } from "react"
import {
  FieldArrayPath,
  FieldArrayWithId,
  FieldError,
  FieldValues,
  UseFieldArrayReturn,
} from "react-hook-form"
import useSWR from "swr"

import { RhfBooleanRadioGroup } from "components/BooleanRadioGroup"
import ChemicalSearch from "components/chemical/ChemicalSearch"
import Button from "components/common/Button"
import Fieldset from "components/common/forms/Fieldset"
import { FormGroup } from "components/common/forms/FormGroup"
import Input from "components/common/forms/Input"
import RhfSelect from "components/common/forms/RhfSelect"
import TextArea from "components/common/forms/TextArea"
import { NullPartialIngredientFields } from "lib/fields"
import useUpdateFieldConditionally from "lib/hooks/useUpdateFieldConditionally"
import { NestedForm } from "lib/rhf/nestedForm"
import { JsonError } from "types/common"
import { ChemicalAll, SdsWithRelations } from "types/models"

import SdsSelect from "./SdsSelect"

interface IngredientEntryProps<TFieldValues extends FieldValues> {
  id?: string
  error?: FieldError
  name: FieldArrayPath<TFieldValues>
  field: FieldArrayWithId<TFieldValues>
  index: number
  formMethods: NestedForm<NullPartialIngredientFields>
  arrayMethods: UseFieldArrayReturn<TFieldValues>
  showPastSdsRevisions?: boolean
  reset: () => void
}

const IngredientEntry = <TFieldValues extends FieldValues>({
  name,
  field,
  index,
  reset,
  formMethods,
  arrayMethods,
  showPastSdsRevisions = false,
}: IngredientEntryProps<TFieldValues>) => {
  const { register, setValue, watch, trigger, getFieldState } = formMethods

  const { fields, move, remove } = arrayMethods

  //const ingredient = watch(`${name}.${index}`)
  const [chemicalId, sdsId] = watch([
    formMethods.path("chemicalId"),
    formMethods.path("sdsId"),
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

  const isCommercialProduct = watch(formMethods.path("isCommercialProduct"))

  const hasNoDin = watch(formMethods.path("commercialProduct.hasNoDin"))

  const hasProductMonographConcerns = watch(
    formMethods.path("commercialProduct.hasProductMonographConcerns"),
  )

  const order = watch(formMethods.path("order"))

  useEffect(() => {
    if (order !== index + 1) {
      register(formMethods.path("order"))
      setValue(formMethods.path("order"), index + 1)
    }
  }, [index, register, setValue, order, formMethods])

  useUpdateFieldConditionally({
    updateCondition: isCommercialProduct !== true,
    fields: [
      [formMethods.path("commercialProduct.name"), null],
      [formMethods.path("commercialProduct.din"), null],
      [formMethods.path("commercialProduct.hasProductMonographConcerns"), null],
    ],
    register,
    setValue,
  })

  useUpdateFieldConditionally({
    updateCondition: hasNoDin === true,
    fields: [[formMethods.path("commercialProduct.din"), null]],
    register,
    setValue,
  })

  //TODO: Handle loading better

  const isLoading =
    !!chemicalId && (!chemicalData || !sdsesData || !vendorsData)

  useEffect(() => {
    if (!isLoading && !sdsId && !!sdsesData && sdsesData.length > 0) {
      register(formMethods.path("sdsId"))
      setValue(formMethods.path("sdsId"), sdsesData[0].id)
    }
  }, [index, sdsId, isLoading, register, sdsesData, setValue, formMethods])

  useUpdateFieldConditionally({
    updateCondition: hasNoDin === true,
    fields: [[formMethods.path("commercialProduct.din"), null]],
    register,
    setValue,
  })

  // Fix issue where DIN field remains invalid until onBlur event of hasNoDin checkbox
  useEffect(() => {
    if (
      hasNoDin &&
      getFieldState(formMethods.path("commercialProduct.din")).error
    ) {
      trigger(formMethods.path("commercialProduct.din"))
    }
  }, [getFieldState, hasNoDin, index, formMethods.path, trigger, formMethods])

  if (isLoading) {
    return <div>Loading...</div>
  }

  const selectedSds = sdsesData?.find((sds) => sds.id === sdsId)

  return (
    <Fieldset className="ingredient-fieldset">
      <div className="ingredient-body">
        <div className="inputs-container">
          <div className="row">
            <FormGroup>
              <label htmlFor={`i${index}-chemical-search`}>
                Chemical name:{" "}
              </label>
              <div className="row">
                <ChemicalSearch
                  id={`i${index}-chemical-search`}
                  name={`${name}.${index}.chemicalId`}
                  onItemChange={() => {
                    console.log("onItemChange")
                    register(formMethods.path("sdsId"))
                    setValue(formMethods.path("sdsId"), null)
                  }}
                  size={30}
                  defaultValue={null}
                />

                <Button size="small" disabled={!chemicalId}>
                  ...
                </Button>
              </div>
            </FormGroup>
            <FormGroup>
              <label htmlFor={`i${index}-physical-form`}>Physical form: </label>
              <RhfSelect
                name={`${name}.${index}.physicalForm`}
                id={`i${index}-physical-form`}
                className="physical-form"
                initialOption={{ value: "none", label: "-- Select a form --" }}
              >
                <option value="cream">Cream</option>
                <option value="ointment">Ointment</option>
                <option value="lotion">Lotion</option>
                <option value="powder">Powder</option>
                <option value="liquid">Liquid</option>
                <option value="solid">Solid</option>
              </RhfSelect>
            </FormGroup>
          </div>
          <div className="row">
            <FormGroup>
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
                <Button size="small" disabled={!sdsId}>
                  ...
                </Button>
              </div>
            </FormGroup>
          </div>
          <div className="row">
            <FormGroup>
              <label htmlFor={`i${index}-is-commercial-product`}>
                Is a commercial product?
              </label>
              <RhfBooleanRadioGroup
                id={`i${index}-is-commercial-product`}
                name={`${name}.${index}.isCommercialProduct`}
                className="is-commercial-product"
                rules={{
                  deps: [`${name}.${index}.chemicalId`],
                }}
              />
            </FormGroup>
          </div>
          <div className="row" hidden={!isCommercialProduct}>
            <FormGroup>
              <label
                htmlFor={`i${index}-commercial-product`}
                className={!isCommercialProduct ? "disabled" : ""}
              >
                Product name:
              </label>
              <Input
                {...register(formMethods.path("commercialProduct.name"), {
                  disabled: !isCommercialProduct,
                  setValueAs: (value) => {
                    return value === "" || !value ? null : value
                  },
                })}
                type="text"
                readOnly={!isCommercialProduct}
                size={25}
                id={`i${index}-commercial-product`}
              />
            </FormGroup>
            <FormGroup>
              <label className={`${!isCommercialProduct ? "disabled" : ""}`}>
                <span>Product DIN:</span>
                <div className="row">
                  <Input
                    {...register(formMethods.path("commercialProduct.din"), {
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
                        formMethods.path("commercialProduct.hasNoDin"),
                        {
                          disabled: !isCommercialProduct,
                          deps: `${name}.${index}.commercialProduct.din`,
                        },
                      )}
                    />
                    <span>No DIN</span>
                  </label>
                </div>
              </label>
            </FormGroup>
          </div>

          <div className="row" hidden={!isCommercialProduct}>
            <FormGroup>
              <label
                htmlFor={`i${index}-has-product-monograph-concerns`}
                className={!isCommercialProduct ? "disabled" : ""}
              >
                Does the product monograph have any concerns?
              </label>
              <RhfBooleanRadioGroup
                id={`i${index}-has-product-monograph-concerns`}
                name={`${name}.${index}.commercialProduct.hasProductMonographConcerns`}
                disabled={!isCommercialProduct}
                className="has-product-monograph-concerns"
              />
            </FormGroup>
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
                  formMethods.path("commercialProduct.concernsDescription"),
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
          <Fieldset legend="Safety Information:">
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
          </Fieldset>
        </div>
      </div>
      <div className="ingredient-actions">
        <Button
          size="small"
          className="remove-button"
          value="remove"
          onClick={() => remove(index)}
        >
          Remove
        </Button>
        <Button
          size="small"
          className="clear-button"
          value="clear"
          onClick={() => reset()}
        >
          Clear
        </Button>
        <Button
          size="small"
          className="move-up-button"
          disabled={index === 0}
          onClick={() => index > 0 && move(index, index - 1)}
        >
          Move up
        </Button>
        <Button
          size="small"
          className="move-down-button"
          disabled={index + 1 === fields.length}
          onClick={() => index < fields.length && move(index, index + 1)}
        >
          Move down
        </Button>
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
    </Fieldset>
  )
}

export default IngredientEntry
