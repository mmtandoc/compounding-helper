import { UseFormReturn, useFieldArray } from "react-hook-form"
import useSWR from "swr"

import ChemicalSearch from "components/chemical/ChemicalSearch"
import { Button } from "components/ui"
import {
  FormGroup,
  Input,
  RhfBooleanRadioGroup,
  RhfSelect,
} from "components/ui/forms"
import { NullPartialHazardFields, NullPartialSdsFields } from "lib/fields"
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
      <FormGroup>
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
      </FormGroup>
      <FormGroup>
        <label>
          <span>Product:</span>
          <RhfSelect
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
          </RhfSelect>
        </label>
      </FormGroup>
      <FormGroup>
        <label>
          <span>Revision date:</span>
          <Input type="date" {...register("revisionDate")} id="revision-date" />
        </label>
      </FormGroup>
      <FormGroup>
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
      </FormGroup>
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
          <Button
            size="small"
            onClick={() => {
              hazardsArrayMethods.append(
                emptyHazardValues as NullPartialHazardFields,
              )
            }}
          >
            Add hazard
          </Button>
        </div>
      </div>
      <FormGroup>
        <label>
          <span>Is ventilation required as per SDS?</span>
          <RhfBooleanRadioGroup name="requireVentilation" />
        </label>
      </FormGroup>
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
