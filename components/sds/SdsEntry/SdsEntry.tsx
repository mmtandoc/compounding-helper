import { RHFBooleanRadioGroup } from "components/BooleanRadioGroup"
import ChemicalSearch from "components/chemical/ChemicalSearch"
import Input from "components/common/forms/Input"
import Select from "components/common/forms/Select"
import {
  NullPartialHazardFields,
  NullPartialSdsFields,
  sdsSchema,
} from "lib/fields"
import { useEffect } from "react"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import form from "styles/form"
import useSWR from "swr"
import { JsonError } from "types/common"
import { ProductWithVendor } from "types/models"
import HazardInputRow from "./HazardInputRow"

type Props = {
  formMethods: UseFormReturn<NullPartialSdsFields>
}

const emptyHazardValues: NullPartialHazardFields | null = {
  categoryId: null,
  classId: null,
  additionalInfo: null,
  subcategoryId: null,
}

const SdsEntry = (props: Props) => {
  const { formMethods } = props

  const { register, control, watch, setValue } = formMethods

  const [chemicalId, productId] = watch(["chemicalId", "productId"])

  const hazardsArrayMethods = useFieldArray({
    control: control,
    name: "hazards",
  })

  const hazardFields = hazardsArrayMethods.fields

  const { data: products, error: productsError } = useSWR<
    ProductWithVendor[],
    JsonError
  >(chemicalId ? `/api/products?chemicalId=${chemicalId}` : null)

  //TODO: Handle error
  if (productsError) {
    console.error(productsError)
  }

  register("id")
  return (
    <>
      <div className="form-group">
        <label>
          <span>Chemical:</span>
          <ChemicalSearch
            id="chemical-search"
            name={`chemicalId`}
            onItemChange={(chemical) => {
              if (chemical?.id !== chemicalId) {
                register(`productId`)
                setValue(`productId`, null)
              }
            }}
            size={30}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          <span>Product:</span>
          <Select
            name="productId"
            rules={{ valueAsNumber: true }}
            disabled={!chemicalId}
            initialOption={{ label: "--- Select product ---", value: "none" }}
          >
            {products?.map((p) => (
              <option key={p.id} value={p.id as number}>
                {p.name} ({p.vendor.name})
              </option>
            ))}
          </Select>
        </label>
      </div>
      <div className="form-group">
        <label>
          <span>Revision date:</span>
          <Input type="date" {...register("revisionDate")} id="revision-date" />
        </label>
      </div>
      <div className="form-group">
        <label>
          <span>HMIS health hazard level:</span>
          <Input
            type="number"
            {...register("hmisHazardLevel")}
            min={0}
            max={4}
            size={3}
          />
        </label>
      </div>
      <div className="form-group" style={{ width: "100%" }}>
        <span className="label">Health hazards:</span>
        <div>
          <ul className="hazard-list">
            {hazardFields.map((field, index) => (
              <HazardInputRow
                field={field}
                index={index}
                formMethods={formMethods}
                arrayMethods={hazardsArrayMethods}
                key={index}
              />
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              hazardsArrayMethods.append(
                emptyHazardValues as NullPartialHazardFields,
              )
            }}
          >
            Add hazard
          </button>
        </div>
      </div>
      <div className="form-group">
        <label>
          <span>Is ventilation required as per SDS?</span>
          <RHFBooleanRadioGroup name="requireVentilation" />
        </label>
      </div>
      <style jsx global>
        {form}
      </style>
      <style jsx>{`
        .hazard-list {
          margin: 0;
          padding: 0;
        }

        .hazard-list > li {
          font-weight: 600;
          display: flex;
          column-gap: 0.5rem;
        }
      `}</style>
    </>
  )
}

export default SdsEntry
