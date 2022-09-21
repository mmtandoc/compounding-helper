import React from "react"
import { UseFormRegister } from "react-hook-form"
import { ChemicalAll, SdsWithRelations } from "types/models"
import { NullPartialRiskAssessmentFields } from ".."
import { Vendor } from "@prisma/client"

type SdsSelectProps = {
  chemical?: ChemicalAll
  sdses?: SdsWithRelations[]
  vendors?: Vendor[]
  showPastRevisions: boolean
  register: UseFormRegister<NullPartialRiskAssessmentFields>
  ingredientIndex: number
  disabled?: boolean
  required?: boolean
}

const SdsSelect = ({
  chemical,
  sdses,
  vendors,
  showPastRevisions,
  register,
  ingredientIndex,
  disabled = true,
  required = true,
}: SdsSelectProps) => {
  const sdsProductMap = new Map<number, SdsWithRelations[]>()
  if (sdses !== undefined) {
    for (const sds of sdses.sort((a, b) => a.id - b.id)) {
      sdsProductMap.set(
        sds.productId,
        [...(sdsProductMap.get(sds.productId) ?? []), sds].sort(
          (a, b) => b.revisionDate.getTime() - a.revisionDate.getTime(),
        ),
      )
    }
  }

  return (
    <select
      {...register(`ingredients.${ingredientIndex}.sdsId`, {
        setValueAs: (val) => (val !== null ? parseInt(val) : null),
        required: required,
        //deps: `ingredients.${ingredientIndex}.chemicalId`,
        disabled: disabled,
      })}
      id={`i${ingredientIndex}-sds-select`}
      className="sds-select"
    >
      {chemical !== undefined &&
        sdses !== undefined &&
        vendors !== undefined &&
        Array.from(sdsProductMap.entries()).map(([pid, sdsArray]) => {
          const product = chemical?.products.find((p) => p.id === pid)

          if (!product || sdsArray.length === 0) {
            return
          }

          const vendorName = vendors?.find(
            (v) => v.id === product.vendorId,
          )?.name

          const productLabel = `${product.name} (${vendorName ?? "ERROR"})`

          const renderSdsOption = (sds: SdsWithRelations) => (
            <option key={sds.id} value={sds.id}>
              {productLabel} - {sds.revisionDate.toLocaleDateString("en-CA")}
            </option>
          )

          if (showPastRevisions) {
            return (
              <optgroup label={productLabel} key={pid}>
                {sdsArray.map(renderSdsOption)}
              </optgroup>
            )
          }

          return renderSdsOption(sdsArray[0])
        })}
      <style jsx>{`
        select.sds-select {
          min-width: 30rem;
        }
      `}</style>
    </select>
  )
}

export default SdsSelect
