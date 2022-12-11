import { RiskAssessment } from "@prisma/client"
import { capitalize } from "lodash"
import Link from "next/link"
import { useEffect, useId, useMemo } from "react"
import { Controller, UseFormReturn, useFieldArray } from "react-hook-form"
import useSWR from "swr"

import Button from "components/common/Button"
import DotJotList from "components/common/forms/DotJotList"
import Fieldset from "components/common/forms/Fieldset"
import { FormGroup } from "components/common/forms/FormGroup"
import Input from "components/common/forms/Input"
import RhfSelect from "components/common/forms/RhfSelect"
import TextArea from "components/common/forms/TextArea"
import Spinner from "components/common/Spinner"
import { NullPartialMfrFields } from "lib/fields"
import { CompoundWithIngredients } from "types/models"

import { FormulaEntryTable } from "./FormulaEntryTable"
import RiskAssessmentSelect from "./RiskAssessmentSelect"

interface MfrEntryProps {
  formMethods: UseFormReturn<NullPartialMfrFields>
}

const MfrEntry = (props: MfrEntryProps) => {
  const { formMethods } = props
  const { register, watch, control, setValue, getValues } = formMethods
  const id = useId()

  const [compoundId, riskAssessmentId, quantities] = watch([
    "compoundId",
    "riskAssessmentId",
    "quantities",
  ])

  const quantityArrayMethods = useFieldArray({
    control,
    name: "quantities",
  })

  const { data: compound, error: compoundError } =
    useSWR<CompoundWithIngredients>(`/api/compounds/${compoundId}`)

  const { data: riskAssessment, error: riskAssessmentError } =
    useSWR<RiskAssessment>(
      riskAssessmentId ? `/api/risk-assessments/${riskAssessmentId}` : null,
    )

  //TODO: Improve error handling
  if (riskAssessmentError) {
    console.error(riskAssessmentError)
  }
  if (compoundError) {
    console.error(compoundError)
  }

  const isLoading = {
    compound: !compound && !compoundError,
    riskAssessment: !riskAssessment && !riskAssessmentError,
  }

  useEffect(() => {
    if (
      compound?.ingredients &&
      quantities &&
      compound.ingredients.length - (quantities?.length ?? 0) > 0
    ) {
      quantityArrayMethods.append(
        new Array(compound.ingredients.length - quantities.length).fill({
          amount: null,
          unit: null,
        }),
        { shouldFocus: false },
      )
    }
  }, [compound, quantities, quantityArrayMethods])

  console.log({ quantities })

  console.log({ riskAssessment })

  const requiredPpe = useMemo(
    () => (riskAssessment ? getRequiredPpeList(riskAssessment) : []),
    [riskAssessment],
  )

  const presetLabellingOptions = [
    "External use only",
    "Shake well",
    "Store at room temperature",
    "Store in fridge",
    "Expiry date",
  ]

  register("riskAssessmentId")
  return (
    <>
      <FormGroup row style={{ justifyContent: "space-between" }}>
        <FormGroup className="row">
          <label>Compound:</label>
          {!isLoading.compound ? <span>{compound?.name}</span> : <Spinner />}
        </FormGroup>
      </FormGroup>
      <FormGroup row></FormGroup>
      <Fieldset legend="Formula:">
        <FormulaEntryTable
          isLoading={isLoading.compound}
          formMethods={formMethods}
          fields={quantityArrayMethods.fields}
          compound={compound}
        />
        <FormGroup row className="expected-yield">
          <label htmlFor={`${id}-expected-yield-amount`}>Expected yield:</label>
          <div className="row">
            <Input
              id={`${id}-expected-yield-amount`}
              {...register(`expectedYield.amount`, {
                valueAsNumber: true,
              })}
              size={5}
            />
            <RhfSelect name={`expectedYield.unit`} initialOption>
              <option value="g">g</option>
              <option value="ml">ml</option>
            </RhfSelect>
          </div>
        </FormGroup>
      </Fieldset>
      <FormGroup>
        <label htmlFor={`${id}-risk-assessment`}>
          Referenced risk assessment:
        </label>
        <div className="row">
          <RiskAssessmentSelect
            id={`${id}-risk-assessment`}
            compoundId={compoundId}
            showAllRevisions={true}
          />
          {riskAssessmentId && (
            <Link
              className="risk-assessment-link"
              href={`/risk-assessments/${riskAssessmentId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View
            </Link>
          )}
        </div>
      </FormGroup>
      <FormGroup row style={{ alignItems: "center" }}>
        <span className="label">Risk level:</span>
        {riskAssessmentId ? (
          !isLoading.riskAssessment ? (
            <span>{riskAssessment?.riskLevel ?? "N/A"}</span>
          ) : (
            <Spinner />
          )
        ) : (
          "N/A"
        )}
      </FormGroup>
      <Fieldset legend="Required PPE:">
        {riskAssessmentId ? (
          !isLoading.riskAssessment ? (
            <ul className="required-ppe-list">
              {requiredPpe.map((ppe, i) => (
                <li key={i}>{ppe}</li>
              ))}
            </ul>
          ) : (
            <Spinner />
          )
        ) : (
          "N/A"
        )}
      </Fieldset>
      <Fieldset legend="Training:">
        <Controller
          control={control}
          name="training"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <DotJotList
              items={value?.map((v) => ({ text: v })) ?? []}
              onChange={(items) => onChange(items.map((item) => item.text))}
              ref={ref}
              onBlur={onBlur}
              size={60}
            />
          )}
        />
      </Fieldset>
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
        />
      </Fieldset>
      <FormGroup>
        <label htmlFor={`${id}-calculations`}>Calculations:</label>
        <TextArea
          id={`${id}-calculations`}
          {...register("calculations")}
          rows={2}
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
            <label htmlFor={`${id}-beyond-use-date-value`}>
              Beyond use date:
            </label>
            <div className="row">
              <Input
                id={`${id}-beyond-use-date-value`}
                type="number"
                min={1}
                size={3}
                {...register("beyondUseDate.value", { valueAsNumber: true })}
              />
              <RhfSelect name="beyondUseDate.unit" initialOption>
                <option value="days">Days</option>
                <option value="months">Months</option>
              </RhfSelect>
            </div>
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
      <Fieldset legend="Labelling:">
        <FormGroup row className="preset-labelling-options">
          <span>Add option:</span>
          {presetLabellingOptions.map((option, i) => (
            <Button
              key={i}
              size="small"
              onClick={() =>
                setValue("labelling", [
                  ...(getValues("labelling") ?? []),
                  option,
                ])
              }
            >
              {option}
            </Button>
          ))}
        </FormGroup>
        <Controller
          control={control}
          name="labelling"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <DotJotList
              items={value?.map((v) => ({ text: v })) ?? []}
              onChange={(items) => onChange(items.map((item) => item.text))}
              ref={ref}
              onBlur={onBlur}
            />
          )}
        />
      </Fieldset>
      <Fieldset legend="References:">
        <Controller
          control={control}
          name="references"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <DotJotList
              items={value?.map((v) => ({ text: v })) ?? []}
              onChange={(items) => onChange(items.map((item) => item.text))}
              ref={ref}
              onBlur={onBlur}
            />
          )}
        />
      </Fieldset>
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
        .risk-assessment-link {
          font-size: var(--font-size-sm);
        }

        .ingredient-list,
        .required-ppe-list {
          margin-block: 0;
        }

        :global(.preset-labelling-options) {
          font-size: var(--font-size-sm);
          align-items: center;
          margin-bottom: 1rem;
          display: flex;
          column-gap: 1rem;
          margin-bottom: 1rem;
          justify-content: end;
        }

        :global(.ref-number) {
          font-size: var(--font-size-xl);
          justify-content: end;
        }

        :global(.expected-yield) {
          justify-content: end;
          padding-right: 1rem;
        }

        :global(.ingredients-table) {
          width: 100%;
          margin-bottom: 1rem;
        }
      `}</style>
    </>
  )
}

const getRequiredPpeList = (riskAssessment: RiskAssessment) => {
  const requiredPpe = []
  if (riskAssessment?.ppeGlovesRequired) {
    requiredPpe.push(capitalize(`${riskAssessment.ppeGlovesType} gloves`))
  }
  if (riskAssessment?.ppeCoatRequired) {
    requiredPpe.push(capitalize(`${riskAssessment.ppeCoatType} coat`))
  }
  if (riskAssessment?.ppeMaskRequired) {
    requiredPpe.push(capitalize(`${riskAssessment.ppeMaskType} mask`))
  }
  if (riskAssessment?.ppeEyeProtectionRequired) {
    requiredPpe.push(capitalize(`Eye protection`))
  }
  if (riskAssessment?.ppeOther) {
    requiredPpe.push(capitalize(riskAssessment.ppeOther))
  }
  return requiredPpe
}

export default MfrEntry
