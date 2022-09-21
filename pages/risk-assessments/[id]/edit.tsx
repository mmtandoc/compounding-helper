import React, { useState } from "react"
import Layout from "components/Layout"
import { GetServerSideProps, NextPage } from "next"
import RiskAssessmentEntry, {
  NullPartialRiskAssessmentFields,
} from "components/risk-assessment/RiskAssessmentEntry"
import { SubmitHandler, useForm } from "react-hook-form"
import axios from "axios"
import { getRiskAssessmentById } from "pages/api/risk-assessments/[id]"
import { useRouter } from "next/router"
import Link from "next/link"
import RiskAssessmentMapper from "lib/mappers/RiskAssessmentMapper"

type EditRiskAssessmentProps = {
  values: NullPartialRiskAssessmentFields
}

const EditRiskAssessment: NextPage<EditRiskAssessmentProps> = (
  props: EditRiskAssessmentProps,
) => {
  const { values } = props

  const router = useRouter()
  const riskAssessmentId = parseInt(router.query.id as string)

  const [saveSuccessful, setSaveSuccessful] = useState<boolean | undefined>()
  const formMethods = useForm<NullPartialRiskAssessmentFields>()

  const { handleSubmit } = formMethods

  const onSubmit: SubmitHandler<NullPartialRiskAssessmentFields> = async (
    data,
  ) => {
    await axios
      .put(`/api/risk-assessments/${riskAssessmentId}`, data)
      .then((res) => {
        setSaveSuccessful(true)
        router.push(`/risk-assessments/${riskAssessmentId}`)
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
        <h1 style={{ marginTop: "0px" }}>
          Edit Risk Assessment - {values?.compoundName}
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log(errors)
            setSaveSuccessful(false)
          })}
          autoComplete="off"
        >
          <RiskAssessmentEntry values={values} formMethods={formMethods} />
          <div>
            <div className="row">
              <button type="submit">Save</button>
              <Link href={`/risk-assessments/${riskAssessmentId}`} passHref>
                <button type="button">Cancel</button>
              </Link>
            </div>
            {saveSuccessful !== undefined && (
              <p style={{ color: saveSuccessful ? "green" : "red" }}>
                {saveSuccessful ? "Saved" : "Error"}
              </p>
            )}
          </div>
        </form>
      </div>
      <style jsx>{`
        form {
          //width: 90%;
          align-self: center;
        }
        .page {
          margin-bottom: 5rem;
        }
      `}</style>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const riskAssessmentId = parseInt(context.query.id as string)

  if (isNaN(riskAssessmentId)) {
    return { notFound: true }
  }

  const data = await getRiskAssessmentById(riskAssessmentId)

  if (data === null) {
    return { notFound: true }
  }

  return {
    props: {
      values: RiskAssessmentMapper.toFieldValues(data),
    },
  }
}

export default EditRiskAssessment
