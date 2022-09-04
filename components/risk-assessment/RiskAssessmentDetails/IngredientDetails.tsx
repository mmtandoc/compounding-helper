import { Chemical, Ingredient, Product, Vendor } from "@prisma/client"
import { BooleanRadioGroup } from "components/BooleanRadioGroup"
import Link from "next/link"
import useSWR from "swr"
import { JsonError } from "types/common"
import { SdsWithHazards } from "types/models"

interface IngredientDetailsProps {
  ingredient: Ingredient
}

export const IngredientDetails = (props: IngredientDetailsProps) => {
  const { ingredient } = props

  const { data: sdsData, error: sdsError } = useSWR<SdsWithHazards, JsonError>(
    !ingredient ? null : `/api/sds/${ingredient.safetyDataSheetId}`,
  )

  const { data: productData, error: productError } = useSWR<Product, JsonError>(
    !sdsData ? null : `/api/products/${sdsData.productId}`,
  )

  const { data: vendorsData, error: vendorsError } = useSWR<
    Vendor[],
    JsonError
  >(`/api/vendors`)

  const { data: chemicalData, error: chemicalError } = useSWR<
    Chemical,
    JsonError
  >(!productData ? null : `/api/chemicals/${productData.chemicalId}`)

  //TODO: Handle error
  if (sdsError) {
    console.log(sdsError)
  }
  if (productError) {
    console.log(vendorsError)
  }
  if (vendorsError) {
    console.log(vendorsError)
  }
  if (chemicalError) {
    console.log(chemicalError)
  }

  //TODO: Handle loading better

  const isLoading = !chemicalData || !sdsData || !vendorsData || !productData

  if (isLoading) {
    return <div>Loading...</div>
  }

  const vendor = vendorsData.find(
    (v) => v.id === productData.vendorId,
  ) as Vendor

  const isCommercialProduct = !!ingredient.commercialProductDin

  return (
    <fieldset className="ingredient-fieldset">
      <div className="row" style={{ alignItems: "stretch" }}>
        <div className="col">
          <div className="row">
            <div>
              <span className="label">Chemical name: </span>
              <Link href={`/chemicals/${chemicalData.id}`}>
                <a style={{ whiteSpace: "pre" }}>{chemicalData.name}</a>
              </Link>
              {/* <button type="button">...</button> */}
            </div>
            <div>
              <span className="label">Physical form: </span>
              <span>{ingredient.physicalForm}</span>
            </div>
          </div>
          <div className="row">
            <div>
              <span className="label">SDS: </span>
              <Link href={`/sds/${sdsData.id}`}>
                <a style={{ whiteSpace: "pre" }}>
                  {productData.name} - {vendor.name} -{" "}
                  {sdsData.revisionDate.toLocaleDateString()}
                </a>
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <span className="label">Is a commercial product?</span>
                <BooleanRadioGroup
                  readOnly={true}
                  className="is-commercial-product"
                  selectedValue={isCommercialProduct}
                />
              </div>
              {isCommercialProduct && (
                <div className="form-group">
                  <span
                    className={`label ${
                      !ingredient.commercialProductName ? "disabled" : ""
                    }`}
                  >
                    Does the product monograph have any concerns?
                  </span>
                  <BooleanRadioGroup
                    readOnly={true}
                    className="has-product-monograph-concerns"
                    selectedValue={ingredient.hasProductMonographConcerns}
                  />
                </div>
              )}
            </div>
            {isCommercialProduct && (
              <div className="col">
                <div className="form-group">
                  <span
                    className={`label ${
                      !ingredient.commercialProductName ? "disabled" : ""
                    }`}
                  >
                    Product name:
                  </span>
                  <span>{ingredient.commercialProductName}</span>
                </div>
                <div className="form-group">
                  <span
                    className={`label ${
                      !ingredient.commercialProductName ? "disabled" : ""
                    }`}
                  >
                    Product DIN:
                  </span>
                  <span>{ingredient.commercialProductDin}</span>
                </div>
              </div>
            )}
          </div>
          {isCommercialProduct && (
            <div className="row">
              <div
                className={`form-group ${
                  !ingredient.hasProductMonographConcerns ? "hidden" : ""
                }`}
                style={{ width: "100%" }}
              >
                <span className="label">
                  Please describe health concerns on the product monograph:
                </span>
                <textarea
                  cols={30}
                  readOnly={true}
                  value={ingredient.concernsDescription ?? undefined}
                ></textarea>
              </div>
            </div>
          )}
        </div>
        <div className="col" style={{ minWidth: "30%", marginLeft: "auto" }}>
          <fieldset className="safety-info">
            <legend>Safety Information:</legend>
            <div>
              <span className="label" style={{ marginRight: "0.5rem" }}>
                Niosh Table:{" "}
              </span>
              {chemicalData?.nioshTable === undefined
                ? "N/A"
                : chemicalData?.nioshTable === -1
                ? "No"
                : `Table ${chemicalData?.nioshTable}`}
            </div>
            <div>
              <span className="label" style={{ marginRight: "0.5rem" }}>
                SDS HMIS health hazard level:{" "}
              </span>
              <span>{sdsData?.hmisHealthHazard ?? "N/A"}</span>
            </div>
            <div>
              <span className="label">SDS health hazards:</span>
              <ul className="health-hazard-list">
                {sdsData.healthHazards.map((h, i) => (
                  <li key={i}>{`${
                    h.hazardCategory.hazardClass.name
                  } - Category ${h.hazardCategory.level}${
                    !h.additionalInfo ? "" : ` (${h.additionalInfo})`
                  }`}</li>
                ))}
              </ul>
            </div>
          </fieldset>
        </div>
      </div>
      <style jsx>{`
        .health-hazard-list {
          margin-top: 0;
          margin-bottom: 0;
          font-size: 1.3rem;
          padding-left: 2rem;
        }

        .hmis-health-hazard {
          width: min-content;
        }

        .safety-info {
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
      `}</style>
    </fieldset>
  )
}
