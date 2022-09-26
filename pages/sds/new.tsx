import React, { useState } from "react"
import Layout from "components/Layout"
import { NextPage } from "next"
import { SubmitHandler, useForm } from "react-hook-form"
import axios from "axios"
import { SdsWithHazards } from "types/models"
import Link from "next/link"
import SdsEntry, { NullPartialSdsFields } from "components/sds/SdsEntry"
import { SdsFields } from "types/fields"

const defaultValues: NullPartialSdsFields = {
  id: null,
  chemicalId: null,
  productId: null,
  hmisHazardLevel: null,
  revisionDate: null,
  hazards: [],
  requireVentilation: null,
}

const NewSafetyDataSheet: NextPage = () => {
  const [saveSuccessful, setSaveSuccessful] = useState<boolean | undefined>()
  const [savedId, setSavedId] = useState<number | undefined>()
  const formMethods = useForm<NullPartialSdsFields>()

  const { handleSubmit, reset } = formMethods

  const onSubmit: SubmitHandler<NullPartialSdsFields> = async (data) => {
    console.log(data)
    await axios
      .post<SdsWithHazards>("/api/sds", data as SdsFields)
      .then((res) => {
        setSaveSuccessful(true)
        setSavedId(res.data.id)
      })
      .catch((reason) => {
        //TODO: Handle error
        console.log(JSON.stringify(reason))
        setSaveSuccessful(false)
      })
  }

  return (
    <Layout>
      <div className="page">
        {!saveSuccessful || !savedId ? (
          <>
            <h1>New Safety Data Sheet</h1>
            <form
              onSubmit={handleSubmit(onSubmit, (errors) => {
                console.log(errors)
                setSaveSuccessful(false)
              })}
              autoComplete="off"
            >
              <SdsEntry values={defaultValues} formMethods={formMethods} />
              <div>
                <div className="action-row">
                  <button type="submit">Submit</button>
                  <button type="button" onClick={() => reset()}>
                    Reset
                  </button>
                </div>
                {saveSuccessful !== undefined && (
                  <p style={{ color: saveSuccessful ? "green" : "red" }}>
                    {saveSuccessful ? "Saved" : "Error"}
                  </p>
                )}
              </div>
            </form>
          </>
        ) : (
          <div className="savedPrompt">
            <p style={{ fontSize: "2.4rem", fontWeight: 600 }}>
              The safety data sheet has been saved.
            </p>
            <div style={{ display: "flex", columnGap: "3rem" }}>
              <Link href="/sds/new" passHref>
                <a
                  onClick={() => {
                    setSaveSuccessful(undefined)
                    setSavedId(undefined)
                    reset()
                  }}
                >
                  Create another SDS
                </a>
              </Link>
              <Link href={`/sds/${savedId}`} passHref>
                <a>View created SDS</a>
              </Link>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        h1 {
          margin-top: 0;
        }

        form {
          margin-bottom: 5rem;
          align-self: center;
        }

        .action-row {
          display: flex;
          column-gap: 1rem;
          margin-top: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export default NewSafetyDataSheet
