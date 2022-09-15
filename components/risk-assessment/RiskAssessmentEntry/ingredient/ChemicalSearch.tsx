import { Chemical } from "@prisma/client"
import axios from "axios"
import AutocompleteInput, { withAsync } from "components/AutocompleteInput"
import { NullPartialRiskAssessmentFields } from "components/risk-assessment/RiskAssessmentEntry"
import { useState } from "react"
import { FieldError, useController, UseControllerProps } from "react-hook-form"
import useSWR from "swr"
import { JsonError } from "types/common"

interface Props extends UseControllerProps<NullPartialRiskAssessmentFields> {
  id: string
  error?: FieldError
  onItemChange?: (val: Chemical) => void
  size?: number
}

const renderSuggestion = (item: Chemical) => <div>{item.name}</div>

const getItemValue = (item?: Chemical | null): string => item?.name ?? ""

const AsyncAutocomplete = withAsync<Chemical>(AutocompleteInput)

const ChemicalSearch = ({ id, control, name, rules, size }: Props) => {
  const {
    field: { onChange, onBlur, value, ref },
  } = useController({
    name,
    control,
    rules,
    defaultValue: null,
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [options, setOptions] = useState<Chemical[]>([])

  const { data: chemicalData, error: chemicalError } = useSWR<
    Chemical,
    JsonError
  >(value ? `/api/chemicals/${value}` : null)

  if (chemicalError) {
    console.log(chemicalError)
  }

  const getIngredients = async (query: string): Promise<Chemical[]> => {
    return axios
      .get<Chemical[]>(`/api/chemicals?query=${query}`)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        //TODO: Handle error
        console.error(error)
        return []
      })
  }

  const handleSearch = (query: string) => {
    if (query === "") {
      setOptions([])
      return
    }

    setIsLoading(true)

    getIngredients(query)
      .then((ingredients) => {
        setIsLoading(false)
        setOptions(ingredients)
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
        setOptions([])
      })
  }

  const handleItemChange = (item: Chemical) => onChange(item?.id)

  return (
    <AsyncAutocomplete
      id={id}
      name={name}
      getItemValue={getItemValue}
      renderSuggestion={renderSuggestion}
      items={options}
      isLoading={isLoading}
      onSearch={handleSearch}
      minLength={2}
      item={chemicalData}
      onItemChange={handleItemChange}
      inputRef={ref}
      width={size}
    />
  )
}

export default ChemicalSearch
