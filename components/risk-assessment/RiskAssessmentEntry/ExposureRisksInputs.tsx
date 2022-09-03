import { RHFBooleanRadioGroup } from "components/BooleanRadioGroup"
import { NullPartialRiskAssessmentFields } from "components/risk-assessment/RiskAssessmentEntry"
import React from "react"
import { Control, Path, UseFormRegister, useWatch } from "react-hook-form"

type ExposureRisksInputsProps = {
  name: Path<NullPartialRiskAssessmentFields>
  category: string
  register: UseFormRegister<NullPartialRiskAssessmentFields>
  control: Control<NullPartialRiskAssessmentFields>
  deps?: string | string[]
}

const ExposureRisksInputs = ({
  name,
  category,
  register,
  control,
  deps,
}: ExposureRisksInputsProps) => {
  const isOtherRisk = useWatch({
    name: `${name}.other` as Path<NullPartialRiskAssessmentFields>,
    control: control,
  })

  return (
    <fieldset>
      <legend>{category}:</legend>
      <div className="form-group">
        <label>Skin:</label>
        <RHFBooleanRadioGroup
          name={`${name}.skin` as Path<NullPartialRiskAssessmentFields>}
          control={control}
          rules={{ required: true, deps }}
        />
      </div>
      <div className="form-group">
        <label>Eye:</label>
        <RHFBooleanRadioGroup
          name={`${name}.eye` as Path<NullPartialRiskAssessmentFields>}
          control={control}
          rules={{ required: true, deps }}
        />
      </div>
      <div className="form-group">
        <label>Inhalation:</label>
        <RHFBooleanRadioGroup
          name={`${name}.inhalation` as Path<NullPartialRiskAssessmentFields>}
          control={control}
          rules={{ required: true, deps }}
        />
      </div>
      <div className="form-group">
        <label>Oral:</label>
        <RHFBooleanRadioGroup
          name={`${name}.oral` as Path<NullPartialRiskAssessmentFields>}
          control={control}
          rules={{ required: true, deps }}
        />
      </div>
      <div className="row">
        <div className="form-group">
          <label>Other:</label>
          <RHFBooleanRadioGroup
            name={`${name}.other` as Path<NullPartialRiskAssessmentFields>}
            control={control}
            rules={{ required: true, deps }}
          />
        </div>
        <div className="form-group" style={{ flexGrow: 1 }}>
          <label className={isOtherRisk !== true ? "disabled" : ""}>
            Description:
          </label>
          <input
            type="text"
            {...register(
              `${name}.otherDescription` as Path<NullPartialRiskAssessmentFields>,
              {
                required: true,
                disabled: isOtherRisk !== true,
                deps: [`${name}.other`],
              },
            )}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </fieldset>
  )
}

export default ExposureRisksInputs
