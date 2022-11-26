import React, { useId } from "react"
import { Controller, UseFormReturn } from "react-hook-form"
import useSWR from "swr"

import DotJotList from "components/common/forms/DotJotList"
import Fieldset from "components/common/forms/Fieldset"
import { FormGroup } from "components/common/forms/FormGroup"
import Input from "components/common/forms/Input"
import RhfSelect from "components/common/forms/RhfSelect"
import TextArea from "components/common/forms/TextArea"
import { NullPartialMfrFields } from "lib/fields"
import { CompoundWithIngredients } from "types/models"

interface MfrEntryProps {
  formMethods: UseFormReturn<NullPartialMfrFields>
}

const MfrEntry = (props: MfrEntryProps) => {
  const { formMethods } = props
  const { register, watch, control } = formMethods
  const id = useId()

  const compoundId = watch("compoundId")

  const { data: compound, error: compoundError } =
    useSWR<CompoundWithIngredients>(`/api/compounds/${compoundId}`)

  if (compoundError) {
    //TODO: Improve error handling
    console.error(compoundError)
  }

  register("compoundId")
  return (
    <>
      <FormGroup row>
        <label htmlFor={`${id}-compound`}>Compound:</label>
        <span>{compound?.name ?? "Loading..."}</span>
      </FormGroup>
      <Fieldset legend="Formula:">
        <ul className="ingredient-list">
          {compound?.ingredients.map((ing) => (
            <li key={ing.order}>
              {ing.commercialProductName ? (
                <span>
                  <span>{ing.commercialProductName}</span>
                  <span> (DIN: {ing.commercialProductDin ?? "N/A"})</span>
                </span>
              ) : (
                <span>
                  <span>
                    {ing?.safetyDataSheet?.product.name} (
                    {ing?.safetyDataSheet?.product.vendor.name})
                  </span>
                  <span>
                    {" "}
                    (CAS #:{" "}
                    {ing?.safetyDataSheet?.product.chemical.casNumber ?? "N/A"})
                  </span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </Fieldset>
      {/*TODO: PPE*/}
      <FormGroup>
        <label htmlFor={`${id}-training`}>Training:</label>
        <TextArea id={`${id}-training`} {...register("training")} />
      </FormGroup>
      <Fieldset legend="Required equipment:">
        <Controller
          control={control}
          name="requiredEquipment"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <DotJotList
              items={value?.map((v) => ({ text: v })) ?? []}
              onChange={(items) => onChange(items.map((item) => item.text))}
              ref={ref}
              onBlur={onBlur}
              size={40}
            />
          )}
        ></Controller>
      </Fieldset>
      <FormGroup>
        <label htmlFor={`${id}-calculations`}>Calculations:</label>
        <TextArea
          id={`${id}-calculations`}
          {...register("calculations")}
          rows={4}
        />
      </FormGroup>
      <FormGroup>
        <label htmlFor={`${id}-compounding-method`}>Compounding method:</label>
        <TextArea
          id={`${id}-compounding-method`}
          {...register("compoundingMethod")}
          rows={6}
        />
      </FormGroup>
      <Fieldset legend="Stability and storage:">
        <div className="row">
          <FormGroup>
            <label htmlFor={`${id}-beyond-use-date`}>Beyond use date:</label>
            <Input
              type="text"
              id={`${id}-beyond-use-date`}
              {...register("beyondUseDate")}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor={`${id}-storage`}>Storage:</label>
            <RhfSelect
              id={`${id}-storage`}
              {...register("storage")}
              initialOption
            >
              <option value="room">Room</option>
              <option value="fridge">Fridge</option>
              <option value="freezer">Freezer</option>
            </RhfSelect>
          </FormGroup>
        </div>
      </Fieldset>
      <FormGroup>
        <label htmlFor={`${id}-quality-control`}>Quality control:</label>
        <TextArea
          id={`${id}-quality-control`}
          {...register("qualityControl")}
        />
      </FormGroup>
      <FormGroup>
        <label htmlFor={`${id}-packaging`}>Packaging:</label>
        <TextArea id={`${id}-packaging`} {...register("packaging")} />
      </FormGroup>
      <FormGroup>
        <label htmlFor={`${id}-labelling`}>Labelling:</label>
        <TextArea id={`${id}-labelling`} {...register("labelling")} rows={5} />
      </FormGroup>
      <FormGroup>
        <label htmlFor={`${id}-references`}>References:</label>
        <TextArea id={`${id}-references`} {...register("references")} />
      </FormGroup>
      <Fieldset>
        <FormGroup>
          <label htmlFor={`${id}-effectiveDate`}>Effective date:</label>
          <Input
            type="date"
            id={`${id}-effectiveDate`}
            {...register("effectiveDate")}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor={`${id}-developed-by`}>Developed by:</label>
          <Input
            type="text"
            id={`${id}-developed-by`}
            {...register("developedBy")}
            size={40}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor={`${id}-verified-by`}>Verified by:</label>
          <Input
            type="text"
            id={`${id}-verified-by`}
            {...register("verifiedBy")}
            size={40}
          />
        </FormGroup>
      </Fieldset>
      <style jsx>{`
        .ingredient-list {
          margin-block: 0;
        }
      `}</style>
    </>
  )
}

export default MfrEntry
