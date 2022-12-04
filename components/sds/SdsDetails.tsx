import Link from "next/link"
import React from "react"

import { BooleanRadioGroup } from "components/BooleanRadioGroup"
import { FormGroup } from "components/common/forms/FormGroup"
import { toIsoDateString } from "lib/utils"
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
    product,
  } = props.data
  //TODO: Implement editable SDS component
  return (
    <div>
      <FormGroup row>
        <span className="label">Chemical</span>
        <Link href={`/chemicals/${product.chemicalId}`}>
          {product.chemical.name}
        </Link>
      </FormGroup>
      <FormGroup row>
        <span className="label">Product: </span>
        <Link href={`/products/${productId}`}>
          {product.name} ({product.vendor.name})
        </Link>
      </FormGroup>
      <FormGroup row>
        <span className="label">Revision date: </span>
        {toIsoDateString(revisionDate)}
      </FormGroup>
      <FormGroup row>
        <span className="label">HMIS Health Hazard Rating: </span>
        {hmisHealthHazard}
      </FormGroup>
      <FormGroup>
        <span className="label">Ventilation required? </span>
        <BooleanRadioGroup
          readOnly={true}
          name="requireVentilation"
          selectedValue={requireVentilation}
        />
      </FormGroup>
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
      <style jsx>{`
        .health-hazard-list {
          margin-top: 0;
        }
      `}</style>
    </div>
  )
}

export default SdsDetails
