import _ from "lodash"
import { UseFormReturn, useFieldArray } from "react-hook-form"

import { Button } from "components/ui"
import { Fieldset, FormGroup, Input } from "components/ui/forms"
import { NullPartialSettingsFields } from "lib/fields"

import FieldArrayActions from "./FieldArrayActions"

type ShortcutSuffixesFieldsetProps = {
  formMethods: UseFormReturn<NullPartialSettingsFields>
}
const ShortcutSuffixesFieldset = (props: ShortcutSuffixesFieldsetProps) => {
  const {
    formMethods: { control, register },
  } = props

  const arrayMethods = useFieldArray({
    control,
    name: "shortcutSuffixes",
  })

  return (
    <Fieldset legend="HWNG shortcut suffixes:" className="shortcut-suffixes">
      <div className="shortcut-suffixes-list">
        <FormGroup className="shortcut-suffixes-header" row>
          <div>Code</div>
          <div>Description</div>
        </FormGroup>
        {arrayMethods.fields.map((field, index) => (
          <FormGroup className="shortcut-suffix-item" row key={field.id}>
            <Input
              className="shortcut-suffix-code"
              {...register(`shortcutSuffixes.${index}.code`, {
                deps: _.range(arrayMethods.fields.length)
                  .filter((i2) => i2 !== index)
                  .map((i2) => `shortcutSuffixes.${i2}.code`),
              })}
              fullWidth
            />
            <Input
              {...register(`shortcutSuffixes.${index}.description`)}
              fullWidth
            />

            <FieldArrayActions
              arrayMethods={arrayMethods}
              field={field}
              index={index}
            />
          </FormGroup>
        ))}
      </div>
      <div className="actions">
        <Button
          size="small"
          onClick={() =>
            arrayMethods.append({
              code: null,
              description: null,
            })
          }
        >
          Add new shortcut suffix
        </Button>
      </div>
      <style jsx global>{`
        .shortcut-suffixes-list {
          display: grid;
          grid-template-columns: 1fr 5fr auto;
          column-gap: 1rem;

          > .shortcut-suffixes-header {
            font-weight: 600;

            &::after {
              content: "";
            }
          }

          > .shortcut-suffix-item {
            .shortcut-suffix-code {
              text-transform: uppercase;
            }

            > .form-group {
              display: contents !important;
            }
          }

          > div.form-group {
            display: contents !important;
            width: 100%;
          }
        }

        .shortcut-suffixes > .actions {
          margin-top: 1rem;
        }
      `}</style>
    </Fieldset>
  )
}

export default ShortcutSuffixesFieldset
