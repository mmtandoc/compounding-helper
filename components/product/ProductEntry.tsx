import { Vendor } from "@prisma/client"
import { UseFormReturn } from "react-hook-form"
import useSWR from "swr"

import ChemicalSearch from "components/chemical/ChemicalSearch"
import { Input, LabelFormGroup, RhfSelect } from "components/ui/forms"
import { NullableProductFields } from "lib/fields"
import { DataEntryComponent } from "types/common"

type Props = {
  formMethods: UseFormReturn<NullableProductFields>
}

const ProductEntry: DataEntryComponent<NullableProductFields, Props> = (
  props,
) => {
  const { formMethods } = props

  const { register } = formMethods

  const { data: vendors, error: vendorsError } =
    useSWR<Vendor[]>("/api/vendors")

  if (vendorsError) {
    console.error(vendorsError)
  }

  register("id")
  return (
    <>
      <LabelFormGroup>
        <span>Product name:</span>
        <Input type="text" {...register("name")} size={40} />
      </LabelFormGroup>
      <LabelFormGroup>
        <span>Chemical:</span>
        <ChemicalSearch
          id="chemical-search"
          name={`chemicalId`}
          size={30}
          defaultValue={null}
        />
      </LabelFormGroup>
      <LabelFormGroup>
        <span>Vendor:</span>
        <RhfSelect
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
        </RhfSelect>
      </LabelFormGroup>
      <style jsx global>{`
        .vendor-select {
          min-width: 10rem;
        }
      `}</style>
    </>
  )
}

export default ProductEntry
