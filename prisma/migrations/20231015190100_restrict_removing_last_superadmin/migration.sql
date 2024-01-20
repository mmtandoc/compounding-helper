DROP POLICY IF EXISTS restrict_update_last_superadmin_role ON public.users;

-- Prevent changing the role of a pharmacy's last superadmin.
CREATE POLICY restrict_update_last_superadmin_role ON public.users AS RESTRICTIVE
    FOR UPDATE
        WITH CHECK (
            -- Allow if role is not being modified
            is_not_updating_role(id, role)
            OR NOT (
                -- If the user being updated is a superadmin
                (
                    SELECT
                        role
                    FROM
                        public.users u
                    WHERE
                        u.id = users.id
                ) = 'SuperAdmin'
                -- and they are being changed to a role other than superadmin
                AND role <> 'SuperAdmin'
                -- and they are the last superadmin user in their pharmacy
                AND (
                    SELECT
                        count(*)
                    FROM
                        public.users u
                    WHERE
                        u."pharmacyId" = users."pharmacyId" AND u.role = 'SuperAdmin'
                ) = 1
            )
        );

DROP POLICY IF EXISTS restrict_delete_last_superadmin ON public.users;

-- Prevent deleting a pharmacy's last superadmin user
CREATE POLICY restrict_delete_last_superadmin ON public.users AS RESTRICTIVE
    FOR DELETE
        USING (
            NOT (
                role = 'SuperAdmin'
                AND (
                    SELECT
                        count(*)
                    FROM
                        public.users u
                    WHERE
                        u."pharmacyId" = users."pharmacyId" AND u.role = 'SuperAdmin'
                ) = 1
            )
        );