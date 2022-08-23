#!/bin/sh

# -e Exit immediately when a command returns a non-zero status.

# -x Print commands before they are executed

set -ex

# Seeding command

#psql -h localhost -p 5432 -U postgres -W -f seed.sql
echo $DATABASE_URL
psql -d $DATABASE_URL -f ./prisma/seed.sql