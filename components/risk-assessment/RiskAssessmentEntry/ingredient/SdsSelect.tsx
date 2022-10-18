import React from "react"
import { ChemicalAll, SdsWithRelations } from "types/models"
import { Vendor } from "@prisma/client"
import Select from "components/common/forms/Select"
import { NullPartialRiskAssessmentFields } from "lib/fields"
import { Control } from "react-hook-form"

type SdsSelectProps = {
  chemical?: ChemicalAll
  sdses?: SdsWithRelations[]
  vendors?: Vendor[]
  showAllRevisions: boolean
  ingredientIndex: number
  disabled?: boolean
  required?: boolean
  control?: Control<NullPartialRiskAssessmentFields>
}

const SdsSelect = ({
  chemical,
  sdses,
  vendors,
  showAllRevisions,
  ingredientIndex,
  disabled = true,
  required = true,
  control,
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
    <Select
      name={`ingredients.${ingredientIndex}.sdsId`}
      rules={{
        required: required,
        disabled: disabled,
        valueAsNumber: true,
      }}
      id={`i${ingredientIndex}-sds-select`}
      className="sds-select"
      initialOption={false}
      control={control}
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

          if (showAllRevisions) {
            return (
              <optgroup label={productLabel} key={pid}>
                {sdsArray.map(renderSdsOption)}
              </optgroup>
            )
          }

          return renderSdsOption(sdsArray[0])
        })}
      <style jsx global>{`
        .sds-select {
          min-width: 30rem;
        }
      `}</style>
    </Select>
  )
}

export default SdsSelect
