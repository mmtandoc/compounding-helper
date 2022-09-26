import Link from "next/link"
import React from "react"
import { SdsWithRelations } from "types/models"

type Props = {
  data: SdsWithRelations[]
}

//TODO: Allow searching & sorting, add option to hide old revisions
const SdsTable = (props: Props) => {
  const { data } = props

  return (
    <table className="risk-assessments-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Chemical</th>
          <th>Product</th>
          <th>Vendor</th>
          <th>Revision Date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data.map((sds, i) => (
          <tr key={i}>
            <td>{sds.id}</td>
            <td>{sds.product.chemical.name}</td>
            <td>{sds.product.name}</td>
            <td>{sds.product.vendor.name}</td>
            <td>{sds.revisionDate.toLocaleDateString("en-CA")}</td>
            <td>
              <Link href={`/sds/${sds.id}`} passHref>
                <button type="button">View</button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
      <style jsx>{`
        table {
          border-collapse: collapse;
        }
        table,
        th,
        :global(td) {
          border: black solid 1px;
        }

        thead {
          background-color: lightgray;
        }

        th,
        td {
          padding: 0 1rem;
        }

        td > button {
          display: block;
          margin: auto;
        }
      `}</style>
    </table>
  )
}

export default SdsTable
