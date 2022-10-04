import { Vendor } from "@prisma/client"
import ChemicalSearch from "components/chemical/ChemicalSearch"
import { UseFormReturn } from "react-hook-form"
import form from "styles/form"
import useSWR from "swr"
import { DataEntryComponent } from "types/common"
import { ProductFields } from "types/fields"
import { NullPartialDeep } from "types/util"

export type NullPartialProductFields = NullPartialDeep<
  ProductFields,
  { ignoreKeys: "id" }
>

type Props = {
  formMethods: UseFormReturn<NullPartialProductFields>
}

const ProductEntry: DataEntryComponent<NullPartialProductFields, Props> = (
  props,
) => {
  const { formMethods } = props

  const { register, control } = formMethods

  const { data: vendors, error: vendorsError } =
    useSWR<Vendor[]>("/api/vendors")

  if (vendorsError) {
    console.error(vendorsError)
  }

  register("id")
  return (
    <>
      <label className="form-group">
        <span>Product name:</span>
        <input
          type="text"
          {...register("name", { required: true })}
          size={40}
        />
      </label>
      <label className="form-group">
        <span>Chemical:</span>
        <ChemicalSearch
          id="chemical-search"
          name={`chemicalId`}
          control={control}
          rules={{ required: true }}
          size={30}
          defaultValue={null}
        />
      </label>

      <div className="form-group">
        <label>
          <span>Vendor:</span>
          <select
            {...register("vendorId", { required: true, valueAsNumber: true })}
          >
            {vendors?.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <style jsx global>
        {form}
      </style>
    </>
  )
}

export default ProductEntry
