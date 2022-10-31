import { Vendor } from "@prisma/client"
import { UseFormReturn } from "react-hook-form"
import useSWR from "swr"

import ChemicalSearch from "components/chemical/ChemicalSearch"
import Input from "components/common/forms/Input"
import Select from "components/common/forms/Select"
import { NullPartialProductFields } from "lib/fields"
import form from "styles/form"
import { DataEntryComponent } from "types/common"

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
        <Input type="text" {...register("name")} size={40} />
      </label>
      <label className="form-group">
        <span>Chemical:</span>
        <ChemicalSearch
          id="chemical-search"
          name={`chemicalId`}
          size={30}
          defaultValue={null}
        />
      </label>

      <div className="form-group">
        <label>
          Vendor:
          <Select
            name="vendorId"
            className="vendor-select"
            rules={{ valueAsNumber: true }}
            initialOption
          >
            {vendors?.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </Select>
        </label>
      </div>
      <style jsx global>
        {form}
      </style>
      <style jsx global>{`
        .vendor-select {
          min-width: 10rem;
        }
      `}</style>
    </>
  )
}

export default ProductEntry
