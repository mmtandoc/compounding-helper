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

/* 
type DefinePermissions = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

const rolePermissions: Record<Role, DefinePermissions> = {
  [Role.user](user, { can, cannot }) {
    // NOTE: CASL rules do not confirm whether all models in an array have the properties specified in the condition
    // i.e., where type ModelWithA is {a: number} and type ModelWithB = {b: number},
    // `can("read", ["ModelWithA", "ModelWithB"], undefined, { A: { equals: 1 }})`
    // won't cause a typescript error, but will throw a PrismaClientValidationError at runtime since

    can("manage", "Chemical", {
      pharmacyId: user.pharmacyId,
    })
    can("read", "Chemical", {
      pharmacyId: { in: getCentralPharmacyIds() },
    })

    can("manage", "AdditionalChemicalInfo", {
      pharmacyId: user.pharmacyId,
    })

    can("manage", "Product", {
      pharmacyId: user.pharmacyId,
    })
    can("read", "Product", {
      pharmacyId: { in: getCentralPharmacyIds() },
    })

    can("manage", "Vendor", {
      pharmacyId: user.pharmacyId,
    })
    can("read", "Vendor", {
      pharmacyId: { in: getCentralPharmacyIds() },
    })

    can("manage", "SDS", {
      pharmacyId: user.pharmacyId,
    })
    can("read", "SDS", {
      pharmacyId: { in: getCentralPharmacyIds() },
    })

    can("read", ["HazardClass", "HazardCategory"])

    can("manage", "HazardCategoryToSDS", {
      sds: { pharmacyId: user.pharmacyId },
    })
    can("read", "HazardCategoryToSDS", {
      sds: { pharmacyId: { in: getCentralPharmacyIds() } },
    })

    can("manage", "RiskAssessment", {
      pharmacyId: user.pharmacyId,
    })
    can("read", "RiskAssessment", {
      pharmacyId: { in: getCentralPharmacyIds() },
    })

    can("manage", "Compound", {
      pharmacyId: user.pharmacyId,
    })
    can("read", "Compound", {
      pharmacyId: { in: getCentralPharmacyIds() },
    })

    can("manage", "Ingredient", {
      compound: { pharmacyId: user.pharmacyId },
    })
    can("read", "Ingredient", {
      compound: { pharmacyId: { in: getCentralPharmacyIds() } },
    })

    can("manage", "Mfr", {
      compound: { pharmacyId: user.pharmacyId },
    })
    can("read", "Mfr", {
      compound: { pharmacyId: { in: getCentralPharmacyIds() } },
    })

    can("manage", "Link", {
      pharmacyId: user.pharmacyId,
    })
    can("read", "Link", {
      pharmacyId: { in: getCentralPharmacyIds() },
    })

    can("read", "Settings", {
      pharmacyId: user.pharmacyId,
    })

    can("manage", "Routine", {
      pharmacyId: user.pharmacyId,
    })

    can("manage", "RoutineCompletion", {
      routine: { pharmacyId: user.pharmacyId },
    })

    can("read", "Pharmacy", {
      id: { equals: user.pharmacyId },
    })

    can("read", "User", {
      pharmacyId: user.pharmacyId,
    })

    can("manage", "User", { id: { equals: user.id } })
  },
  [Role.admin](user, { can, cannot }) {
    can("manage", "all")
    cannot(["create", "update", "delete"], "User", {
      role: { equals: "superadmin" },
    })
    cannot(["create", "update", "delete"], "Pharmacy", {
      id: { equals: user.pharmacyId },
    })
  },
  [Role.superadmin](user, { can, cannot }) {
    can("manage", "all")
  },
}

export function defineAbilityFor(user: User): AppAbility {
  const builder = new AbilityBuilder(createAppAbility)

  if (user.role === Role.superadmin) {
  }

  if (typeof rolePermissions[user.role] === "function") {
    rolePermissions[user.role](user, builder)
  } else {
    throw new Error(`Trying to use unknown role "${user.role}"`)
  }

  return builder.build()
} */

export function defineAbilityForUser(user: User): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createPrismaAbility,
  )

  /* 
    NOTE: CASL rules do not confirm whether all models in an array have the properties specified in the condition
    i.e., where type ModelWithA is {a: number} and type ModelWithB = {b: number},
    `can("read", ["ModelWithA", "ModelWithB"], undefined, { A: { equals: 1 }})`
    won't cause a typescript error, but will throw a PrismaClientValidationError at runtime since
  */

  // Chemicals
  can("manage", "Chemical", {
    pharmacyId: user.pharmacyId,
  })

  can("read", "Chemical", {
    pharmacyId: { in: getCentralPharmacyIds() },
  })

  can("manage", "AdditionalChemicalInfo", {
    pharmacyId: user.pharmacyId,
  })

  // Products
  can("manage", "Product", {
    pharmacyId: user.pharmacyId,
  })
  can("read", "Product", {
    pharmacyId: { in: getCentralPharmacyIds() },
  })

  // Vendors
  can("manage", "Vendor", {
    pharmacyId: user.pharmacyId,
  })
  can("read", "Vendor", {
    pharmacyId: { in: getCentralPharmacyIds() },
  })

  // SDS Summaries
  can("manage", "SDS", {
    pharmacyId: user.pharmacyId,
  })
  can("read", "SDS", {
    pharmacyId: { in: getCentralPharmacyIds() },
  })

  can("manage", "HazardCategoryToSDS", {
    sds: { is: { pharmacyId: user.pharmacyId } },
  })
  can("read", "HazardCategoryToSDS", {
    sds: { is: { pharmacyId: { in: getCentralPharmacyIds() } } },
  })

  // Hazard Classes & Categories
  can("read", ["HazardClass", "HazardCategory"])

  // Risk Assessments
  can("manage", "RiskAssessment", {
    pharmacyId: user.pharmacyId,
  })
  can("read", "RiskAssessment", {
    pharmacyId: { in: getCentralPharmacyIds() },
  })

  // Compounds
  can("manage", "Compound", {
    pharmacyId: user.pharmacyId,
  })
  can("read", "Compound", {
    pharmacyId: { in: getCentralPharmacyIds() },
  })

  // Ingredients
  can("manage", "Ingredient", {
    compound: { is: { pharmacyId: user.pharmacyId } },
  })
  can("read", "Ingredient", {
    compound: { is: { pharmacyId: { in: getCentralPharmacyIds() } } },
  })

  // MFRs
  can("manage", "Mfr", {
    compound: { is: { pharmacyId: user.pharmacyId } },
  })
  can("read", "Mfr", {
    compound: { is: { pharmacyId: { in: getCentralPharmacyIds() } } },
  })

  // Links
  can("manage", "Link", {
    pharmacyId: user.pharmacyId,
  })
  can("read", "Link", {
    pharmacyId: { in: getCentralPharmacyIds() },
  })

  // Settings
  can("read", "Settings", {
    pharmacyId: user.pharmacyId,
  })

  if (user.role === Role.admin || user.role === Role.superadmin) {
    can("update", "Settings", {
      pharmacyId: user.pharmacyId,
    })
  }

  // Routines
  can("manage", "Routine", {
    pharmacyId: user.pharmacyId,
  })

  can(["create", "read", "update"], "RoutineCompletion", {
    routine: { is: { pharmacyId: user.pharmacyId } },
  })

  // Pharmacies
  can("read", "Pharmacy", {
    id: { equals: user.pharmacyId },
  })

  if (user.role === Role.admin) {
    can("update", "Pharmacy", {
      id: { equals: user.pharmacyId },
    })
  }

  if (user.role === Role.admin) {
    can("delete", "Pharmacy", {
      id: { equals: user.pharmacyId },
    })
  }

  // Users
  can("read", "User", {
    pharmacyId: user.pharmacyId,
  })
  can("manage", "User", { id: { equals: user.id } })

  // Admins can only manage users that aren't admins or superadmins
  if (user.role === Role.admin) {
    can("manage", "User", {
      AND: [
        { pharmacyId: user.pharmacyId },
        { role: { notIn: [Role.admin, Role.superadmin] } },
      ],
    })
  }

  // SuperAdmins can manage all users
  if (user.role === Role.superadmin) {
    can("manage", "User", { pharmacyId: user.pharmacyId })
  }

  return build()
}

export const unauthAbility = createAppAbility()
