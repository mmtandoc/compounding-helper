import Link from "next/link"
import React from "react"

import form from "styles/form"
import { ProductAll } from "types/models"

type Props = {
  data: ProductAll
}

const ProductDetails = (props: Props) => {
  //TODO: Implement editable SDS component
  const { data } = props

  return (
    <>
      <div className="form-group row">
        <span className="label">Product name:</span>
        {data.name}
      </div>
      <div className="form-group row">
        <span className="label">Chemical:</span>
        <Link href={`/chemicals/${data.chemicalId}`}>{data.chemical.name}</Link>
      </div>
      <div className="form-group row">
        <span className="label">Vendor:</span>
        {data.vendor.name}
      </div>
      <style jsx global>
        {form}
      </style>
    </>
  )
}

export default ProductDetails
