import React, { useEffect } from "react"
import {
  Control,
  Path,
  UseFormRegister,
  useFormContext,
  useWatch,
} from "react-hook-form"
import useSWR from "swr"

import { HealthHazardItem } from "components/compound/ingredient/HealthHazardItem"
import { Spinner } from "components/ui"
import {
  Fieldset,
  FormGroup,
  Input,
  RhfBooleanRadioGroup,
} from "components/ui/forms"
import { NullableRiskAssessmentFields } from "lib/fields"
import useUpdateFieldConditionally from "lib/hooks/useUpdateFieldConditionally"
import { SdsWithRelations } from "types/models"

type ExposureRisksInputsProps = {
  name: Path<NullableRiskAssessmentFields>
  category: string
  sdsIds?: number[]
  register: UseFormRegister<NullableRiskAssessmentFields>
  control?: Control<NullableRiskAssessmentFields>
}

const ExposureRisksInputs = (props: ExposureRisksInputsProps) => {
  const formMethods = useFormContext<NullableRiskAssessmentFields>()
  const {
    name,
    category,
    sdsIds,
    register,
    control = formMethods.control,
  } = props

  const isOtherRisk = useWatch({
    name: `${name}.other` as Path<NullableRiskAssessmentFields>,
    control: control,
  })

  const { setValue, clearErrors } = formMethods

  const {
    data: sdses,
    error: sdsError,
    isLoading,
  } = useSWR<SdsWithRelations[]>(
    !sdsIds ? null : sdsIds.map((id) => `/api/sds/${id}`),
  )

  if (sdsError) {
    console.error(sdsError)
  }

  useUpdateFieldConditionally({
    updateCondition: isOtherRisk === false,
    fields: [
      [`${name}.otherDescription` as Path<NullableRiskAssessmentFields>, null],
    ],
    register,
    setValue,
  })

  useEffect(() => {
    if (isOtherRisk === false) {
      clearErrors(
        `${name}.otherDescription` as Path<NullableRiskAssessmentFields>,
      )
    }
  }, [isOtherRisk, clearErrors, name])

  /* const getHazardCategoriesByClasses = (...classNames: string[]) => {
    if (sdses === undefined) {
      return
    }
    const hazardCategoriesMap = new Map<
      string,
      SdsWithRelations["healthHazards"]
    >()
    for (const sds of sdses) {
      const hazards = sds.healthHazards.filter((h) =>
        classNames.includes(h.hazardCategory.hazardClass.name),
      )
      hazardCategoriesMap.set(sds.product.chemical.name, hazards)
    }
    return hazardCategoriesMap
  } */

  return (
    <Fieldset legend={`${category}:`} className="exposure-risks">
      <div className="row">
        <div>
          <ExposureRiskRow
            riskName="Skin"
            name={`${name}.skin` as Path<NullableRiskAssessmentFields>}
            control={control}
            /* relatedHazardMap={getHazardCategoriesByClasses(
              "Acute toxicity - Dermal",
              "Skin corrosion/irritation",
            )} */
          />
          <ExposureRiskRow
            riskName="Eye"
            name={`${name}.eye` as Path<NullableRiskAssessmentFields>}
            control={control}
            /* relatedHazardMap={getHazardCategoriesByClasses(
              "Serious eye damage/eye irritation",
            )} */
          />
          <ExposureRiskRow
            riskName="Inhalation"
            name={`${name}.inhalation` as Path<NullableRiskAssessmentFields>}
            control={control}
            /* relatedHazardMap={getHazardCategoriesByClasses(
              "Acute toxicity - Inhalation",
              "Aspiration hazard",
            )} */
          />
          <ExposureRiskRow
            riskName="Oral"
            name={`${name}.oral` as Path<NullableRiskAssessmentFields>}
            control={control}
            /* relatedHazardMap={getHazardCategoriesByClasses(
              "Acute toxicity - Oral",
            )} */
          />
        </div>
        <div className="health-hazards">
          {isLoading ? (
            <Spinner />
          ) : (
            sdses?.map((sds, i) => (
              <ul key={i}>
                <span className="label">{sds.product.name}</span>
                {sds.healthHazards.length > 0 ? (
                  sds.healthHazards.map((h, i) => (
                    <HealthHazardItem
                      hazard={h}
                      key={i}
                      arrowPosition="top-end"
                    />
                  ))
                ) : (
                  <li>No health hazards</li>
                )}
              </ul>
            ))
          )}
          <style jsx>{`
            .health-hazards {
              display: flex;
              flex-direction: column;
              flex-wrap: wrap;
              row-gap: 0.7rem;
            }

            .health-hazards ul {
              font-size: 1rem;
            }

            .health-hazards ul {
              margin-block: 0;
            }

            .health-hazards > ul > span.label {
              margin-left: -2rem;
              font-weight: 700;
            }

            :global(.health-hazard-item .tooltip) {
              font-size: 1.3rem;
            }
          `}</style>
        </div>
      </div>
      <div className="row">
        <FormGroup>
          <label>Other:</label>
          <RhfBooleanRadioGroup
            name={`${name}.other` as Path<NullableRiskAssessmentFields>}
            control={control}
            /* rules={{ deps: `${name}.otherDescription` }} */
          />
        </FormGroup>
        <div className="form-group" style={{ flexGrow: 1 }}>
          <label className={isOtherRisk !== true ? "disabled" : ""}>
            Description:
          </label>
          <Input
            type="text"
            {...register(
              `${name}.otherDescription` as Path<NullableRiskAssessmentFields>,
              { disabled: isOtherRisk !== true },
            )}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </Fieldset>
  )
}

type ExposureRiskRowProps = {
  riskName: string
  name: Path<NullableRiskAssessmentFields>
  control: Control<NullableRiskAssessmentFields>
  deps?: string | string[]
  relatedHazardMap?: Map<string, SdsWithRelations["healthHazards"]>
}

const ExposureRiskRow = ({
  riskName,
  name,
  control,
  deps,
  relatedHazardMap,
}: ExposureRiskRowProps) => {
  return (
    <div className="row">
      <FormGroup>
        <label>{riskName}:</label>
        <RhfBooleanRadioGroup name={name} control={control} rules={{ deps }} />
      </FormGroup>
      {relatedHazardMap && (
        <div className="col related-health-hazards">
          <ul>
            {Array.from(relatedHazardMap.entries()).map(([_, hazards], i) =>
              hazards.map((h, j) => (
                <HealthHazardItem hazard={h} key={`${i}-${j}`} />
              )),
            )}
          </ul>
          <style jsx>{`
            .related-health-hazards {
              font-size: 1rem;
            }
          `}</style>
        </div>
      )}
    </div>
  )
}

export default ExposureRisksInputs
