import { useEffect, useMemo } from "react"
import {
  UseFieldArrayReturn,
  UseFormReturn,
  useFieldArray,
} from "react-hook-form"
import { BiCaretDown, BiCaretUp, BiPlus } from "react-icons/bi"
import { MdClose } from "react-icons/md"
import { Simplify } from "type-fest"

import { IconButton } from "components/ui"
import { Fieldset, Input, LabelFormGroup } from "components/ui/forms"
import { NullableLinkDirectoryFields } from "lib/fields"
import { useCurrentUser } from "lib/hooks/useCurrentUser"
import { isCentralPharmacy } from "lib/utils"

type Props = {
  formMethods: UseFormReturn<NullableLinkDirectoryFields>
}

const LinkDirectoryEntry = (props: Props) => {
  const { formMethods } = props

  //TODO: Change to only use single fieldArray (central or local)?
  const centralArrayMethods = useFieldArray({
    control: formMethods.control,
    name: "centralLinks",
  })

  const localArrayMethods = useFieldArray({
    control: formMethods.control,
    name: "localLinks",
  })

  const { user, error: userError } = useCurrentUser()

  const isCentralUser = useMemo(
    () => isCentralPharmacy(user?.pharmacyId ?? NaN),
    [user?.pharmacyId],
  )

  if (userError) {
    console.error(userError)
  }

  return (
    <div className="link-directory-entry">
      {
        //TODO: Support re-ordering & hiding central links
      }
      {isCentralUser && centralArrayMethods.fields.length > 0 && (
        <Fieldset legend="Central" disabled={!isCentralUser}>
          <ul>
            {centralArrayMethods.fields.map((field, index) => (
              <LinkInput
                key={index}
                name="centralLinks"
                index={index}
                formMethods={formMethods}
                arrayMethods={centralArrayMethods}
                disabled={
                  isCentralPharmacy(field.pharmacyId ?? NaN) && !isCentralUser
                }
              />
            ))}
          </ul>
        </Fieldset>
      )}
      {!isCentralUser && localArrayMethods.fields.length > 0 && (
        <Fieldset legend="Local">
          <ul>
            {localArrayMethods.fields.map((field, index) => (
              <LinkInput
                key={index}
                name="localLinks"
                index={index}
                formMethods={formMethods}
                arrayMethods={localArrayMethods}
                disabled={
                  isCentralPharmacy(field.pharmacyId ?? NaN) && !isCentralUser
                }
              />
            ))}
          </ul>
        </Fieldset>
      )}
      <div className="actions">
        <IconButton
          icon={BiPlus}
          title="Add link"
          onClick={() =>
            (isCentralUser ? centralArrayMethods : localArrayMethods).append({
              name: null,
              url: null,
              description: null,
              order: (isCentralUser ? centralArrayMethods : localArrayMethods)
                .fields.length,
            })
          }
        >
          Add link
        </IconButton>
      </div>
      <style jsx>{`
        .link-directory-entry :global(ul) {
          list-style: none;
          background-color: var(--color-canvas-inset);
          padding: 2rem 2rem 2rem 4rem;
        }

        .link-directory-entry :global(li) {
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

type LinkInputProps<ArrayName extends "centralLinks" | "localLinks"> =
  Simplify<{
    formMethods: UseFormReturn<NullableLinkDirectoryFields>
    name: ArrayName
    arrayMethods: UseFieldArrayReturn<NullableLinkDirectoryFields, ArrayName>
    index: number
    disabled?: boolean // TODO: Rename disabled to readOnly or canEdit?
  }>

const LinkInput = <ArrayName extends "centralLinks" | "localLinks">(
  props: LinkInputProps<ArrayName>,
) => {
  const { name, formMethods, arrayMethods, index, disabled = false } = props
  const { register, setValue, watch } = formMethods
  const { remove, swap, fields } = arrayMethods
  const order = watch(`${name}.${index}.order`)

  useEffect(() => {
    if (order !== index + 1) {
      register(`${name}.${index}.order`)
      setValue(`${name}.${index}.order`, (index + 1) as any)
    }
  }, [index, register, setValue, order, name])

  return (
    <div className="link-input">
      {/* <Fieldset
        className="inputs"
        style={{ border: "none", padding: "0" }}
        disabled={disabled}
      > */}
      <div className="inputs">
        <LabelFormGroup className={disabled ? "disabled" : ""}>
          <span>Name:</span>
          <Input {...register(`${name}.${index}.name`)} fullWidth />
        </LabelFormGroup>
        <LabelFormGroup className={disabled ? "disabled" : ""}>
          <span>URL:</span>
          <Input {...register(`${name}.${index}.url`)} fullWidth />
        </LabelFormGroup>
      </div>
      {/* </Fieldset> */}

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
        {!disabled && (
          <IconButton
            title="Delete"
            icon={MdClose}
            onClick={() => remove(index)}
            size="small"
          />
        )}
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
