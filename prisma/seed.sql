--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.3 (Ubuntu 14.3-1.pgdg20.04+1)

BEGIN;

-- SET statement_timeout = 0;
-- SET lock_timeout = 0;
-- SET idle_in_transaction_session_timeout = 0;
-- SET client_encoding = 'UTF8';
-- SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
-- SET check_function_bodies = false;
-- SET xmloption = content;
-- SET client_min_messages = warning;
-- SET row_security = off;

--
-- Data for Name: chemicals; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt") VALUES (1, 'tetracycline hydrochloride', '64-75-5', '{tetracycline,"tetracycline HCl"}', -1, NULL, '2022-08-14 14:11:31.531');
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt") VALUES (4, 'clindamycin hydrochloride', '21462-39-5', '{clindamycin,"clindamycin HCl"}', -1, NULL, '2022-08-14 14:11:31.531');
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt") VALUES (5, 'hydrocortisone', '50-23-7', '{HC}', -1, NULL, '2022-08-14 14:11:31.531');
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt") VALUES (6, 'clotrimazole', '23593-75-1', '{}', -1, NULL, '2022-08-14 14:11:31.531');
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt") VALUES (7, 'camphor', '76-22-2', '{}', -1, NULL, '2022-09-01 18:28:36.08');
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt") VALUES (2, 'acetylsalicylic acid', '50-78-2', '{Aspirin,ASA}', -1, NULL, '2022-09-05 19:53:38.997');
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt") VALUES (3, 'mitomycin', '50-07-7', '{Mitomycin-C}', 1, NULL, '2022-08-14 14:11:31.531');
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt") VALUES (8, 'nystatin', '1400-61-9', '{}', -1, NULL, '2022-09-29 22:49:50.148');
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt") VALUES (9, 'ketoconazole', '65277-42-1', '{}', -1, NULL, '2022-09-29 22:52:55.937');
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt") VALUES (10, 'terbinafine hydrochloride', '78628-80-5', '{terbinafine,"terbinafine HCl"}', -1, NULL, '2022-09-29 22:55:42.549');
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt") VALUES (11, 'diltiazem hydrochloride', '33286-22-5', '{}', -1, NULL, '2022-10-03 01:08:12.683');
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt") VALUES (12, 'mometasone furoate', '83919-23-7', '{mometasone}', -1, NULL, '2022-10-04 00:28:40.547');


--
-- Data for Name: hazard_classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.hazard_classes (id, name, description) VALUES (1, 'Acute toxicity - Oral', 'Serious adverse health effects (i.e., lethality) occuring after a single or short-term oral exposure to a substance or mixture.');
INSERT INTO public.hazard_classes (id, name, description) VALUES (2, 'Acute toxicity - Dermal', 'Serious adverse health effects (i.e., lethality) occuring after a single or short-term dermal exposure to a substance or mixture.');
INSERT INTO public.hazard_classes (id, name, description) VALUES (3, 'Acute toxicity - Inhalation', 'Serious adverse health effects (i.e., lethality) occuring after a single or short-term inhalation exposure to a substance or mixture.');
INSERT INTO public.hazard_classes (id, name, description) VALUES (4, 'Skin corrosion/irritation', 'The production of irreversible (corrosion) or reversible (irritation) damage to the skin occurring after exposure to a substance or mixture.');
INSERT INTO public.hazard_classes (id, name, description) VALUES (5, 'Serious eye damage/eye irritation', 'The production of damage or changes to the eye after exposure to a substance or mixture.');
INSERT INTO public.hazard_classes (id, name, description) VALUES (6, 'Sensitization - Skin', 'An allergic response occurring after skin contact with a substance or a mixture.');
INSERT INTO public.hazard_classes (id, name, description) VALUES (7, 'Sensitization - Respiratory', 'Hypersensitivity of the airways occurring after inhalation of a substance or a mixture.');
INSERT INTO public.hazard_classes (id, name, description) VALUES (8, 'Germ cell mutagenicity', 'Heritable gene mutations, including heritable stuctural and numerical chromosome aberrations in germ cells occuring after exposure to a substance or mixture.');
INSERT INTO public.hazard_classes (id, name, description) VALUES (9, 'Carcinogenicity', 'The induction of cancer or an increase in the incidence of cancer occurring after exposure to a substance or mixture.');
INSERT INTO public.hazard_classes (id, name, description) VALUES (10, 'Reproductive toxicity', 'Adverse effects on sexual function and fertility in adult males and females, as well as developmental toxicity in the offspring, occurring after exposure to a substance or mixture.');
INSERT INTO public.hazard_classes (id, name, description) VALUES (11, 'Specific target organ toxicity - single exposure', 'Specific, non-lethal toxic effects on target organs occurring after a single exposure to a substance or mixture.');
INSERT INTO public.hazard_classes (id, name, description) VALUES (12, 'Specific target organ toxicity - repeated exposure', 'Specific, non-lethal toxic effects on target organs occurring after a repeated exposure to a substance or mixture.');
INSERT INTO public.hazard_classes (id, name, description) VALUES (13, 'Aspiration hazard', 'Severe acute effects such as chemical pneumonia, pulmonary injury or death occurring after aspiration of a subtance or mixture.');


--
-- Data for Name: hazard_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (1, 3, NULL, '1', 'Fatal if inhaled.', NULL);
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (2, 3, NULL, '2', 'Fatal if inhaled.', NULL);
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (3, 3, NULL, '3', 'Toxic if inhaled.', NULL);
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (4, 3, NULL, '4', 'Harmful if inhaled.', NULL);
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (5, 3, NULL, '5', 'May be harmful if inhaled.', NULL);
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (6, 1, NULL, '5', 'May be harmful if swallowed.', NULL);
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (7, 1, NULL, '4', 'Harmful if swallowed.', NULL);
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (8, 1, NULL, '3', 'Toxic if swallowed.', NULL);
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (9, 1, NULL, '2', 'Fatal if swallowed.', NULL);
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (10, 1, NULL, '1', 'Fatal if swallowed.', NULL);
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (11, 2, NULL, '1', 'Fatal in contact with skin.', NULL);
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (12, 2, NULL, '2', 'Fatal in contact with skin.', NULL);
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (13, 2, NULL, '3', 'Toxic in contact with skin.', NULL);
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (14, 2, NULL, '4', 'Harmful in contact with skin.', NULL);
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (15, 2, NULL, '5', 'May be harmful in contact with skin.', NULL);
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (16, 4, NULL, '3', 'Mild skin irritation.', 'Mild irritation');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (17, 4, NULL, '2', 'Skin irritation.', 'Irritation');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (18, 4, NULL, '1', 'Skin corrosion. Destruction of skin tissue, namely, visible necrosis through the epidermis and into the dermis, in at least one tested animal after exposure ≤ 4 h.', 'Corrosion (≤ 4 h)*');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (19, 4, '1', '1C', 'Skin corrosion. Corrosive responses in at least one animal following exposure > 1 h and ≤ 4 h and observations ≤ 14 days.', 'Corrosion (> 1 h, ≤ 4 h)');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (20, 4, '1', '1B', 'Skin corrosion. Corrosive responses in at least one animal following exposure > 3 min and ≤ 1 h and observations ≤ 14 days.', 'Corrosion (> 3 min, ≤ 1 h)*');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (21, 4, '1', '1A', 'Skin corrosion. Corrosive responses in at least one animal following exposure  ≤ 3 min during an observation period < 1 h.', 'Corrosion (≤ 3 min)*');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (22, 5, NULL, '2', 'Substances that have the potential to induce reversible eye damage.', 'Reversible damage');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (23, 5, NULL, '1', 'Causes serious eye damage. Substances that have potential to seriously damage the eyes.', 'Serious irreversible damage*');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (24, 5, '2', '2B', 'Causes eye irritation.', 'Eye irritation');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (25, 5, '2', '2A', 'Causes serious eye irritation.', 'Serious eye irritation');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (26, 6, NULL, '1', 'May cause an allergic skin reaction. Substance can lead to sensitization by skin contact in a substantial number of persons.', NULL);
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (27, 6, '1', '1B', 'May cause an allergic skin reaction. Substance shows a high frequency of occurrence of sensitization by skin contact in humans and/or a high potency in animals can be presumed to have the potential to produce significant sensitization in humans. Severity of reactions may also be considered.', 'High frequency*');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (28, 6, '1', '1A', 'May cause an allergic skin reaction. Substance shows a low to moderate frequency of occurrence of sensitization by skin contact in humans and/or a low to moderatepotency in animals can be presumed to have the potential to produce sensitization in humans. Severity of reactions may also be considered.', 'Low–moderate frequency');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (29, 7, NULL, '1', 'May cause allergy or asthma symptoms or breathing difficulties if inhaled. Substance that can lead to specific respiratory hypersensitivity.', NULL);
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (30, 7, '1', '1A', 'May cause allergy or asthma symptoms or breathing difficulties if inhaled. Substance shows a high frequency of occurrence of respiratory hypersensitivity. Severity of reaction may also be considered.', 'High frequency*');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (31, 7, '1', '1B', 'May cause allergy or asthma symptoms or breathing difficulties if inhaled. Substance shows a medium to low frequency of occurrence of respiratory hypersensitivity. Severity of reaction may also be considered.', 'Low–moderate frequency');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (32, 8, NULL, '2', 'Suspected of causing genetic defects. Substances which cause concern for humans owing to the possibility that they may induce heritable mutations in the germ cells of humans.', NULL);
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (33, 8, NULL, '1', 'May cause genetic defects. Substance known to induce heritable mutations or to be regarded as if they induce heritable mutations in the germ cells of humans.', NULL);
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (34, 8, '1', '1B', 'May cause genetic defects. Substances which should be regarded as if they induce heritable mutations in the germ cells of humans.', NULL);
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (35, 8, '1', '1A', 'May cause genetic defects. Substances known to induce heritable mutations in germ cells of humans.', NULL);
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (36, 9, NULL, '1', 'Substance is a known or presumed human carcinogen.', 'Known/presumed*');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (37, 9, '1', '1A', 'Substance is known to have carcinogenic potential for humans. The placing of a substance is largely based on human evidence.', 'Known*');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (38, 9, '1', '1B', 'Substance is presumed to have carcinogenic potential for humans. The placing of a substance is largely based on animal evidence.', 'Presumed*');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (39, 9, NULL, '2', 'Substance is a suspected human carcinogen.', 'Suspected');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (40, 10, NULL, '1', 'Substance is a known or presumed human reproduction toxicant.', 'Known/presumed');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (41, 10, '1', '1A', 'Substance is a known human reproductive toxicant. Placing is largely based on human evidence.', 'Known*');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (42, 10, '1', '1B', 'Substance is a presumed human reproductive toxicant. The placing is largely based on animal evidence.', 'Presumed*');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (43, 10, NULL, '2', 'Substance is a suspected human reproductive toxicant.', 'Suspected');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (44, 10, NULL, 'Effects on or via lactation', 'Substances which are absorbed by women and have been shown to interfere with lactation, or which may be present (including metabolites) in breast milk in amounts sufficient to cause concern for the health of a breastfed child.', NULL);
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (45, 11, NULL, '1', 'Substance can produce or can be presumed to produce significant toxicity in humans following single exposure.', 'Significant*');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (46, 11, NULL, '2', 'Substance that can be presumed to have the potential to be harmful to human health following single exposure.', 'Harmful*');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (47, 11, NULL, '3', 'Transient target organ effects. Substance can have target organ effects which adversely alter human function for a short duration after exposure and from which humans may recover in a reasonable period without leaving significant alteration of structure or function.', 'Transient');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (48, 12, NULL, '1', 'Substance that can produce or be presumed to produce significant toxicity in humans following repeated exposure.', 'Significant');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (49, 12, NULL, '2', 'Substance that can be presumed to have the potential to be harmful to human health following repeated exposure.', 'Harmful');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (50, 13, NULL, '1', 'Substance known to or can be regarded as if it cause human aspiration toxicity hazard.', 'Known*');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description, "shortDescription") VALUES (51, 13, NULL, '2', 'Substance which causes concern owing to the presumtion that they cause human aspiration toxicity hazard.', 'Presumption*');


--
-- Data for Name: vendors; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.vendors (id, name) VALUES (1, 'Medisca');
INSERT INTO public.vendors (id, name) VALUES (2, 'Xenex');


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (1, 'TETRACYCLINE HYDROCHLORIDE, USP', 1, 1, '2022-08-14 14:11:31.531');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (2, 'ACETYL SALICYLIC ACID, USP', 2, 1, '2022-08-14 14:11:31.531');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (3, 'MITOMYCIN, USP', 3, 1, '2022-08-14 14:11:31.531');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (4, 'CLINDAMYCIN HYDROCHLORIDE, USP', 4, 1, '2022-08-14 14:11:31.531');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (5, 'CLINDAMYCIN HYDROCHLORIDE CRYSTALLINE POWDER USP', 4, 2, '2022-08-14 14:11:31.531');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (6, 'HYDROCORTISONE, USP/EP (Micronized)', 5, 1, '2022-08-14 14:11:31.531');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (7, 'CLOTRIMAZOLE, USP', 6, 1, '2022-08-14 14:11:31.531');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (8, 'CAMPHOR, USP (Synthetic Crystals)', 7, 1, '2022-09-01 18:45:58.955');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (9, 'NYSTATIN, USP/EP', 8, 1, '2022-09-29 22:59:32.623');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (10, 'KETOCONAZOLE, USP (Micronized)', 9, 1, '2022-09-29 23:00:54.414');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (11, 'TERBINAFINE HYDROCHLORIDE, EP', 10, 1, '2022-09-29 23:01:40.769');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (13, 'DILTIAZEM HYDROCHLORIDE, USP', 11, 1, '2022-10-03 17:19:21.656');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (14, 'DILTIAZEM HYDROCHLORIDE, EP', 11, 1, '2022-10-03 17:20:22.242');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (16, 'MOMETASONE FUROATE, USP', 12, 1, '2022-10-04 00:29:15.524');


--
-- Data for Name: safety_data_sheets; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", filename, "updatedAt") VALUES (1, 1, '2021-04-01', 2, true, 'medisca_0053_04-2021.pdf', '2022-08-14 14:11:31.531');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", filename, "updatedAt") VALUES (2, 2, '2021-04-01', 2, true, 'medisca_0955_04-2021.pdf', '2022-08-14 14:11:31.531');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", filename, "updatedAt") VALUES (3, 3, '2021-03-01', 4, true, 'medisca_0553_03-2021.pdf', '2022-08-14 14:11:31.531');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", filename, "updatedAt") VALUES (5, 5, '2021-09-21', 2, true, 'xenex_CL100X_09-2021.pdf', '2022-08-14 14:11:31.531');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", filename, "updatedAt") VALUES (7, 6, '2021-05-01', 2, false, 'medisca_0009_05-2021.pdf', '2022-08-14 14:11:31.531');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", filename, "updatedAt") VALUES (8, 7, '2021-04-01', 2, false, 'medisca_0019_04-2021.pdf', '2022-08-14 14:11:31.531');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", filename, "updatedAt") VALUES (9, 8, '2022-06-01', 2, true, 'medisca_0386_06-2022.pdf', '2022-09-01 18:51:21.696');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", filename, "updatedAt") VALUES (15, 11, '2021-04-01', 0, true, 'N/A', '2022-09-29 23:04:52.627');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", filename, "updatedAt") VALUES (16, 10, '2021-05-01', 4, true, 'N/A', '2022-09-29 23:10:53.695');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", filename, "updatedAt") VALUES (17, 9, '2021-01-01', 0, true, 'N/A', '2022-09-29 23:42:39.021');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", filename, "updatedAt") VALUES (6, 4, '1969-12-31', 3, false, 'N/A', '2022-10-01 18:15:42.647');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", filename, "updatedAt") VALUES (4, 4, '2021-04-01', 1, true, 'medisca_0005_04-2021.pdf', '2022-08-14 14:11:31.531');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", filename, "updatedAt") VALUES (18, 16, '2021-04-30', 1, true, 'N/A', '2022-10-04 01:04:40.725');


--
-- Data for Name: hazard_category_to_sds; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (1, 1, 17, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (2, 1, 25, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (3, 1, 41, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (4, 1, 44, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (5, 2, 8, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (6, 2, 17, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (7, 2, 25, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (8, 2, 26, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (9, 2, 29, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (10, 2, 32, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (11, 3, 9, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (12, 3, 18, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (13, 3, 23, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (14, 3, 33, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (15, 3, 40, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (16, 4, 6, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (17, 4, 25, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (18, 4, 28, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (19, 5, 17, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (20, 5, 22, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (21, 5, 47, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (23, 7, 24, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (24, 7, 26, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (25, 7, 29, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (26, 7, 43, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (28, 8, 7, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (29, 8, 24, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (30, 9, 17, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (31, 9, 25, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (32, 9, 47, 'Respiratory tract irritation');
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (27, 7, 49, 'Endocrine system');
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (58, 15, 6, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (59, 15, 15, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (60, 15, 17, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (61, 15, 24, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (62, 15, 44, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (63, 16, 8, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (64, 16, 42, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (65, 16, 49, 'adrenal gland, liver');
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (66, 6, 36, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (22, 6, 6, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (67, 18, 6, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (68, 18, 43, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (69, 18, 48, 'endocrine system');


--
-- Data for Name: risk_assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (1, 'test compound', 'Moderate', 'monthly', true, false, 12, 'g', false, false, false, true, false, true, NULL, false, false, true, false, false, false, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 'regular', false, NULL, false, NULL, false, '', false, false, 'A', '{"Do not have appropriate facilities.","Compounding complexity is moderate.","Ingredient # is a cream."}', '{"Additional 1","Additional 2"}', '2022-08-17', '2022-08-17 22:58:39.125');
INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (2, 'TEST COMPOUND', 'Complex', 'monthly', true, true, 5, 'g', false, false, false, true, true, false, 'TEST WORKFLOW INTERRUPTION MITIGATION STANDARDS DESCRIPTION', false, false, true, true, true, false, false, NULL, true, true, false, false, false, NULL, true, 'regular', true, 'designated', true, 'Disposable', true, '', false, false, 'A', '{"(5 g)","Compounding complexity is complex.","Ingredient # is a cream."}', '{"TEST ADDITIONAL RATIONALE 1","TEST ADDITIONAL RATIONALE 2"}', '2022-08-21', '2022-08-21 18:25:01.504');
INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (7, '2%HC in  Cetaphil lotion (or 1%HC)', 'Simple', 'monthly', true, true, 100, 'g', false, false, false, true, false, true, NULL, false, false, false, false, true, false, false, NULL, false, false, false, false, true, 'no product monograph available for Cetaphil lotion', true, 'regular', true, 'designated', true, 'medical', false, '', false, false, 'A', '{"Low frequency.","Small quantity is being used (100 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Safety risks to compounding staff minimized by PPE: Mask (medical), Coat (designated), Gloves (regular)"}', '{"Eye protection not needed to due HC having only 2B","Ventilation not required due to above mitigating measures"}', '2022-09-10', '2022-09-10 14:21:11.959');
INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (13, '1% HC in Ketoderm Cream (or 2 or 2.5%)', 'Simple', 'monthly', true, true, 50, 'g', false, false, false, true, false, true, NULL, false, false, false, false, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, false, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (50 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by use of commercial cream","Safety risks to compounding staff minimized by PPE: Coat (designated), Gloves (regular)"}', '{}', '2022-09-29', '2022-09-30 00:41:02.338');
INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (14, 'HYDERM1% and KETODERM CR 1:1', 'Simple', 'monthly', true, true, 30, 'g', false, false, false, true, false, true, NULL, false, false, false, false, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, false, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (30 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by cream formulation","Safety risks to compounding staff minimized by PPE: Coat (designated), Gloves (regular)"}', '{}', '2022-09-29', '2022-09-30 00:46:17.683');
INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (15, 'CLOTRIMADERM1%CR AND HYDERM 1% CR 1:1', 'Simple', 'weekly', true, true, 30, 'g', false, false, false, true, false, true, NULL, false, false, false, false, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', true, 'non medical', false, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (30 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by cream formulation","Safety risks to compounding staff minimized by PPE: Mask (non medical), Coat (designated), Gloves (regular)"}', '{}', '2022-09-29', '2022-09-30 00:59:54.566');
INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (16, '1% HC in LAMISIL cream (or 2,2.5%HC)', 'Simple', 'monthly', true, true, 50, 'g', false, false, false, true, false, true, NULL, false, false, false, false, false, true, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', true, 'non medical', false, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (50 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by use of commercial cream","Safety risks to compounding staff minimized by PPE: Mask (non medical), Coat (designated), Gloves (regular)"}', '{"Mask to minimize inhalation of the HC powder to reduce \"target organ toxicity\" since a common compounding ingredient"}', '2022-09-29', '2022-09-30 01:07:24.764');
INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (12, '1% HYDROCORTISONE IN NYADERM CREAM', 'Simple', 'monthly', true, true, 50, 'g', false, false, false, true, false, true, NULL, false, false, false, false, true, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', true, 'Non medical', false, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (50 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by use of commercial cream","Safety risks to compounding staff minimized by PPE: Mask (Non medical), Coat (designated), Gloves (regular)"}', '{"Mask recommended to reduce risk of inhalation of HC powder to prevent target organ toxicity with repeated exposure"}', '2022-09-29', '2022-09-30 01:09:25.127');
INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (3, 'TEST COMPOUND 2', 'Complex', 'monthly', true, true, 5, 'g', false, false, false, true, true, false, 'TEST WORKFLOW INTERRUPTION MITIGATION STANDARDS DESCRIPTION', false, false, true, true, true, false, false, NULL, true, true, false, false, false, NULL, false, NULL, true, 'designated', true, 'Disposable', true, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (5 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is complex.","Health hazards minimized by cream formulation","Safety risks to compounding staff minimized by PPE: Mask (Disposable), Eye protection, Coat (designated)"}', '{"TEST ADDITIONAL RATIONALE 1"}', '2022-08-26', '2022-10-02 00:57:06.573');
INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (17, 'NEW TEST COMPOUND', 'Moderate', 'daily', false, false, 100, 'g', false, false, false, false, false, true, NULL, false, false, false, false, false, false, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, false, NULL, false, NULL, false, '', false, false, 'C', '{"Non-NIOSH ingredients.","Low concentration.","Compounding complexity is moderate.","Health hazards minimized by cream formulation"}', '{}', '2022-10-01', '2022-10-02 19:33:40.637');
INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (10, '2% CLINDAMYCIN IN NEOSTRATA SOLUTION ', 'Simple', 'monthly', true, true, 100, 'ml', false, false, false, true, false, true, NULL, false, false, true, true, false, false, false, NULL, false, true, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, true, '', false, false, 'A', '{"Low frequency.","Small quantity is being used (100 ml)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Safety risks to compounding staff minimized by PPE: Eye protection, Coat (designated), Gloves (regular)"}', '{"Ventilitation not rquired due to above mitigating mesures","Eye protection required due to Eye damage hazard: category 2 reversible damage"}', '2022-09-10', '2022-10-03 00:36:18.606');
INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (4, '1% HC POWDER IN CLOTRIMADERM CREAM  (or 1.5%, 2% OR 2.5%HC)                  ', 'Simple', 'monthly', true, true, 50, 'g', false, false, false, true, true, true, NULL, true, false, false, true, true, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', true, 'non medical', false, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (50 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by use of commercial cream","Safety risks to compounding staff minimized by PPE: Mask (non medical), Coat (designated), Gloves (regular)"}', '{"VENTILATION NOT NEEDED DUE TO THE ABOVE ASSESSMENT RATIONALE","EYE PROTECTION NOT NEEDED SINCE ONLY CATEGORY 2B","MINIMIZED RISK DUE TO USE OF COMMERCIAL CREAM","MASK RECOMMENDED TO MINIMIZE HAZARD VIA INHALATION OF THIS LIGHT WEIGHT POWDER"}', '2022-09-03', '2022-10-03 00:38:34.506');
INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (8, '1% CLINDAMYCIN IN GLAXAL BASE CREAM', 'Simple', 'monthly', true, true, 100, 'g', false, false, false, true, false, true, NULL, false, false, true, true, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, true, '', false, false, 'A', '{"Low frequency.","Small quantity is being used (100 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by use of commercial cream","Safety risks to compounding staff minimized by PPE: Eye protection, Coat (designated), Gloves (regular)"}', '{"Ventilation  not required due to above mitagating measures","Eye protection required due to Eye damage hazard category 2: reversible eye damage"}', '2022-09-10', '2022-10-03 00:32:52.121');
INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (11, '1% HC IN CLOTRIMAZOLE 2% CREAM', 'Simple', 'monthly', true, true, 50, 'g', false, false, false, true, false, true, NULL, false, false, true, true, true, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', true, 'medical', false, '', false, false, 'A', '{"Low frequency.","Small quantity is being used (50 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by use of commercial cream","Safety risks to compounding staff minimized by PPE: Mask (medical), Coat (designated), Gloves (regular)"}', '{"ventilation not needed due to the above mitigating meaures","eye protection not needed since only category 2B","minimized risk due to use of commercial cream","Mask recommended to reduce inhalation of the HC powder"}', '2022-09-11', '2022-10-03 00:39:50.524');
INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (18, 'test', 'Simple', 'monthly', true, true, 100, 'g', false, false, false, true, false, true, NULL, false, false, false, false, false, false, false, NULL, false, false, false, false, false, NULL, false, NULL, false, NULL, false, NULL, false, '', true, true, 'C', '{"Low frequency.","Small quantity is being used (100 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by use of commercial ointment"}', '{}', '2022-10-01', '2022-10-04 17:48:55.354');


--
-- Data for Name: ingredients; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (1, 1, 2, 'cream', NULL, NULL, NULL, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (2, 2, 1, 'cream', 'TEST COMMERCIAL PRODUCT', 123456, true, 'TEST PRODUCT MONOGRAPH CONCERNS');
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (20, 7, 7, 'powder', NULL, NULL, NULL, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (21, 7, NULL, 'liquid', 'Cetaphil lotion', NULL, false, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (32, 13, 7, 'powder', NULL, NULL, NULL, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (33, 13, 16, 'cream', 'KETODERM CREAM', 99999, false, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (34, 14, 7, 'cream', 'HYDERM CREAM', 99999, false, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (35, 14, 16, 'cream', 'KETODERM CREAM', 99999, false, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (36, 15, 8, 'cream', 'CLOTRIMADERM 1% CREAM', 999999, false, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (37, 15, 7, 'cream', 'HYDERM 1% CREAM', 99999, false, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (38, 16, 7, 'powder', NULL, NULL, NULL, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (39, 16, 15, 'cream', 'LAMISIL CREAM', 9999, false, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (30, 12, 7, 'powder', NULL, NULL, NULL, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (31, 12, 17, 'cream', 'NYADERM', 9999999, false, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (3, 3, 1, 'cream', 'TEST COMMERCIAL PRODUCT', 123456, true, 'TEST PRODUCT MONOGRAPH CONCERNS 2');
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (4, 3, 2, 'cream', NULL, NULL, NULL, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (40, 17, 4, 'cream', NULL, NULL, NULL, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (22, 8, 5, 'powder', NULL, NULL, NULL, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (23, 8, NULL, 'cream', 'GLAXAL BASE', NULL, false, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (26, 10, 5, 'powder', NULL, NULL, NULL, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (27, 10, NULL, 'liquid', 'NEOSTRATA SOLUTION', NULL, false, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (5, 4, 7, 'powder', NULL, NULL, NULL, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (6, 4, 8, 'cream', 'CLOTRIMADERM/CANESTEN 1%', 999995, false, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (28, 11, 7, 'powder', NULL, NULL, NULL, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (29, 11, NULL, 'cream', 'CLOTRIMADERM 2% CREAM or CANESTEN 2% CREAM', NULL, false, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (42, 18, NULL, 'ointment', 'PRODUCT NAME', NULL, false, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (41, 18, 3, 'solid', NULL, NULL, NULL, NULL);


--
-- Name: chemicals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chemicals_id_seq', COALESCE(MAX(id), 1), TRUE) FROM public.chemicals;


--
-- Name: hazard_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hazard_categories_id_seq', COALESCE(MAX(id), 1), TRUE) FROM public.hazard_categories;


--
-- Name: hazard_category_to_sds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hazard_category_to_sds_id_seq', COALESCE(MAX(id), 1), TRUE) FROM public.hazard_category_to_sds;


--
-- Name: hazard_classes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hazard_classes_id_seq', COALESCE(MAX(id), 1), TRUE) FROM public.hazard_classes;


--
-- Name: ingredients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ingredients_id_seq', COALESCE(MAX(id), 1), TRUE) FROM public.ingredients;


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', COALESCE(MAX(id), 1), TRUE) FROM public.products;


--
-- Name: risk_assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.risk_assessments_id_seq', COALESCE(MAX(id), 1), TRUE) FROM public.risk_assessments;


--
-- Name: safety_data_sheets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.safety_data_sheets_id_seq', COALESCE(MAX(id), 1), TRUE) FROM public.safety_data_sheets;


--
-- Name: vendors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vendors_id_seq', COALESCE(MAX(id), 1), TRUE) FROM public.vendors;


--
-- PostgreSQL database dump complete
--

COMMIT;