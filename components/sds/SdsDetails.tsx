import Link from "next/link"
import React from "react"

import { BooleanRadioGroup } from "components/BooleanRadioGroup"
import form from "styles/form"
import { SdsWithRelations } from "types/models"

type Props = {
  data: SdsWithRelations
}

const SdsDetails = (props: Props) => {
  const {
    id: sdsId,
    productId,
    hmisHealthHazard,
    revisionDate,
    healthHazards,
    requireVentilation,
    filename,
    product,
  } = props.data
  //TODO: Implement editable SDS component
  return (
    <div>
      <div className="form-group row">
        <span className="label">Chemical</span>
        <Link href={`/chemicals/${product.chemicalId}`}>
          {product.chemical.name}
        </Link>
      </div>
      <div className="form-group row">
        <span className="label">Product: </span>
        <Link href={`/products/${productId}`}>
          {product.name} ({product.vendor.name})
        </Link>
      </div>
      <div className="form-group row">
        <span className="label">Revision date: </span>
        {revisionDate.toLocaleDateString("en-CA")}
      </div>
      <div className="form-group row">
        <span className="label">HMIS Health Hazard Rating: </span>
        {hmisHealthHazard}
      </div>
      <div className="form-group">
        <span className="label">Ventilation required? </span>
        <BooleanRadioGroup
          readOnly={true}
          name="requireVentilation"
          selectedValue={requireVentilation}
        />
      </div>
      <div>
        <span className="label">Health Hazards: </span>
        <ul className="health-hazard-list">
          {!healthHazards || healthHazards.length === 0 ? (
            <li>None</li>
          ) : (
            healthHazards.map((h, i) => (
              <li key={i}>
                {h.hazardCategory.hazardClass.name} - Category{" "}
                {h.hazardCategory.level}
                {!h.additionalInfo ? "" : ` (${h.additionalInfo})`}
                {h.hazardCategory.shortDescription
                  ? ` - ${h.hazardCategory.shortDescription}`
                  : ""}
              </li>
            ))
          )}
        </ul>
      </div>
      <style jsx global>
        {form}
      </style>
      <style jsx>{`
        .health-hazard-list {
          margin-top: 0;
        }
      `}</style>
    </div>
  )
}

export default SdsDetails
