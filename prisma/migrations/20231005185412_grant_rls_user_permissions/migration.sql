-- need usage of the public schema
GRANT USAGE ON SCHEMA public to rls_user;
-- need access to sequences for creates
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public to rls_user;
-- need access to tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO rls_user;