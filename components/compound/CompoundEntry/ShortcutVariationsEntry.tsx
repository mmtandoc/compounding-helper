import _ from "lodash"
import { useEffect } from "react"
import { UseFormReturn, useFieldArray } from "react-hook-form"
import { BiCaretDown, BiCaretUp, BiPlus } from "react-icons/bi"
import { MdClose } from "react-icons/md"

import { IconButton } from "components/ui"
import { Fieldset, Input } from "components/ui/forms"
import { NullPartialCompoundFields } from "lib/fields"

const emptyVariationValues = {
  code: null,
  name: null,
}

const ShortcutVariationsEntry = (props: {
  formMethods: UseFormReturn<NullPartialCompoundFields>
}) => {
  const { control, register } = props.formMethods

  const { fields, append, remove, swap, update, replace } = useFieldArray({
    control,
    name: "shortcut.variations",
  })

  useEffect(() => {
    if (fields.length === 0) {
      replace(emptyVariationValues)
    }
  }, [replace, fields])

  return (
    <Fieldset legend="Variations:" className="shortcut-variations">
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr key={field.id}>
              <td>
                <Input
                  className="shortcut-variation"
                  {...register(`shortcut.variations.${index}.code`, {
                    deps: _.range(fields.length)
                      .filter((i) => i !== index)
                      .map((i) => `shortcut.variations.${i}.code`),
                  })}
                  size={5}
                />
              </td>
              <td>
                <Input
                  {...register(`shortcut.variations.${index}.name`)}
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
                    onClick={() =>
                      fields.length > 1
                        ? remove(index)
                        : update(0, emptyVariationValues)
                    }
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
          onClick={() =>
            append(emptyVariationValues, {
              shouldFocus: false,
            })
          }
          size="small"
        >
          Add variation
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
                //width: 1%;
              }

              &:nth-child(2) {
                width: 100%;
              }

              &:last-child {
                //width: 1%;
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

        :global(.shortcut-variation) {
          text-transform: uppercase;
        }
      `}</style>
    </Fieldset>
  )
}

export default ShortcutVariationsEntry
