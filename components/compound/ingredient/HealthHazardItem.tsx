import { BsInfoCircle } from "react-icons/bs"

import { SdsHealthHazard } from "types/models"

import { HoverTooltip } from "../../common/HoverTooltip"

export const HealthHazardItem = (props: {
  hazard: SdsHealthHazard
  arrowPosition?: "top-start" | "top-end"
}) => {
  const {
    hazard: { additionalInfo, hazardCategory: category },
    arrowPosition = "top-start",
  } = props

  return (
    <li>
      <span className="hazard-class">
        {category.hazardClass.name}
        <HoverTooltip
          className="print-hide"
          tooltipContent={
            <>
              <p className="label">Hazard Class: {category.hazardClass.name}</p>
              <p>{category.hazardClass.description}</p>
            </>
          }
          arrowPosition={arrowPosition}
        >
          <BsInfoCircle style={{ verticalAlign: "initial" }} />
        </HoverTooltip>
      </span>
      {" - "}
      <span className="hazard-category">
        Category {category.level}
        {category.shortDescription ? ` - ${category.shortDescription}` : ""}
        <HoverTooltip
          className="print-hide"
          tooltipContent={
            <>
              <p>
                <span className="label">Hazard Class: </span>
                {category.hazardClass.name}
              </p>
              <p className="label">
                Category {category.level}
                {category.shortDescription
                  ? ` - ${category.shortDescription}`
                  : ""}
              </p>
              <p>{category.description}</p>
            </>
          }
          arrowPosition={arrowPosition}
        >
          <BsInfoCircle style={{ verticalAlign: "initial" }} />
        </HoverTooltip>
      </span>
      <span className="additional-info">
        {!additionalInfo ? "" : ` (${additionalInfo})`}
      </span>
      <style jsx global>{`
        .hazard-class,
        .hazard-category {
          p:not(:last-of-type) {
            margin: 0 0 0.5rem 0;
          }

          //text-decoration: underline dashed var(--color-fg-default);
        }

        .hover-tooltip {
          margin-left: 0.3rem;
          vertical-align: middle;

          &:hover {
            > svg {
              color: var(--color-fg-muted);
            }
          }

          p {
            margin: 0 0;
          }
        }
      `}</style>
    </li>
  )
}
