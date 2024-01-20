import { createContextualCan, useAbility as useAbilityHook } from "@casl/react"
import { createContext } from "react"

import { AppAbility, unauthAbility } from "lib/auth/ability/appAbilities"

export const AbilityContext = createContext<AppAbility>(unauthAbility)

export const useAbility = () => useAbilityHook(AbilityContext)

export const Can = createContextualCan<AppAbility>(AbilityContext.Consumer)
