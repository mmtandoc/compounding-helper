import React from "react"

import { Fieldset, FormGroup, TextArea } from "components/ui/forms"
import { toIsoDateString } from "lib/utils"
import { ChemicalAll } from "types/models"

type Props = {
  data: ChemicalAll
}

const ChemicalDetails = (props: Props) => {
  //TODO: Implement editable SDS component
  const { data } = props

  return (
    <>
      <FormGroup row>
        <span className="label">Chemical name:</span>
        {data.name}
      </FormGroup>
      <FormGroup row>
        <span className="label">CAS number:</span>
        {data.casNumber ?? "N/A"}
      </FormGroup>
      <FormGroup row>
        <span className="label">Synonyms:</span>
        {data.synonyms.length > 0 ? data.synonyms.join(", ") : "None"}
      </FormGroup>
      <FormGroup row>
        <span className="label">NIOSH Table:</span>
        {data.nioshTable === -1 ? "N/A" : data.nioshTable}
      </FormGroup>
      <FormGroup row>
        <span className="label">NIOSH revision date: </span>
        {data.nioshRevisionDate
          ? toIsoDateString(data.nioshRevisionDate)
          : "N/A"}
      </FormGroup>
      <Fieldset legend="Additional Info">
        {data.additionalInfo.length ? (
          data.additionalInfo.map((v, i) => (
            <FormGroup key={i}>
              <span className="label">
                {v.pharmacyId ? "Local" : "Central"}
              </span>
              <TextArea value={v.value} cols={20} readOnly autoResize />
            </FormGroup>
          ))
        ) : (
          <span>None</span>
        )}
      </Fieldset>
      <style jsx>{`
        .health-hazard-list {
          margin-top: 0;
        }
      `}</style>
    </>
  )
}

export default ChemicalDetails
