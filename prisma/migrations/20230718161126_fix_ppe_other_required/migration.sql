UPDATE "risk_assessments" SET "ppeOther" = NULL WHERE ("ppeOther" = '');
UPDATE "risk_assessments" SET "ppeOtherRequired" = true WHERE "ppeOther" IS NOT NULL;