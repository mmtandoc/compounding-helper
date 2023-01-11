import { UseFormReturn, useFieldArray } from "react-hook-form"
import { BiCaretDown, BiCaretUp, BiPlus } from "react-icons/bi"
import { MdClose } from "react-icons/md"

import { IconButton } from "components/ui"
import { Input } from "components/ui/forms"
import { NullPartialMfrFields } from "lib/fields"

type Props = {
  formMethods: UseFormReturn<NullPartialMfrFields>
}
export const QualityControlEntryTable = (props: Props) => {
  const {
    formMethods: { register, control },
  } = props

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "qualityControls",
  })

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Quality Controls</th>
            <th>Expected Specifications</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr key={field.id}>
              <td>
                <Input
                  {...register(`qualityControls.${index}.name`)}
                  fullWidth
                />
              </td>
              <td>
                <Input
                  {...register(
                    `qualityControls.${index}.expectedSpecification`,
                  )}
                  fullWidth
                />
              </td>
              <td>
                <div className="row-actions">
                  <IconButton
                    title="Move down"
                    icon={BiCaretDown}
                    disabled={index + 1 === fields.length}
                    onClick={() => swap(index, index + 1)}
                    size="small"
                  />
                  <IconButton
                    title="Move up"
                    icon={BiCaretUp}
                    disabled={index === 0}
                    onClick={() => swap(index, index - 1)}
                    size="small"
                  />
                  <IconButton
                    title="Remove"
                    icon={MdClose}
                    disabled={fields.length === 1}
                    onClick={() => remove(index)}
                    size="small"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="actions">
        <IconButton
          icon={BiPlus}
          title="Add quality control"
          onClick={() =>
            append(
              {
                name: null,
                expectedSpecification: null,
              },
              { shouldFocus: false },
            )
          }
          size="small"
        >
          Add quality control
        </IconButton>
      </div>
      <style jsx>{`
        //TODO: Move table into separate basic table component with CSS
        table {
          border-collapse: collapse;
          width: 100%;

          &,
          th,
          td {
            border: var(--table-border);
          }

          th,
          td {
            padding: 0 1rem;
          }

          thead {
            background-color: var(--color-table-head-bg);
            th {
              padding: 0;

              &:nth-child(1) {
                width: 30%;
              }

              &:nth-child(2) {
                width: 70%;
              }

              &:last-child {
                width: 1%;
                white-space: nowrap;
              }

              > div {
                padding: 0 1rem;
                display: flex;
                justify-content: center;
                align-items: center;
                column-gap: 0.4rem;
              }
            }
          }
        }

        :global(.row-actions) {
          display: flex;
          column-gap: 0.3rem;
          flex-wrap: nowrap;
          margin: 0.2rem 0;
        }

        .actions {
          margin-top: 1rem;
        }
      `}</style>
    </div>
  )
}
