import { RHFBooleanRadioGroup } from "components/BooleanRadioGroup"
import Input from "components/common/forms/Input"
import { NullPartialRiskAssessmentFields } from "lib/fields"
import React from "react"
import {
  Control,
  Path,
  useFormContext,
  UseFormRegister,
  useWatch,
} from "react-hook-form"
import useSWR from "swr"
import { SdsWithRelations } from "types/models"

type ExposureRisksInputsProps = {
  name: Path<NullPartialRiskAssessmentFields>
  category: string
  sdsIds?: number[]
  register: UseFormRegister<NullPartialRiskAssessmentFields>
  control?: Control<NullPartialRiskAssessmentFields>
}

const ExposureRisksInputs = (props: ExposureRisksInputsProps) => {
  const formMethods = useFormContext<NullPartialRiskAssessmentFields>()
  const {
    name,
    category,
    sdsIds,
    register,
    control = formMethods.control,
  } = props
  const isOtherRisk = useWatch({
    name: `${name}.other` as Path<NullPartialRiskAssessmentFields>,
    control: control,
  })

  const { data: sdses, error: sdsError } = useSWR<SdsWithRelations[]>(
    !sdsIds ? null : [sdsIds.map((id) => `/api/sds/${id}`)],
  )

  const getHazardCategoriesByClasses = (...classNames: string[]) => {
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
  }

  return (
    <fieldset className="exposure-risks">
      <legend>{category}:</legend>
      <div className="row">
        <div>
          <ExposureRiskRow
            riskName="Skin"
            name={`${name}.skin` as Path<NullPartialRiskAssessmentFields>}
            control={control}
            /* relatedHazardMap={getHazardCategoriesByClasses(
              "Acute toxicity - Dermal",
              "Skin corrosion/irritation",
            )} */
          />
          <ExposureRiskRow
            riskName="Eye"
            name={`${name}.eye` as Path<NullPartialRiskAssessmentFields>}
            control={control}
            /* relatedHazardMap={getHazardCategoriesByClasses(
              "Serious eye damage/eye irritation",
            )} */
          />
          <ExposureRiskRow
            riskName="Inhalation"
            name={`${name}.inhalation` as Path<NullPartialRiskAssessmentFields>}
            control={control}
            /* relatedHazardMap={getHazardCategoriesByClasses(
              "Acute toxicity - Inhalation",
              "Aspiration hazard",
            )} */
          />
          <ExposureRiskRow
            riskName="Oral"
            name={`${name}.oral` as Path<NullPartialRiskAssessmentFields>}
            control={control}
            /* relatedHazardMap={getHazardCategoriesByClasses(
              "Acute toxicity - Oral",
            )} */
          />
        </div>
        <div className="health-hazards">
          {sdses?.map((sds, i) => (
            <ul key={i}>
              <span className="label">{sds.product.name}</span>
              {sds.healthHazards.map((h, i) => (
                <li key={i}>{hazardToString(h)}</li>
              ))}
            </ul>
          ))}
          <style jsx global>{`
            .health-hazards {
              display: flex;
              flex-direction: column;
              flex-wrap: wrap;
              row-gap: 0.7rem;
            }

            .health-hazards ul > li,
            .health-hazards span.label {
              font-size: 1rem;
            }

            .health-hazards ul {
              margin-block: 0;
            }

            .health-hazards span.label {
              margin-left: -2rem;
              font-weight: 700;
            }
          `}</style>
        </div>
      </div>
      <div className="row">
        <div className="form-group">
          <label>Other:</label>
          <RHFBooleanRadioGroup
            name={`${name}.other` as Path<NullPartialRiskAssessmentFields>}
            control={control}
            rules={{ deps: `${name}.otherDescription` }}
          />
        </div>
        <div className="form-group" style={{ flexGrow: 1 }}>
          <label className={isOtherRisk !== true ? "disabled" : ""}>
            Description:
          </label>
          <Input
            type="text"
            {...register(
              `${name}.otherDescription` as Path<NullPartialRiskAssessmentFields>,
              { disabled: isOtherRisk !== true },
            )}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </fieldset>
  )
}

type ExposureRiskRowProps = {
  riskName: string
  name: Path<NullPartialRiskAssessmentFields>
  control: Control<NullPartialRiskAssessmentFields>
  deps?: string | string[]
  relatedHazardMap?: Map<string, SdsWithRelations["healthHazards"]>
}

const hazardToString = (hazard: SdsWithRelations["healthHazards"][number]) => {
  const category = hazard.hazardCategory
  const hazardClass = category.hazardClass

  return `${hazardClass.name} - Cat. ${category.level} ${
    hazard.additionalInfo ? `(${hazard.additionalInfo})` : ""
  }`
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
      <div className="form-group">
        <label>{riskName}:</label>
        <RHFBooleanRadioGroup name={name} control={control} rules={{ deps }} />
      </div>
      {relatedHazardMap && (
        <div className="col related-health-hazards">
          <ul>
            {Array.from(relatedHazardMap.entries()).map(
              ([chemical, hazards], i) =>
                hazards.map((h, j) => (
                  <li key={`${i}-${j}`}>
                    {hazardToString(h)} ({chemical})
                  </li>
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
