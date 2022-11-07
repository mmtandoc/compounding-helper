import Link from "next/link"
import React from "react"

import { FormGroup } from "components/common/forms/FormGroup"
import { ProductAll } from "types/models"

type Props = {
  data: ProductAll
}

const ProductDetails = (props: Props) => {
  //TODO: Implement editable SDS component
  const { data } = props

  return (
    <>
      <FormGroup row>
        <span className="label">Product name:</span>
        {data.name}
      </FormGroup>
      <FormGroup row>
        <span className="label">Chemical:</span>
        <Link href={`/chemicals/${data.chemicalId}`}>{data.chemical.name}</Link>
      </FormGroup>
      <FormGroup row>
        <span className="label">Vendor:</span>
        {data.vendor.name}
      </FormGroup>
    </>
  )
}

export default ProductDetails
