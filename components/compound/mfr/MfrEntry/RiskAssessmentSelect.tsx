import { RiskAssessment } from "@prisma/client"
import { useEffect } from "react"
import { Control, useFormContext, useWatch } from "react-hook-form"
import useSWR from "swr"

import { Spinner } from "components/ui"
import { RhfSelect } from "components/ui/forms"
import { NullableMfrFields } from "lib/fields"
import { toIsoDateString } from "lib/utils"

type Props = {
  id?: string
  compoundId?: number
  showAllRevisions?: boolean
  disabled?: boolean
  control?: Control<NullableMfrFields>
}

const RiskAssessmentSelect = (props: Props) => {
  const { id, compoundId, showAllRevisions = false, disabled, control } = props

  const {
    data: riskAssessments,
    error,
    isLoading,
  } = useSWR<RiskAssessment[]>(
    compoundId ? `/api/risk-assessments?compoundId=${compoundId}` : null,
  )

  //TODO: Improve error handling
  if (error) {
    console.error(error)
  }

  const riskAssessmentId = useWatch({ name: "riskAssessmentId", control })

  const { register, reset, setValue } = useFormContext()

  useEffect(() => {
    if (!isLoading && !riskAssessmentId && riskAssessments?.[0]?.id) {
      register("riskAssessmentId")
      setValue("riskAssessmentId", riskAssessments?.[0]?.id)
    }
  }, [isLoading, register, riskAssessmentId, riskAssessments, setValue])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <RhfSelect
      name={`riskAssessmentId`}
      rules={{
        disabled: disabled,
        valueAsNumber: true,
      }}
      id={id}
      className="risk-assessment-select"
      control={control}
    >
      {riskAssessments !== undefined &&
        Array.from(riskAssessments).map((riskAssessment) => (
          <option key={riskAssessment.id} value={riskAssessment.id}>
            ID #{riskAssessment.id} -{" "}
            {toIsoDateString(riskAssessment.dateAssessed)}
          </option>
        ))}
      <style jsx global>{`
        .sds-select {
          min-width: 30rem;
        }
      `}</style>
    </RhfSelect>
  )
}

export default RiskAssessmentSelect
