# Compounding Helper

Compounding Helper is a web app in development meant to assist with the creation and maintenance of risk assessments for non-sterile compounding in Canadian pharmacies.

## Diagrams

### ER diagram

```mermaid
erDiagram
    RiskAssessment }o--|| Compound : "for"
    MFR }o--|| Compound : "for"
    MFR }o--|| RiskAssessment : "references"
    Compound ||--o{ Ingredient : "made from"
    Ingredient }o--o| SDS : "uses"
    Product }o--|| Chemical : "consists of"
    Product }o--|| Vendor : "sold by"
    SDS }o--|| Product : "for"
    HazardClass ||--o{ HazardCategory : "contains"
    HazardCategory |o--o| HazardCategory : "parent of"
    SDS ||--o{ hazard_category_to_sds : ""
    hazard_category_to_sds {
        String additionalInfo  "nullable"
    }
    hazard_category_to_sds }o--|| HazardCategory : ""
```

### Workflow
```mermaid
flowchart LR
    subgraph "Data Entry (if doesn't exist already)"
    A[Enter chemical] -.-> B[Enter product] -.-> C[Enter SDS summary]
    end
    C[Enter SDS summary] -.-> D[Create risk assessment] --> E[Create MFR]
```

## Referenced documents

 - [NAPRA - Guidance Document for Pharmacy Compounding of Non-sterile Preparations](https://www.napra.ca/general-practice-resources/guidance-document-pharmacy-compounding-non-sterile-preparations)
 - [NIOSH List of Antineoplastic and Other Hazardous Drugs in Healthcare Settings](https://www.cdc.gov/niosh/docs/2016-161/default.html)
 - [Globally Harmonized System of Classification and Labelling of Chemicals (GHS Rev. 9, 2021)](https://unece.org/transport/standards/transport/dangerous-goods/ghs-rev9-2021)
