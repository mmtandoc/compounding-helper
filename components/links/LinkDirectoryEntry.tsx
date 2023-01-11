import { useEffect } from "react"
import {
  UseFieldArrayReturn,
  UseFormReturn,
  useFieldArray,
} from "react-hook-form"
import { BiCaretDown, BiCaretUp, BiPlus } from "react-icons/bi"
import { MdClose } from "react-icons/md"
import { Simplify } from "type-fest"

import { IconButton } from "components/ui"
import { Input, LabelFormGroup } from "components/ui/forms"
import { NullPartialLinkDirectoryFields } from "lib/fields"

type Props = {
  formMethods: UseFormReturn<NullPartialLinkDirectoryFields>
}

const LinkDirectoryEntry = (props: Props) => {
  const { formMethods } = props
  const arrayMethods = useFieldArray({
    control: formMethods.control,
    name: "links",
  })

  return (
    <div>
      <ul>
        {arrayMethods.fields.map((field, index) => (
          <li key={field.id}>
            <LinkInput
              index={index}
              formMethods={formMethods}
              arrayMethods={arrayMethods}
            />
          </li>
        ))}
      </ul>
      <div className="actions">
        <IconButton
          icon={BiPlus}
          title="Add link"
          onClick={() =>
            arrayMethods.append({
              name: null,
              url: null,
              description: null,
            })
          }
        >
          Add link
        </IconButton>
      </div>
      <style jsx>{`
        ul {
          list-style: none;
          background-color: var(--color-canvas-inset);
          padding: 2rem 2rem 2rem 4rem;
        }

        li {
          display: flex;
          align-items: center;
          border-bottom: var(--border-default);
          padding-block: 1rem;

          > :global(*) {
            flex: 1;
          }

          &::before {
            content: "•";
            width: 2rem;
            text-align: left;
            vertical-align: middle;
            font-size: var(--font-size-lg);
          }
        }
      `}</style>
    </div>
  )
}

type LinkInputProps = Simplify<{
  formMethods: UseFormReturn<NullPartialLinkDirectoryFields>
  arrayMethods: UseFieldArrayReturn<NullPartialLinkDirectoryFields, "links">
  index: number
}>

const LinkInput = (props: LinkInputProps) => {
  const { formMethods, arrayMethods, index } = props
  const { register, setValue, watch } = formMethods
  const { remove, swap, fields } = arrayMethods
  const order = watch(`links.${index}.order`)

  useEffect(() => {
    if (order !== index + 1) {
      register(`links.${index}.order`)
      setValue(`links.${index}.order`, index + 1)
    }
  }, [index, register, setValue, order])

  return (
    <div className="link-input">
      <div className="inputs">
        <LabelFormGroup>
          <span>Name:</span>
          <Input {...register(`links.${index}.name`)} fullWidth />
        </LabelFormGroup>
        <LabelFormGroup>
          <span>URL:</span>
          <Input {...register(`links.${index}.url`)} fullWidth />
        </LabelFormGroup>
      </div>
      <div className="actions">
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
          title="Delete"
          icon={MdClose}
          onClick={() => remove(index)}
          size="small"
        />
      </div>
      <style jsx global>{`
        .link-input {
          display: flex;
          column-gap: 0.5rem;
        }
        .inputs {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .form-group {
          align-content: stretch;
          flex-grow: 1;
          width: auto;
        }

        .actions {
          display: inline-flex;
          align-items: center;
          margin-bottom: 0.4rem;
          flex-grow: 0;
        }
      `}</style>
    </div>
  )
}
export default LinkDirectoryEntry
