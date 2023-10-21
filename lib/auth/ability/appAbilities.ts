import { AbilityBuilder, CreateAbility, PureAbility } from "@casl/ability"
import { PrismaQuery, Subjects, createPrismaAbility } from "@casl/prisma"
import {
  AdditionalChemicalInfo,
  Chemical,
  Compound,
  HazardCategory,
  HazardCategoryToSDS,
  HazardClass,
  Ingredient,
  Link,
  Mfr,
  Pharmacy,
  Product,
  RiskAssessment,
  Role,
  Routine,
  RoutineCompletion,
  SDS,
  Settings,
  User,
  Vendor,
} from "@prisma/client"

import { getCentralPharmacyIds } from "lib/api/pharmacies"

type AppManageAction = "manage" // "manage" is a special keyword in CASL representing any action
type AppCrudAction = "create" | "read" | "update" | "delete"

export type AppActions = AppManageAction | AppCrudAction

type PrismaSubjects = Subjects<{
  Chemical: Chemical
  AdditionalChemicalInfo: AdditionalChemicalInfo
  Product: Product
  Vendor: Vendor
  SDS: SDS
  HazardClass: HazardClass
  HazardCategory: HazardCategory
  HazardCategoryToSDS: HazardCategoryToSDS
  RiskAssessment: RiskAssessment
  Compound: Compound
  Ingredient: Ingredient
  Mfr: Mfr
  Link: Link
  Settings: Settings
  Routine: Routine
  RoutineCompletion: RoutineCompletion
  Pharmacy: Pharmacy
  User: User
}>

export type AppSubjects =
  | "all" // "all" is a special keyword in CASL representing any subject
  | PrismaSubjects

export type AppAbility = PureAbility<[AppActions, AppSubjects], PrismaQuery>

export const createAppAbility = createPrismaAbility as CreateAbility<AppAbility>

export function defineRulesForUser(user: User) {
  const { can, cannot, rules } = new AbilityBuilder<AppAbility>(
    createPrismaAbility,
  )

  /* 
    NOTE: CASL rules do not confirm whether all models in an array have the properties specified in the condition
    i.e., where type ModelWithA is {a: number} and type ModelWithB = {b: number},
    `can("read", ["ModelWithA", "ModelWithB"], undefined, { A: { equals: 1 }})`
    won't cause a typescript error, but will throw a PrismaClientValidationError at runtime since
  */

  const otherCentralPharmacyIds = getCentralPharmacyIds().filter(
    (id) => id !== user.pharmacyId,
  )

  // Chemicals
  if (user.role === Role.guest) {
    can("read", "Chemical", {
      pharmacyId: user.pharmacyId,
    })
    cannot(["create", "update", "delete"], "Chemical", {
      pharmacyId: user.pharmacyId,
    }).because("Guests are not allowed to modify records.")
  } else {
    can("manage", "Chemical", {
      pharmacyId: user.pharmacyId,
    })
  }

  can("read", "Chemical", {
    pharmacyId: { in: otherCentralPharmacyIds },
  })

  cannot(["create", "update", "delete"], "Chemical", {
    pharmacyId: { in: otherCentralPharmacyIds },
  }).because("User is not allow to create/update/delete central records")

  if (user.role === Role.guest) {
    can("read", "AdditionalChemicalInfo", {
      pharmacyId: user.pharmacyId,
    })
    cannot(["create", "update", "delete"], "AdditionalChemicalInfo", {
      pharmacyId: user.pharmacyId,
    }).because("Guests are not allowed to modify records.")
  } else {
    can("manage", "AdditionalChemicalInfo", {
      pharmacyId: user.pharmacyId,
    })
  }

  // Products

  if (user.role === Role.guest) {
    can("read", "Product", {
      pharmacyId: user.pharmacyId,
    })
    cannot(["create", "update", "delete"], "Product", {
      pharmacyId: user.pharmacyId,
    }).because("Guests are not allowed to modify records.")
  } else {
    can("manage", "Product", {
      pharmacyId: user.pharmacyId,
    })
  }

  can("read", "Product", {
    pharmacyId: { in: otherCentralPharmacyIds },
  })
  cannot(["create", "update", "delete"], "Product", {
    pharmacyId: { in: otherCentralPharmacyIds },
  }).because("User is not allow to create/update/delete central records")

  // Vendors
  if (user.role === Role.guest) {
    can("read", "Vendor", {
      pharmacyId: user.pharmacyId,
    })
    cannot(["create", "update", "delete"], "Vendor", {
      pharmacyId: user.pharmacyId,
    }).because("Guests are not allowed to modify records.")
  } else {
    can("manage", "Vendor", {
      pharmacyId: user.pharmacyId,
    })
  }

  can("read", "Vendor", {
    pharmacyId: { in: otherCentralPharmacyIds },
  })
  cannot(["create", "update", "delete"], "Vendor", {
    pharmacyId: { in: otherCentralPharmacyIds },
  }).because("User is not allow to create/update/delete central records")

  // SDS Summaries
  if (user.role === Role.guest) {
    can("read", "SDS", {
      pharmacyId: user.pharmacyId,
    })
    cannot(["create", "update", "delete"], "SDS", {
      pharmacyId: user.pharmacyId,
    }).because("Guests are not allowed to modify records.")
  } else {
    can("manage", "SDS", {
      pharmacyId: user.pharmacyId,
    })
  }

  can("read", "SDS", {
    pharmacyId: { in: otherCentralPharmacyIds },
  })
  cannot(["create", "update", "delete"], "SDS", {
    pharmacyId: { in: otherCentralPharmacyIds },
  }).because("User is not allow to create/update/delete central records")

  if (user.role === Role.guest) {
    can("read", "HazardCategoryToSDS", {
      sds: { is: { pharmacyId: user.pharmacyId } },
    })
    cannot(["create", "update", "delete"], "HazardCategoryToSDS", {
      sds: { is: { pharmacyId: user.pharmacyId } },
    }).because("Guests are not allowed to modify records.")
  } else {
    can("manage", "HazardCategoryToSDS", {
      sds: { is: { pharmacyId: user.pharmacyId } },
    })
  }

  can("read", "HazardCategoryToSDS", {
    sds: { is: { pharmacyId: { in: otherCentralPharmacyIds } } },
  })
  cannot(["create", "update", "delete"], "HazardCategoryToSDS", {
    sds: { is: { pharmacyId: { in: otherCentralPharmacyIds } } },
  }).because("User is not allow to create/update/delete central records")

  // Hazard Classes & Categories
  can("read", ["HazardClass", "HazardCategory"])

  // Risk Assessments
  if (user.role === Role.guest) {
    can("read", "RiskAssessment", {
      pharmacyId: user.pharmacyId,
    })
    cannot(["create", "update", "delete"], "RiskAssessment", {
      pharmacyId: user.pharmacyId,
    }).because("Guests are not allowed to modify records.")
  } else {
    can("manage", "RiskAssessment", {
      pharmacyId: user.pharmacyId,
    })
  }

  can("read", "RiskAssessment", {
    pharmacyId: { in: otherCentralPharmacyIds },
  })
  cannot(["create", "update", "delete"], "RiskAssessment", {
    pharmacyId: { in: otherCentralPharmacyIds },
  }).because("User is not allow to create/update/delete central records")

  // Compounds
  if (user.role === Role.guest) {
    can("read", "Compound", {
      pharmacyId: user.pharmacyId,
    })
    cannot(["create", "update", "delete"], "Compound", {
      pharmacyId: user.pharmacyId,
    }).because("Guests are not allowed to modify records.")
  } else {
    can("manage", "Compound", {
      pharmacyId: user.pharmacyId,
    })
  }

  can("read", "Compound", {
    pharmacyId: { in: otherCentralPharmacyIds },
  })
  cannot(["create", "update", "delete"], "Compound", {
    pharmacyId: { in: otherCentralPharmacyIds },
  }).because("User is not allow to create/update/delete central records")

  // Ingredients
  if (user.role === Role.guest) {
    can("read", "Ingredient", {
      compound: { is: { pharmacyId: user.pharmacyId } },
    })
    cannot(["create", "update", "delete"], "Ingredient", {
      compound: { is: { pharmacyId: user.pharmacyId } },
    }).because("Guests are not allowed to modify records.")
  } else {
    can("manage", "Ingredient", {
      compound: { is: { pharmacyId: user.pharmacyId } },
    })
  }

  can("read", "Ingredient", {
    compound: { is: { pharmacyId: { in: otherCentralPharmacyIds } } },
  })
  cannot(["create", "update", "delete"], "Ingredient", {
    compound: { is: { pharmacyId: { in: otherCentralPharmacyIds } } },
  }).because("User is not allow to create/update/delete central records")

  // MFRs
  if (user.role === Role.guest) {
    can("read", "Mfr", {
      compound: { is: { pharmacyId: user.pharmacyId } },
    })
    cannot(["create", "update", "delete"], "Mfr", {
      compound: { is: { pharmacyId: user.pharmacyId } },
    }).because("Guests are not allowed to modify records.")
  } else {
    can("manage", "Mfr", {
      compound: { is: { pharmacyId: user.pharmacyId } },
    })
  }

  can("read", "Mfr", {
    compound: { is: { pharmacyId: { in: otherCentralPharmacyIds } } },
  })
  cannot(["create", "update", "delete"], "Mfr", {
    compound: { is: { pharmacyId: { in: otherCentralPharmacyIds } } },
  }).because("User is not allow to create/update/delete central records")

  // Links
  if (user.role === Role.guest) {
    can("read", "Link", {
      pharmacyId: user.pharmacyId,
    })
    cannot(["create", "update", "delete"], "Link", {
      pharmacyId: user.pharmacyId,
    }).because("Guests are not allowed to modify records.")
  } else {
    can("manage", "Link", {
      pharmacyId: user.pharmacyId,
    })
  }

  can("read", "Link", {
    pharmacyId: { in: otherCentralPharmacyIds },
  })

  cannot(["create", "update", "delete"], "Link", {
    pharmacyId: { in: otherCentralPharmacyIds },
  }).because("User is not allow to create/update/delete central records")

  // Settings
  can("read", "Settings", {
    pharmacyId: user.pharmacyId,
  })

  if (user.role === Role.admin || user.role === Role.superadmin) {
    can("update", "Settings", {
      pharmacyId: user.pharmacyId,
    })
  } else {
    cannot("update", "Settings", {
      pharmacyId: user.pharmacyId,
    }).because(
      "Current user does not have permission to edit pharmacy settings.",
    )
  }

  // Routines
  if (user.role === Role.guest) {
    can("read", "Routine", {
      pharmacyId: user.pharmacyId,
    })

    cannot(["create", "update", "delete"], "Routine", {
      pharmacyId: user.pharmacyId,
    }).because("Guests are not allowed to modify records.")

    can("read", "RoutineCompletion", {
      routine: { is: { pharmacyId: user.pharmacyId } },
    })

    cannot(["create", "update", "delete"], "RoutineCompletion", {
      routine: { is: { pharmacyId: user.pharmacyId } },
    }).because("Guests are not allowed to modify records.")
  } else {
    can("manage", "Routine", {
      pharmacyId: user.pharmacyId,
    })

    can(["create", "read", "update"], "RoutineCompletion", {
      routine: { is: { pharmacyId: user.pharmacyId } },
    })
  }

  // Pharmacies
  can("read", "Pharmacy", {
    id: { equals: user.pharmacyId },
  })

  if (user.role === Role.admin || user.role === Role.superadmin) {
    can("update", "Pharmacy", {
      id: { equals: user.pharmacyId },
    })
  }

  if (user.role === Role.superadmin) {
    can("delete", "Pharmacy", {
      id: { equals: user.pharmacyId },
    })
  }

  // Users

  // Admins can only manage other users that aren't admins or superadmins
  if (user.role === Role.admin) {
    can("manage", "User", {
      AND: [
        {
          id: { not: { equals: user.id } },
        },
        { pharmacyId: user.pharmacyId },
        { role: { notIn: [Role.admin, Role.superadmin] } },
      ],
    })
    ;["update", "delete"].forEach((action) => {
      cannot(action as AppActions, "User", {
        AND: [
          {
            id: { not: { equals: user.id } },
          },
          { pharmacyId: user.pharmacyId },
          { role: { in: [Role.admin, Role.superadmin] } },
        ],
      }).because("Admins are unable to modify other Admin/SuperAdmin users.")
    })
  }

  // SuperAdmins can manage all users
  if (user.role === Role.superadmin) {
    can("manage", "User", { pharmacyId: user.pharmacyId })
  }

  can("read", "User", {
    pharmacyId: user.pharmacyId,
  })
  can("update", "User", { id: { equals: user.id } })

  cannot("delete", "User", { id: { equals: user.id } }).because(
    "User is unable to delete their own account.",
  )

  // Guests and regular users cannot change their roles
  if (user.role === Role.guest || user.role === Role.user) {
    cannot("update", "User", "role", { id: { equals: user.id } })
  }

  return rules
}

export function defineAbilityForUser(user: User): AppAbility {
  const rules = defineRulesForUser(user)

  return createPrismaAbility(rules)
}

export const unauthAbility = createAppAbility()
