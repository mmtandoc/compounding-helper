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

SET SESSION AUTHORIZATION DEFAULT;

ALTER TABLE public.chemicals DISABLE TRIGGER ALL;

INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt") VALUES (1, 'tetracycline hydrochloride', '64-75-5', '{tetracycline,"tetracycline HCl"}', -1, NULL, '2022-08-14 14:11:31.531');
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt") VALUES (4, 'clindamycin hydrochloride', '21462-39-5', '{clindamycin,"clindamycin HCl"}', -1, NULL, '2022-08-14 14:11:31.531');
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt") VALUES (3, 'Mitomycin', '50-07-7', '{Mitomycin-C}', 1, NULL, '2022-08-14 14:11:31.531');
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt") VALUES (5, 'hydrocortisone', '50-23-7', '{HC}', -1, NULL, '2022-08-14 14:11:31.531');
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt") VALUES (6, 'clotrimazole', '23593-75-1', '{}', -1, NULL, '2022-08-14 14:11:31.531');
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt") VALUES (7, 'camphor', '76-22-2', '{}', -1, NULL, '2022-09-01 18:28:36.08');
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt") VALUES (2, 'acetylsalicylic acid', '50-78-2', '{Aspirin,ASA}', -1, NULL, '2022-09-05 19:53:38.997');


ALTER TABLE public.chemicals ENABLE TRIGGER ALL;

--
-- Data for Name: hazard_classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.hazard_classes DISABLE TRIGGER ALL;

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


ALTER TABLE public.hazard_classes ENABLE TRIGGER ALL;

--
-- Data for Name: hazard_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.hazard_categories DISABLE TRIGGER ALL;

INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (1, 3, NULL, '1', 'Fatal if inhaled.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (2, 3, NULL, '2', 'Fatal if inhaled.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (3, 3, NULL, '3', 'Toxic if inhaled.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (4, 3, NULL, '4', 'Harmful if inhaled.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (5, 3, NULL, '5', 'May be harmful if inhaled.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (6, 1, NULL, '5', 'May be harmful if swallowed.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (7, 1, NULL, '4', 'Harmful if swallowed.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (8, 1, NULL, '3', 'Toxic if swallowed.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (9, 1, NULL, '2', 'Fatal if swallowed.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (10, 1, NULL, '1', 'Fatal if swallowed.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (11, 2, NULL, '1', 'Fatal in contact with skin.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (12, 2, NULL, '2', 'Fatal in contact with skin.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (13, 2, NULL, '3', 'Toxic in contact with skin.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (14, 2, NULL, '4', 'Harmful in contact with skin.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (15, 2, NULL, '5', 'May be harmful in contact with skin.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (16, 4, NULL, '3', 'Mild skin irritation.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (17, 4, NULL, '2', 'Skin irritation.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (18, 4, NULL, '1', 'Skin corrosion. Destruction of skin tissue, namely, visible necrosis through the epidermis and into the dermis, in at least one tested animal after exposure ≤ 4 h.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (19, 4, '1', '1C', 'Skin corrosion. Corrosive responses in at least one animal following exposure > 1 h and ≤ 4 h and observations ≤ 14 days.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (20, 4, '1', '1B', 'Skin corrosion. Corrosive responses in at least one animal following exposure > 3 min and ≤ 1 h and observations ≤ 14 days.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (21, 4, '1', '1A', 'Skin corrosion. Corrosive responses in at least one animal following exposure  ≤ 3 min during an observation period < 1 h.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (22, 5, NULL, '2', 'Substances that have the potential to induce reversible eye damage.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (23, 5, NULL, '1', 'Causes serious eye damage. Substances that have potential to seriously damage the eyes.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (24, 5, '2', '2B', 'Causes eye irritation.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (25, 5, '2', '2A', 'Causes serious eye irritation.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (26, 6, NULL, '1', 'May cause allergy or asthma symptoms or breathing difficulties if inhaled. Substance that can lead to specific respiratory hypersensitivity.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (27, 6, '1', '1B', 'May cause allergy or asthma symptoms or breathing difficulties if inhaled. Substance shows a medium to low frequency of occurrence of respiratory hypersensitivity. Severity of reaction may also be considered.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (28, 6, '1', '1A', 'May cause allergy or asthma symptoms or breathing difficulties if inhaled. Substance shows a high frequency of occurrence of respiratory hypersensitivity. Severity of reaction may also be considered.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (29, 7, NULL, '1', 'May cause an allergic skin reaction. Substance can lead to sensitization by skin contact in a substantial number of persons.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (30, 7, '1', '1A', 'May cause an allergic skin reaction. Substance shows a high frequency of occurrence of sensitization by skin contact in humans and/or a high potency in animals can be presumed to have the potential to produce significant sensitization in humans. Severity of reactions may also be considered.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (31, 7, '1', '1B', 'May cause an allergic skin reaction. Substance shows a low to moderate frequency of occurrence of sensitization by skin contact in humans and/or a low to moderatepotency in animals can be presumed to have the potential to produce sensitization in humans. Severity of reactions may also be considered.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (32, 8, NULL, '2', 'Suspected of causing genetic defects. Substances which cause concern for humans owing to the possibility that they may induce heritable mutations in the germ cells of humans.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (33, 8, NULL, '1', 'May cause genetic defects. Substance known to induce heritable mutations or to be regarded as if they induce heritable mutations in the germ cells of humans.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (34, 8, '1', '1B', 'May cause genetic defects. Substances which should be regarded as if they induce heritable mutations in the germ cells of humans.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (35, 8, '1', '1A', 'May cause genetic defects. Substances known to induce heritable mutations in germ cells of humans.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (36, 9, NULL, '1', 'Substance is a known or presumed human carcinogen.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (37, 9, '1', '1A', 'Substance is known to have carcinogenic potential for humans. The placing of a substance is largely based on human evidence.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (38, 9, '1', '1B', 'Substance is presumed to have carcinogenic potential for humans. The placing of a substance is largely based on animal evidence.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (39, 9, NULL, '2', 'Substance is a suspected human carcinogen.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (40, 10, NULL, '1', 'Substance is a known or presumed human reproduction toxicant.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (41, 10, '1', '1A', 'Substance is a known human productive toxicant. Placing is largely based on human evidence.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (42, 10, '1', '1B', 'Substance is a presumed human reproductive toxicant. The placing is largely based on animal evidence.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (43, 10, NULL, '2', 'Substance is a suspected human reproductive toxicant.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (44, 10, NULL, 'Effects on or via lactation', 'Substances which are absorbed by women and have been shown to interfere with lactation, or which may be present (including metabolites) in breast milk in amounts sufficient to cause concern for the health of a breastfed child.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (45, 11, NULL, '1', 'Substance can produce or can be presumed to produce significant toxicity in humans following single exposure.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (46, 11, NULL, '2', 'Substance that can be presumed to have the potential to be harmful to human health following single exposure.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (47, 11, NULL, '3', 'Transient target organ effects. Substance can have target organ effects which adversely alter human function for a short duration after exposure and from which humans may recover in a reasonable period without leaving significant alteration of structure or function.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (48, 12, NULL, '1', 'Substance that can produce or be presumed to produce significant toxicity in humans following repeated exposure.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (49, 12, NULL, '2', 'Substance that can be presumed to have the potential to be harmful to human health following repeated exposure.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (50, 13, NULL, '1', 'Substance known to or can be regarded as if it cause human aspiration toxicity hazard.');
INSERT INTO public.hazard_categories (id, "hazardClassId", "parentLevel", level, description) VALUES (51, 13, NULL, '2', 'Substance which causes concern owing to the presumtion that they cause human aspiration toxicity hazard.');


ALTER TABLE public.hazard_categories ENABLE TRIGGER ALL;

--
-- Data for Name: vendors; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.vendors DISABLE TRIGGER ALL;

INSERT INTO public.vendors (id, name) VALUES (1, 'Medisca');
INSERT INTO public.vendors (id, name) VALUES (2, 'Xenex');


ALTER TABLE public.vendors ENABLE TRIGGER ALL;

--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.products DISABLE TRIGGER ALL;

INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (1, 'TETRACYCLINE HYDROCHLORIDE, USP', 1, 1, '2022-08-14 14:11:31.531');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (2, 'ACETYL SALICYLIC ACID, USP', 2, 1, '2022-08-14 14:11:31.531');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (3, 'MITOMYCIN, USP', 3, 1, '2022-08-14 14:11:31.531');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (4, 'CLINDAMYCIN HYDROCHLORIDE, USP', 4, 1, '2022-08-14 14:11:31.531');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (5, 'CLINDAMYCIN HYDROCHLORIDE CRYSTALLINE POWDER USP', 4, 2, '2022-08-14 14:11:31.531');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (6, 'HYDROCORTISONE, USP/EP (Micronized)', 5, 1, '2022-08-14 14:11:31.531');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (7, 'CLOTRIMAZOLE, USP', 6, 1, '2022-08-14 14:11:31.531');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (8, 'CAMPHOR, USP (Synthetic Crystals)', 7, 1, '2022-09-01 18:45:58.955');


ALTER TABLE public.products ENABLE TRIGGER ALL;

--
-- Data for Name: safety_data_sheets; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.safety_data_sheets DISABLE TRIGGER ALL;

INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", filename, "updatedAt") VALUES (1, 1, '2021-04-01 00:00:00', 2, true, 'medisca_0053_04-2021.pdf', '2022-08-14 14:11:31.531');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", filename, "updatedAt") VALUES (2, 2, '2021-04-01 00:00:00', 2, true, 'medisca_0955_04-2021.pdf', '2022-08-14 14:11:31.531');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", filename, "updatedAt") VALUES (3, 3, '2021-03-01 00:00:00', 4, true, 'medisca_0553_03-2021.pdf', '2022-08-14 14:11:31.531');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", filename, "updatedAt") VALUES (4, 4, '2021-04-01 00:00:00', 1, true, 'medisca_0005_04-2021.pdf', '2022-08-14 14:11:31.531');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", filename, "updatedAt") VALUES (5, 5, '2021-09-21 00:00:00', 2, true, 'xenex_CL100X_09-2021.pdf', '2022-08-14 14:11:31.531');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", filename, "updatedAt") VALUES (6, 4, '1970-01-01 00:00:00', 3, false, 'medisca_0005_01-1970_test.pdf', '2022-08-14 14:11:31.531');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", filename, "updatedAt") VALUES (7, 6, '2021-05-01 00:00:00', 2, false, 'medisca_0009_05-2021.pdf', '2022-08-14 14:11:31.531');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", filename, "updatedAt") VALUES (8, 7, '2021-04-01 00:00:00', 2, false, 'medisca_0019_04-2021.pdf', '2022-08-14 14:11:31.531');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", filename, "updatedAt") VALUES (9, 8, '2022-06-01 00:00:00', 2, true, 'medisca_0386_06-2022.pdf', '2022-09-01 18:51:21.696');


ALTER TABLE public.safety_data_sheets ENABLE TRIGGER ALL;

--
-- Data for Name: hazard_category_to_sds; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.hazard_category_to_sds DISABLE TRIGGER ALL;

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
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (22, 6, 6, NULL);
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


ALTER TABLE public.hazard_category_to_sds ENABLE TRIGGER ALL;

--
-- Data for Name: risk_assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.risk_assessments DISABLE TRIGGER ALL;

INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (1, 'test compound', 'Moderate', 'monthly', true, false, 12, 'g', false, false, false, true, false, true, NULL, false, false, true, false, false, false, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 'regular', false, NULL, false, NULL, false, '', false, false, 'A', '{"Do not have appropriate facilities.","Compounding complexity is moderate.","Ingredient # is a cream."}', '{"Additional 1","Additional 2"}', '2022-08-17', '2022-08-17 22:58:39.125');
INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (2, 'TEST COMPOUND', 'Complex', 'monthly', true, true, 5, 'g', false, false, false, true, true, false, 'TEST WORKFLOW INTERRUPTION MITIGATION STANDARDS DESCRIPTION', false, false, true, true, true, false, false, NULL, true, true, false, false, false, NULL, true, 'regular', true, 'designated', true, 'Disposable', true, '', false, false, 'A', '{"(5 g)","Compounding complexity is complex.","Ingredient # is a cream."}', '{"TEST ADDITIONAL RATIONALE 1","TEST ADDITIONAL RATIONALE 2"}', '2022-08-21', '2022-08-21 18:25:01.504');
INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (3, 'TEST COMPOUND 2', 'Complex', 'monthly', true, true, 5, 'g', false, false, false, true, true, false, 'TEST WORKFLOW INTERRUPTION MITIGATION STANDARDS DESCRIPTION', false, false, true, true, true, false, false, NULL, true, true, false, false, false, NULL, false, NULL, true, 'designated', true, 'Disposable', true, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (5 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is complex.","Health hazards minimized by cream/ointment formulation","Safety risks to compounding staff minimized by PPE: Mask (Disposable), Eye protection, Coat (designated)"}', '{"TEST ADDITIONAL RATIONALE 1"}', '2022-08-27', '2022-08-27 23:35:28.606');
INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (11, '1% HC IN CLOTRIMAZOLE 2% CREAM', 'Simple', 'monthly', true, true, 50, 'g', false, false, false, true, false, true, NULL, false, false, true, true, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', true, 'medical', false, '', false, false, 'A', '{"Low frequency.","Small quantity is being used (50 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Safety risks to compounding staff minimized by PPE: Mask (medical), Coat (designated), Gloves (regular)"}', '{"ventilation not needed due to the above mitigating meaures","eye protection not needed since only category 2B","minimized risk due to use of commercial cream"}', '2022-09-11', '2022-09-12 00:46:58.621');
INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (7, '2%HC in  Cetaphil lotion (or 1%HC)', 'Simple', 'monthly', true, true, 100, 'g', false, false, false, true, false, true, NULL, false, false, false, false, true, false, false, NULL, false, false, false, false, true, 'no product monograph available for Cetaphil lotion', true, 'regular', true, 'designated', true, 'medical', false, '', false, false, 'A', '{"Low frequency.","Small quantity is being used (100 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Safety risks to compounding staff minimized by PPE: Mask (medical), Coat (designated), Gloves (regular)"}', '{"Eye protection not needed to due HC having only 2B","Ventilation not required due to above mitigating measures"}', '2022-09-10', '2022-09-10 14:21:11.959');
INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (4, '1% HC POWDER IN CLOTRIMADERM CREAM  (or 1.5%, 2% OR 2.5%HC)                  ', 'Simple', 'monthly', true, true, 50, 'g', false, false, false, true, true, true, NULL, true, false, false, true, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, false, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (50 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Safety risks to compounding staff minimized by PPE: Coat (designated), Gloves (regular)"}', '{"VENTILATION NOT NEEDED DUE TO THE ABOVE ASSESSMENT RATIONALE","EYE PROTECTION NOT NEEDED SINCE ONLY CATEGORY 2B","MINIMIZED RISK DUE TO USE OF COMMERCIAL CREAM"}', '2022-09-03', '2022-09-04 16:46:24.376');
INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (10, '2% CLINDAMYCIN IN NEOSTRATA SOLUTION ', 'Simple', 'monthly', true, true, 100, 'ml', false, false, false, true, false, true, NULL, false, false, true, true, false, false, false, NULL, false, true, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, true, '', false, false, 'A', '{"Low frequency.","Small quantity is being used (100 ml)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Safety risks to compounding staff minimized by PPE: Eye protection, Coat (designated), Gloves (regular)"}', '{"Ventilitation not rquired due to above mitigating mesures"}', '2022-09-10', '2022-09-12 00:37:28.118');
INSERT INTO public.risk_assessments (id, "compoundName", complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt") VALUES (8, '1% CLINDAMYCIN IN GLAXAL BASE CREAM', 'Simple', 'monthly', true, true, 100, 'g', false, false, false, true, false, true, NULL, false, false, true, true, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, true, '', false, false, 'A', '{"Low frequency.","Small quantity is being used (100 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Safety risks to compounding staff minimized by PPE: Eye protection, Coat (designated), Gloves (regular)"}', '{"Ventilation  not required due to above mitagating measures"}', '2022-09-10', '2022-09-12 00:29:55.257');


ALTER TABLE public.risk_assessments ENABLE TRIGGER ALL;

--
-- Data for Name: ingredients; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public.ingredients DISABLE TRIGGER ALL;

INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (1, 1, 2, 'cream', NULL, NULL, NULL, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (2, 2, 1, 'cream', 'TEST COMMERCIAL PRODUCT', 123456, true, 'TEST PRODUCT MONOGRAPH CONCERNS');
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (3, 3, 1, 'cream', 'TEST COMMERCIAL PRODUCT', 123456, true, 'TEST PRODUCT MONOGRAPH CONCERNS');
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (4, 3, 2, 'cream', NULL, NULL, NULL, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (20, 7, 7, 'powder', NULL, NULL, NULL, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (21, 7, NULL, 'liquid', 'Cetaphil lotion', NULL, false, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (5, 4, 7, 'powder', NULL, NULL, NULL, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (6, 4, 8, 'cream', 'CLOTRIMADERM/CANESTEN 1%', 999995, false, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (26, 10, 5, 'powder', NULL, NULL, NULL, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (27, 10, NULL, 'liquid', 'NEOSTRATA SOLUTION', NULL, false, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (22, 8, 5, 'powder', NULL, NULL, NULL, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (23, 8, NULL, 'cream', 'GLAXAL BASE', NULL, false, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (28, 11, 7, 'powder', NULL, NULL, NULL, NULL);
INSERT INTO public.ingredients (id, "riskAssessmentId", "safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription") VALUES (29, 11, NULL, 'cream', 'CLOTRIMADERM 2% CREAM or CANESTEN 2% CREAM', NULL, false, NULL);


ALTER TABLE public.ingredients ENABLE TRIGGER ALL;

--
-- Name: chemicals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chemicals_id_seq', 7, true);


--
-- Name: hazard_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hazard_categories_id_seq', 51, true);


--
-- Name: hazard_category_to_sds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hazard_category_to_sds_id_seq', 32, true);


--
-- Name: hazard_classes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hazard_classes_id_seq', 13, true);


--
-- Name: ingredients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ingredients_id_seq', 29, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 8, true);


--
-- Name: risk_assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.risk_assessments_id_seq', 11, true);


--
-- Name: safety_data_sheets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.safety_data_sheets_id_seq', 9, true);


--
-- Name: vendors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vendors_id_seq', 2, true);


--
-- PostgreSQL database dump complete
--

COMMIT;