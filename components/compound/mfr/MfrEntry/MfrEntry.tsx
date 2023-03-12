import { RiskAssessment } from "@prisma/client"
import { capitalize } from "lodash"
import Link from "next/link"
import { useEffect, useId, useMemo } from "react"
import {
  Controller,
  FieldPathValue,
  UseFormReturn,
  useFieldArray,
} from "react-hook-form"
import useSWR from "swr"

import { Spinner } from "components/ui"
import {
  DotJotList,
  Fieldset,
  FormGroup,
  Input,
  RhfSelect,
  TextArea,
} from "components/ui/forms"
import { NullPartialMfrFields, NullPartialSettingsFields } from "lib/fields"
import { CompoundWithIngredients } from "types/models"

import { FormulaEntryTable } from "./FormulaEntryTable"
import PresetDropdown, { PresetType } from "./PresetDropdown"
import { QualityControlEntryTable } from "./QualityControlEntryTable"
import RiskAssessmentSelect from "./RiskAssessmentSelect"

interface MfrEntryProps {
  formMethods: UseFormReturn<NullPartialMfrFields>
}

const MfrEntry = (props: MfrEntryProps) => {
  const { formMethods } = props
  const { register, watch, control } = formMethods
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

  const { data: settings, error: settingsError } =
    useSWR<NullPartialSettingsFields>("/api/settings")

  const { data: compound, error: compoundError } =
    useSWR<CompoundWithIngredients>(`/api/compounds/${compoundId}`)

  const { data: riskAssessment, error: riskAssessmentError } =
    useSWR<RiskAssessment>(
      riskAssessmentId ? `/api/risk-assessments/${riskAssessmentId}` : null,
    )

  //TODO: Improve error handling
  if (settingsError) {
    console.error(settingsError)
  }
  if (riskAssessmentError) {
    console.error(riskAssessmentError)
  }
  if (compoundError) {
    console.error(compoundError)
  }

  const isLoading = {
    compound: !compound && !compoundError,
    riskAssessment: !riskAssessment && !riskAssessmentError,
    settings: !settings && !settingsError,
  }

  const presetOptions = settings?.mfrFieldPresets

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

  const requiredPpe = useMemo(
    () => (riskAssessment ? getRequiredPpeList(riskAssessment) : []),
    [riskAssessment],
  )

  register("riskAssessmentId")
  return (
    <>
      <FormGroup row>
        <label>Compound:</label>
        {!isLoading.compound ? <span>{compound?.name}</span> : <Spinner />}
      </FormGroup>
      <FormGroup className="form-group-table">
        <FormGroup row>
          <label htmlFor={`${id}-pharmaceutical-form`}>
            Pharmaceutical form:
          </label>
          <Input
            type="text"
            id={`${id}-pharmaceutical-form`}
            {...register("pharmaceuticalForm")}
            list={`${id}-pharmacutical-forms-list`}
          />
          <datalist id={`${id}-pharmacutical-forms-list`}>
            <option>Cream</option>
            <option>Ointment</option>
            <option>Lotion</option>
            <option>Liquid</option>
          </datalist>
        </FormGroup>
        <FormGroup row>
          <label htmlFor={`${id}-route-of-administration`}>
            Route of administration:
          </label>
          <Input
            type="text"
            id={`${id}-route-of-administration`}
            {...register("routeOfAdministration")}
            list={`${id}-administration-routes-list`}
          />
          <datalist id={`${id}-administration-routes-list`}>
            <option>Topical</option>
          </datalist>
        </FormGroup>
      </FormGroup>
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
      <Fieldset
        legend="Required equipment:"
        className="preset-options-fieldset"
      >
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
        <PresetDropdown
          name="requiredEquipment"
          label="Add preset equipment"
          options={presetOptions?.requiredEquipment ?? []}
          type={PresetType.Array}
          formMethods={formMethods}
        />
      </Fieldset>
      <FormGroup>
        <label htmlFor={`${id}-calculations`}>Calculations:</label>
        <TextArea
          id={`${id}-calculations`}
          {...register("calculations")}
          autoResize
          rows={2}
        />
      </FormGroup>
      <FormGroup>
        <div className="label-preset-row">
          <label className="label" htmlFor={`${id}-compounding-method`}>
            Compounding method:
          </label>
          <PresetDropdown
            name="compoundingMethod"
            label="Set preset compounding method"
            type={PresetType.Single}
            options={presetOptions?.compoundingMethod ?? []}
            formMethods={formMethods}
          />
        </div>
        <TextArea
          id={`${id}-compounding-method`}
          {...register("compoundingMethod")}
          autoResize
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
        <div className="label-preset-row">
          <label className="label" htmlFor={`${id}-quality-control`}>
            Quality controls:
          </label>
          <PresetDropdown
            name="qualityControls"
            label="Set preset quality controls"
            options={presetOptions?.qualityControls ?? []}
            type={PresetType.MultiArray}
            formMethods={formMethods}
          />
        </div>
        <QualityControlEntryTable formMethods={formMethods} />
      </FormGroup>
      <FormGroup>
        <div className="label-preset-row">
          <label htmlFor={`${id}-packaging`}>Packaging:</label>
          <PresetDropdown
            name="packaging"
            label="Set preset packaging"
            type={PresetType.Single}
            options={presetOptions?.packaging ?? []}
            formMethods={formMethods}
          />
        </div>
        <TextArea
          id={`${id}-packaging`}
          {...register("packaging")}
          autoResize
        />
      </FormGroup>
      <Fieldset legend="Labelling:" className="preset-options-fieldset">
        <Controller
          control={control}
          name="labelling"
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
        <PresetDropdown
          name="labelling"
          label="Add preset labelling"
          options={presetOptions?.labelling ?? []}
          type={PresetType.Array}
          formMethods={formMethods}
        />
      </Fieldset>
      <Fieldset legend="References:" className="preset-options-fieldset">
        <Controller
          control={control}
          name="references"
          render={({ field: { name, onChange, onBlur, value, ref } }) => (
            <DotJotList
              name={name}
              items={value?.map((v) => ({ text: v })) ?? []}
              editable
              onChange={(items) => onChange(items.map((item) => item.text))}
              ref={ref}
              onBlur={onBlur}
            />
          )}
        />
        <PresetDropdown
          name="references"
          label="Add preset references"
          options={presetOptions?.references ?? []}
          type={PresetType.Array}
          formMethods={formMethods}
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
        :global(.form-group-table) {
          display: grid;
          gap: 10px;
          grid-template-columns: auto 1fr;
        }

        :global(.form-group-table > div) {
          display: contents !important;
        }

        .risk-assessment-link {
          font-size: var(--font-size-sm);
        }

        .ingredient-list,
        .required-ppe-list {
          margin-block: 0;
        }

        .label-preset-row {
          display: flex;
          column-gap: 1rem;
          align-items: center;
          margin-top: 1rem;
          > :global(.preset-dropdown) {
            margin-left: auto;
            margin-right: 0;
            margin-bottom: 0.5rem;
          }
        }

        :global(.preset-options-fieldset) {
          display: flex;
          column-gap: 1rem;
          > :global(.dot-jot-list) {
            flex-grow: 1;
          }

          > :global(.preset-dropdown) {
            margin-left: auto;
            margin-right: 0;
            margin-bottom: 0.5rem;
            > :global(button) {
              display: block;
            }
          }
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
