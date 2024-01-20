import { subject } from "@casl/ability"
import { Role } from "@prisma/client"
import _ from "lodash"
import { useMemo } from "react"
import { UseFormReturn } from "react-hook-form"

import { Input, LabelFormGroup, RhfSelect } from "components/ui/forms"
import { getRoleName } from "components/user/utils"
import { useAbility } from "lib/contexts/AbilityContext"
import { NullableProfileFields } from "lib/fields"
import { useCurrentUser } from "lib/hooks/useCurrentUser"
import UserMapper from "lib/mappers/UserMapper"
import { DataEntryComponent } from "types/common"

type Props = {
  formMethods: UseFormReturn<NullableProfileFields>
}

const ProfileEntry: DataEntryComponent<NullableProfileFields, Props> = (
  props,
) => {
  const { formMethods } = props

  const { register, getValues } = formMethods

  const ability = useAbility()

  const { user } = useCurrentUser()

  const canUpdateRole = useMemo(
    () =>
      ability.can(
        "update",
        subject("User", UserMapper.toModel(getValues() as any) as any),
        "role",
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ability, ability.rules, getValues],
  )

  const allowedRoles = useMemo(() => {
    switch (user?.role) {
      case Role.admin:
        return _.omit(Role, ["admin", "superadmin"])
      case Role.superadmin:
        return Role
      default:
        return {} as Partial<Role>
    }
  }, [user?.role])

  register("id")
  return (
    <>
      <LabelFormGroup>
        <span>Email:</span>
        <Input type="email" {...register("email")} size={40} />
      </LabelFormGroup>
      <LabelFormGroup>
        <span>Role:</span>
        <RhfSelect
          name="role"
          className="role-select"
          disabled={!canUpdateRole}
          initialOption
        >
          {(Object.keys(Role) as Array<Role>).map((v) => (
            <option
              key={v}
              value={v}
              disabled={!Object.keys(allowedRoles).includes(v)}
            >
              {getRoleName(v)}
            </option>
          ))}
        </RhfSelect>
      </LabelFormGroup>
      <style jsx global>{`
        .role-select {
          min-width: 10rem;
        }
      `}</style>
    </>
  )
}

export default ProfileEntry
