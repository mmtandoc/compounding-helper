import { BooleanRadioGroup } from "components/BooleanRadioGroup"
import Link from "next/link"
import { IngredientAll } from "types/models"

interface IngredientDetailsProps {
  ingredient: IngredientAll
}

export const IngredientDetails = (props: IngredientDetailsProps) => {
  const { ingredient } = props

  const sds = ingredient?.safetyDataSheet

  const chemical = sds?.product.chemical

  const isCommercialProduct = !!ingredient.commercialProductName

  return (
    <fieldset className="ingredient-fieldset">
      <div className="row" style={{ alignItems: "stretch" }}>
        <div style={{ flex: 1 }}>
          <div className="row">
            {chemical && (
              <div>
                <span className="label">Chemical name:</span>
                <Link href={`/chemicals/${chemical?.id}`}>
                  <a style={{ whiteSpace: "pre" }}>{chemical?.name}</a>
                </Link>
              </div>
            )}
            <div>
              <span className="label">Physical form:</span>
              <span>{ingredient.physicalForm}</span>
            </div>
          </div>
          <div className="row">
            {sds && (
              <div>
                <span className="label">SDS:</span>

                <Link href={`/sds/${sds.id}`}>
                  <a>
                    <span>{sds.product.name}</span>
                    <span>
                      {" - "}
                      {sds.product.vendor.name}
                    </span>
                    <span>
                      {" - "}
                      {sds.revisionDate.toLocaleDateString("en-CA")}
                    </span>
                  </a>
                </Link>
              </div>
            )}
          </div>
          <div className="row">
            <div>
              <div className="form-group">
                <span className="label">Is a commercial product?</span>
                <BooleanRadioGroup
                  readOnly={true}
                  className="is-commercial-product"
                  selectedValue={isCommercialProduct}
                />
              </div>
              {isCommercialProduct && (
                <>
                  <div className="row">
                    <div>
                      <span className="label">Product name:</span>
                      <span>{ingredient.commercialProductName}</span>
                    </div>
                    <div>
                      <span className="label">Product DIN:</span>
                      <span>{ingredient.commercialProductDin ?? "N/A"}</span>
                    </div>
                  </div>
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
                </>
              )}
            </div>
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
        <div style={{ minWidth: "30%", marginLeft: "auto" }}>
          <fieldset className="safety-info">
            <legend>Safety Information:</legend>
            <div>
              <span className="label">Niosh Table:</span>
              {chemical?.nioshTable === undefined
                ? "N/A"
                : chemical?.nioshTable === -1
                ? "No"
                : `Table ${chemical?.nioshTable}`}
            </div>
            <div>
              <span className="label">SDS HMIS health hazard level:</span>
              <span>{sds?.hmisHealthHazard ?? "N/A"}</span>
            </div>
            <div>
              <span className="label">SDS health hazards:</span>
              {sds ? (
                <ul className="health-hazard-list">
                  {sds.healthHazards.map((h, i) => (
                    <li key={i}>{`${
                      h.hazardCategory.hazardClass.name
                    } - Category ${h.hazardCategory.level}${
                      !h.additionalInfo ? "" : ` (${h.additionalInfo})`
                    }`}</li>
                  ))}
                </ul>
              ) : (
                "N/A"
              )}
            </div>
          </fieldset>
        </div>
      </div>
      <style jsx>{`
        .label {
          margin-right: 0.5rem;
        }
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
        }
      `}</style>
    </fieldset>
  )
}
