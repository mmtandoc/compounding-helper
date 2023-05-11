import { RiskAssessment } from "@prisma/client"
import { Control } from "react-hook-form"
import useSWR from "swr"

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

  const { data: riskAssessments, error } = useSWR<RiskAssessment[]>(
    compoundId ? `/api/risk-assessments?compoundId=${compoundId}` : null,
  )

  //TODO: Improve error handling
  if (error) {
    console.error(error)
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
      initialOption={true}
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
