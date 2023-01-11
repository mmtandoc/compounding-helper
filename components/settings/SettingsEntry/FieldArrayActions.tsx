import {
  FieldArrayPath,
  FieldArrayWithId,
  FieldValues,
  UseFieldArrayReturn,
} from "react-hook-form"
import { BiCaretDown, BiCaretUp } from "react-icons/bi"
import { MdClose } from "react-icons/md"

import { IconButton } from "components/ui"

type Props<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
> = {
  field: FieldArrayWithId<TFieldValues, TFieldArrayName>
  index: number
  arrayMethods: UseFieldArrayReturn<TFieldValues, TFieldArrayName>
}

const FieldArrayActions = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
>(
  props: Props<TFieldValues, TFieldArrayName>,
) => {
  const {
    arrayMethods: { swap, remove, fields },
    index,
  } = props
  return (
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
      <style jsx>{`
        .row-actions {
          display: flex;
          column-gap: 0.3rem;
          flex-wrap: nowrap;
          margin: 0.2rem 0;
        }
      `}</style>
    </div>
  )
}

export default FieldArrayActions
