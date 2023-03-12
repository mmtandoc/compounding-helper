import Link from "next/link"
import React, { useMemo } from "react"
import useSWR from "swr"

import { IngredientDetails } from "components/compound/ingredient/IngredientDetails"
import { Button, Spinner } from "components/ui"
import { Fieldset, FormGroup, TextArea } from "components/ui/forms"
import { SettingsFields } from "lib/fields"
import { CompoundWithIngredients, MfrAll } from "types/models"

import { getHwngShortcutString } from "./helpers"

type Props = {
  data: CompoundWithIngredients
  display?: "all" | "partial"
}

const CompoundDetails = (props: Props) => {
  const { data, display = "all" } = props

  const shortcutVariations = useMemo(
    () => data.shortcutVariations as { code: string; name: string }[] | null,
    [data.shortcutVariations],
  )

  const shortcutString = useMemo(
    () =>
      getHwngShortcutString(data.id, shortcutVariations, data.shortcutSuffix),
    [data.id, shortcutVariations, data.shortcutSuffix],
  )

  const { data: settings, error: settingsError } =
    useSWR<SettingsFields>("/api/settings")

  if (settingsError) {
    console.error(settingsError)
  }

  const shortcutSuffixes = useMemo(() => settings?.shortcutSuffixes, [settings])

  return (
    <div className="compound-details">
      <FormGroup row className="name-shortcut-group">
        <FormGroup row>
          <label>Name:</label>
          <span>{data.name}</span>
        </FormGroup>
        {display === "all" && data.hasShortcut && (
          <Fieldset>
            <FormGroup row className="shortcut">
              <span className="label">HWNG Shortcut:</span>
              <span className="shortcut">{shortcutString}</span>
            </FormGroup>
            <div style={{ marginLeft: "2rem" }}>
              <FormGroup>
                <span className="label">Variations:</span>
                {shortcutVariations ? (
                  <ul className="shortcut-variations-list">
                    {shortcutVariations.map((v, i) => (
                      <li key={i}>
                        {v.code} - {v.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "N/A"
                )}
              </FormGroup>
              <FormGroup row>
                <span className="label">Suffix:</span>
                <FormGroup row>
                  <span>
                    {data.shortcutSuffix ? `${data.shortcutSuffix}` : "N/A"}
                  </span>
                  {data.shortcutSuffix &&
                    shortcutSuffixes?.find(
                      (s) => s.code === data.shortcutSuffix,
                    ) && (
                      <span>
                        {" "}
                        -{" "}
                        {
                          shortcutSuffixes?.find(
                            (s) => s.code === data.shortcutSuffix,
                          )?.description
                        }
                      </span>
                    )}
                </FormGroup>
              </FormGroup>
            </div>
          </Fieldset>
        )}
      </FormGroup>
      <Fieldset legend="Ingredients:">
        {data.ingredients.map((ingredient, index) => (
          <IngredientDetails key={index} ingredient={ingredient} />
        ))}
      </Fieldset>
      {display === "all" && (
        <>
          <FormGroup>
            <span className="label">Notes:</span>
            <TextArea value={data.notes ?? "None"} readOnly autoResize />
          </FormGroup>
          <MfrsActions data={data} />
        </>
      )}
      <style jsx global>{`
        .compound-details > .form-group {
          padding-left: 1.2rem;
        }

        textarea:read-only {
          outline: none;
          resize: none;
        }

        input[type="radio"] {
          accent-color: black;
        }

        .boolean-radio-group label,
        .radio-group label {
          display: flex;
          align-items: center;
        }

        .name-shortcut-group {
          justify-content: space-between;
        }

        .shortcut-variations-list {
          margin-block: 0;
        }
      `}</style>
    </div>
  )
}

const MfrsActions = (props: { data: CompoundWithIngredients }) => {
  const { data } = props

  const { data: mfrs, error: mfrsError } = useSWR<MfrAll[]>(
    `/api/compounds/${data.id}/mfrs`,
  )

  if (mfrsError) {
    console.error(mfrsError)
  }

  const isLoading = !mfrs && !mfrsError
  return (
    <FormGroup row>
      {!isLoading ? (
        <>
          {mfrs && mfrs.length > 0 ? (
            <>
              <Link href={`/compounds/${data.id}/mfrs/latest`}>
                <Button size="small" theme="primary">
                  View latest MFR
                </Button>
              </Link>
              <Link href={`/compounds/${data.id}/mfrs`}>
                <Button size="small">View all MFRs</Button>
              </Link>
            </>
          ) : (
            <Link href={`/compounds/${data.id}/mfrs/new`}>
              <Button size="small">Create MFR</Button>
            </Link>
          )}
        </>
      ) : (
        <Spinner />
      )}
    </FormGroup>
  )
}

export default CompoundDetails
