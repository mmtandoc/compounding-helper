-- AlterTable
ALTER TABLE "settings" ADD COLUMN "shortcutSuffixes" JSONB NOT NULL DEFAULT '[]';

UPDATE "settings" SET "shortcutSuffixes" = '[
    { "code": "HC", "description": "Hydrocortisone powder" },
    { "code": "SA", "description": "Salicylic acid" },
    { "code": "CL", "description": "Clindamycin powder" },
    { "code": "MC", "description": "Menthol & camphor" },
    { "code": "ER", "description": "Erythromycin powder" },
    { "code": "MZ", "description": "Miconazole crystals" },
    { "code": "CZ", "description": "Clotrimazole powder" },
    { "code": "AA", "description": "Half & half" }
]' WHERE "id" = 0;