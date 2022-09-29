import React from "react"
import { ChemicalAll } from "types/models"
import form from "styles/form"

type Props = {
  data: ChemicalAll
}

const ChemicalDetails = (props: Props) => {
  //TODO: Implement editable SDS component
  const { data } = props

  return (
    <>
      <div className="form-group row">
        <span className="label">Chemical name:</span>
        {data.name}
      </div>
      <div className="form-group row">
        <span className="label">CAS number:</span>
        {data.casNumber}
      </div>
      <div className="form-group row">
        <span className="label">Synonyms:</span>
        {data.synonyms.length > 0 ? data.synonyms.join(", ") : "None"}
      </div>
      <div className="form-group row">
        <span className="label">NIOSH Table:</span>
        {data.nioshTable === -1 ? "N/A" : data.nioshTable}
      </div>
      <div className="form-group row">
        <span className="label">NIOSH revision date: </span>
        {data.nioshRevisionDate?.toLocaleDateString("en-CA") ?? "N/A"}
      </div>
      <style jsx global>
        {form}
      </style>
      <style jsx>{`
        .health-hazard-list {
          margin-top: 0;
        }
      `}</style>
    </>
  )
}

export default ChemicalDetails
