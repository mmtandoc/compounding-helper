ALTER TABLE IF EXISTS "Settings"
RENAME TO "settings";

ALTER TABLE IF EXISTS "settings"
DROP CONSTRAINT IF EXISTS "Settings_pkey",
DROP CONSTRAINT IF EXISTS "settings_pkey",
ADD CONSTRAINT "settings_pkey" PRIMARY KEY ("id");

ALTER SEQUENCE IF EXISTS "Settings_id_seq" RENAME TO "settings_id_seq"