import { Role } from "@prisma/client"

export const roleMapper = new Map<Role, string>([
  [Role.admin, "Admin"],
  [Role.superadmin, "SuperAdmin"],
  [Role.user, "User"],
  [Role.guest, "Guest"],
])

export const getRoleName = (role: Role) => roleMapper.get(role) ?? role
