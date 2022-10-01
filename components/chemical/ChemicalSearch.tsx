import { Chemical } from "@prisma/client"
import axios from "axios"
import AutocompleteInput, { withAsync } from "components/AutocompleteInput"
import { useState } from "react"
import {
  FieldError,
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form"
import useSWR from "swr"
import { JsonError } from "types/common"

interface ChemicalSearchProps<TFieldValues extends FieldValues>
  extends UseControllerProps<TFieldValues> {
  id: string
  error?: FieldError
  onItemChange?: (val: Chemical | null) => void
  size?: number
}

const renderSuggestion = (item: Chemical) => <div>{item.name}</div>

const getItemValue = (item?: Chemical | null): string => item?.name ?? ""

const AsyncAutocomplete = withAsync<Chemical>(AutocompleteInput)

const ChemicalSearch = <TFieldValues extends FieldValues>({
  id,
  control,
  name,
  rules,
  size,
  defaultValue,
  onItemChange,
}: ChemicalSearchProps<TFieldValues>) => {
  const {
    field: { onChange, onBlur, value, ref },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
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
        return response.data.sort((a, b) => a.name.localeCompare(b.name))
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

  const handleItemChange = (item?: Chemical | null) => {
    onChange(item?.id ?? null)
    onItemChange?.(item ?? null)
  }

  return (
    <AsyncAutocomplete
      id={id}
      name={name}
      item={chemicalData}
      items={options}
      inputRef={ref}
      getItemValue={getItemValue}
      renderSuggestion={renderSuggestion}
      isLoading={isLoading}
      onSearch={handleSearch}
      onItemChange={handleItemChange}
      onBlur={onBlur}
      minLength={2}
      width={size}
    />
  )
}

export default ChemicalSearch
