import { NullPartialRiskAssessmentFields } from "."
import { ChemicalAll, SdsWithHazards } from "types/models"
import { Chemical } from "@prisma/client"
import { useEffect } from "react"
import { Path, UseFormRegister, UseFormSetValue } from "react-hook-form"
import useSWR from "swr"
import { JsonError } from "types/common"

export const calculateSuggestedRiskLevel = (
  chemicals: Chemical[],
  selectedSdses: (SdsWithHazards | null)[],
  riskAssessmentFields: NullPartialRiskAssessmentFields,
  requireGreaterPrecaution: boolean,
): NullPartialRiskAssessmentFields["riskLevel"] | null => {
  let step = 1
  while (true) {
    switch (step) {
      case 1:
        //Is the product found in Table 1 of the NIOSH List - Antineoplastic (cytotoxic) Drugs?
        if (chemicals.some((c) => c.nioshTable === undefined)) {
          return null
        }
        if (chemicals.some((c) => c.nioshTable === 1)) {
          step = 2
        } else {
          step = 4
        }
        break
      case 2:
        //Is the product found in Table 2 or 3 of the NIOSH list of dangerous drugs?
        if (chemicals.some((c) => c.nioshTable === undefined)) {
          return null
        }
        if (chemicals.some((c) => c.nioshTable === 2 || c.nioshTable === 3)) {
          step = 3
        } else {
          //or
          //Is the product listed as a health hazard under the Hazardous Products Act?
          if (selectedSdses.some((s) => s === null)) {
            return null
          }
          if (
            selectedSdses.some(
              (s) => (s as SdsWithHazards).healthHazards.length > 0,
            )
          ) {
            step = 3
          } else {
            step = 5
          }
        }
        break
      case 3:
        //Does the NIOSH or WHMIS information indicate that this material requires ventilation for preparation?
        if (riskAssessmentFields.requireVentilation === null) {
          return null
        }
        if (riskAssessmentFields.requireVentilation) {
          step = 4
        } else {
          //Or
          //is it a reproductive risk to compounder?
          if (
            selectedSdses.some((sds) =>
              sds?.healthHazards.some(
                (h) =>
                  h.hazardCategory.hazardClass.name.toUpperCase() ===
                  "REPRODUCTIVE TOXICITY",
              ),
            )
          ) {
            step = 4
          } else {
            step = 6
          }
        }
        break
      case 4:
        //Occasional small quantity?
        if (riskAssessmentFields.isSmallQuantity === null) {
          return null
        }
        if (riskAssessmentFields.isSmallQuantity) {
          step = 6
        } else {
          step = 9
        }
        break
      case 5:
        //Is the compound simple/moderate or complex?
        switch (riskAssessmentFields.complexity) {
          case "simple":
          case "moderate":
            step = 7
            break
          case "complex":
            step = 8
          default:
            return null
        }
        break
      case 6:
        //Do these ingredients require greater precautions to protect patient or personnel?
        if (requireGreaterPrecaution) {
          step = 8
        } else {
          step = 5
        }
        break
      case 7:
        return "A"
      case 8:
        return "B"
      case 9:
        return "C"
      default:
        return null
    }
    return null
  }
  return null
}

type UseClearDisabledFieldProps = {
  clearConditional: boolean | undefined
  names: Path<NullPartialRiskAssessmentFields>[]
  register: UseFormRegister<NullPartialRiskAssessmentFields>
  setValue: UseFormSetValue<NullPartialRiskAssessmentFields>
}

export const useClearDisabledField = ({
  clearConditional,
  names,
  register,
  setValue,
}: UseClearDisabledFieldProps) => {
  useEffect(() => {
    if (clearConditional) {
      for (const name of names) {
        register(name)
        setValue(name, null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register, setValue, clearConditional, JSON.stringify(names)])
}

export const useIngredientChemicals = (
  ingredients: NullPartialRiskAssessmentFields["ingredients"],
): {
  data?: ChemicalAll[]
  error?: JsonError
} => {
  const { data, error } = useSWR<ChemicalAll[], JsonError>(
    !ingredients || ingredients.length === 0
      ? null
      : [
          ingredients?.map((ingredient) =>
            ingredient?.chemicalId
              ? `/api/chemicals/${ingredient.chemicalId}`
              : null,
          ),
        ],
  )

  return { data, error }
}
