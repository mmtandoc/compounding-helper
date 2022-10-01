import { RHFBooleanRadioGroup } from "components/BooleanRadioGroup"
import ChemicalSearch from "components/chemical/ChemicalSearch"
import { useEffect } from "react"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import form from "styles/form"
import useSWR from "swr"
import { JsonError } from "types/common"
import { SdsFields } from "types/fields"
import { ProductWithVendor } from "types/models"
import { NullPartialDeep } from "types/util"
import HazardInputRow from "./HazardInputRow"
export type NullPartialSdsFields = NullPartialDeep<SdsFields>

type Props = {
  values?: NullPartialSdsFields
  formMethods: UseFormReturn<NullPartialSdsFields>
}

const emptyHazardValues = {
  id: null,
  categoryId: null,
  classId: null,
  additionalInfo: null,
  subcategoryId: null,
}

const SdsEntry = (props: Props) => {
  const { values, formMethods } = props

  const { register, reset, control, watch, setValue, getValues } = formMethods

  const [chemicalId, productId] = watch(["chemicalId", "productId"])

  console.log({ productId })

  const hazards = watch("hazards")

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

  useEffect(() => {
    reset(values)
  }, [reset, values])

  return (
    <>
      <input type="hidden" {...register("id", { valueAsNumber: true })} />
      <div className="form-group">
        <label>
          <span>Chemical:</span>
          <ChemicalSearch
            id="chemical-search"
            name={`chemicalId`}
            control={control}
            rules={{ required: true }}
            onItemChange={(chemical) => {
              if (chemical?.id !== chemicalId) {
                register(`productId`)
                setValue(`productId`, -1)
              }
            }}
            size={30}
            defaultValue={null}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          <span>Product:</span>
          <select
            {...register(`productId`, {
              required: true,
              disabled: !chemicalId,
              setValueAs: (val) => (val === -1 || !val ? null : val),
              valueAsNumber: true,
            })}
          >
            <option value={-1} disabled>
              --- Select product ---
            </option>
            {products?.map((p) => (
              <option key={p.id} value={p.id as number}>
                {p.name} ({p.vendor.name})
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="form-group">
        <label>
          <span>Revision date:</span>
          <input
            type="date"
            {...register("revisionDate", { required: true })}
            id="revision-date"
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          <span>HMIS health hazard level:</span>
          <input
            type="number"
            {...register("hmisHazardLevel", {
              required: true,
              min: 0,
              max: 5,
              valueAsNumber: true,
            })}
            min={0}
            max={5}
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
              hazardsArrayMethods.append(emptyHazardValues)
            }}
          >
            Add hazard
          </button>
        </div>
      </div>
      <div className="form-group">
        <label>
          <span>Is ventilation required as per SDS?</span>
          <RHFBooleanRadioGroup
            name="requireVentilation"
            rules={{ required: true }}
            control={control}
          />
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
