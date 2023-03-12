BEGIN;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.2 (Ubuntu 15.2-1.pgdg20.04+1)

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

INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (4, 'clindamycin hydrochloride', '21462-39-5', '{clindamycin,"clindamycin HCl"}', -1, NULL, '2022-08-14 14:11:31.531', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (5, 'hydrocortisone', '50-23-7', '{HC}', -1, NULL, '2022-08-14 14:11:31.531', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (6, 'clotrimazole', '23593-75-1', '{}', -1, NULL, '2022-08-14 14:11:31.531', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (7, 'camphor', '76-22-2', '{}', -1, NULL, '2022-09-01 18:28:36.08', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (2, 'acetylsalicylic acid', '50-78-2', '{Aspirin,ASA}', -1, NULL, '2022-09-05 19:53:38.997', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (3, 'mitomycin', '50-07-7', '{Mitomycin-C}', 1, NULL, '2022-08-14 14:11:31.531', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (8, 'nystatin', '1400-61-9', '{}', -1, NULL, '2022-09-29 22:49:50.148', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (9, 'ketoconazole', '65277-42-1', '{}', -1, NULL, '2022-09-29 22:52:55.937', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (10, 'terbinafine hydrochloride', '78628-80-5', '{terbinafine,"terbinafine HCl"}', -1, NULL, '2022-09-29 22:55:42.549', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (12, 'mometasone furoate', '83919-23-7', '{mometasone}', -1, NULL, '2022-10-04 00:28:40.547', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (56, 'ibuprofen', '15687-27-1', '{}', -1, NULL, '2022-10-09 21:09:13.382', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (57, 'lidocaine', '137-58-6', '{}', -1, NULL, '2022-10-09 21:15:53.246', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (58, 'fluorouracil*', '51-21-8', '{}', 1, NULL, '2022-10-09 21:45:21.482', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (54, 'flexible collodion*', NULL, '{}', -1, NULL, '2022-10-11 18:01:55.988', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (50, 'coal tar', NULL, '{}', -1, NULL, '2022-10-11 18:03:18.95', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (36, 'betamethasone', '2152-44-5', '{}', -1, NULL, '2022-10-09 18:56:08.805', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (37, 'clobetasol', '25122-46-7', '{}', -1, NULL, '2022-10-09 18:56:58.785', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (38, 'desonide', '638-94-8', '{}', -1, NULL, '2022-10-09 18:57:35.875', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (39, 'mupirocin', '12650-69-0', '{}', -1, NULL, '2022-10-09 18:58:59.019', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (40, 'menthol', '1490-04-6', '{}', -1, NULL, '2022-10-09 18:59:49.192', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (44, 'miconazole', '22916-47-8', '{}', -1, NULL, '2022-10-09 19:02:35.608', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (45, 'white petrolatum', '8009-03-8', '{}', -1, NULL, '2022-10-09 19:03:33.031', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (47, 'salicyclic acid', '69-72-7', '{}', -1, NULL, '2022-10-09 19:04:45.66', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (48, 'lactic acid*', '50-21-5', '{}', -1, NULL, '2022-10-09 20:30:16.609', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (49, 'trichloroacetic acid *', '76-03-9', '{}', -1, NULL, '2022-10-09 20:30:54.96', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (51, 'amitriptyline*', '549-18-8', '{}', -1, NULL, '2022-10-09 20:31:22.727', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (46, 'progesterone*', '57-83-0', '{}', 2, NULL, '2022-10-09 20:42:29.912', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (53, 'hydroquinone*', '123-31-9', '{}', -1, NULL, '2022-10-09 20:51:23.122', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (55, 'glycerin', '56-81-5', '{}', -1, NULL, '2022-10-09 21:04:14.175', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (11, 'diltiazem hydrochloride*', '33286-22-5', '{diltiazem,"diltiazem HCl"}', -1, NULL, '2022-10-11 20:28:55.89', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (52, 'diclofenac sodium*', '15307-79-6', '{diclofenac}', -1, NULL, '2022-10-11 20:31:55.412', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (35, 'ciclopirox', '41621-49-2', '{}', -1, NULL, '2022-10-12 19:27:12.014', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (59, 'water', '7732-18-5', '{H2O,steam,ice}', -1, NULL, '2022-10-15 20:11:53.987', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (60, 'test2', NULL, '{123,456}', 2, NULL, '2022-12-16 18:15:26.426', NULL);
INSERT INTO public.chemicals (id, name, "casNumber", synonyms, "nioshTable", "nioshRevisionDate", "updatedAt", "additionalInfo") VALUES (1, 'tetracycline hydrochloride', '64-75-5', '{tetracycline,"tetracycline HCl"}', -1, NULL, '2023-03-11 17:56:52.91', 'Additional info
1
2
3
4
5');

--
-- Data for Name: compounds; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (8, '1% CLINDAMYCIN IN GLAXAL BASE CREAM (MFR)', 'TEST NOTES', 'CL', '[]', true);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (16, '1% HC in LAMISIL cream (or 2,2.5%HC) (MFR)', 'vigilance:
Required equipment  
•Amber glass or plastic ointment jar or lacquered metal or plastic ointment tube	•Spatula
•Ointment slab or ointment paper	•Weigh boat or weigh paper
•Scale with 2 or more decimal places	 
Preparation protocol
Weigh the hydrocortisone micronized powder.
Transfer hydrocortisone micronized onto an ointment slab.
Weigh the terbinafine cream.
Gradually add terbinafine cream in successive portions on the ointment slab and stir well after each addition.
Mix until a homogeneous product is obtained.
Transfer into the final container and label.
Final appearance
White or slightly yellowish smooth and homogeneous cream
Packaging
Pack into an amber glass or plastic ointment jar or lacquered metal or plastic ointment tube.', 'HC', '[{"code": "A", "name": "1% Hydrocortosone"}, {"code": "B", "name": "2% Hydrocortosone"}, {"code": "C", "name": "2.5% Hydrocortosone"}]', true);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (10, '2% CLINDAMYCIN IN NEOSTRATA SOLUTION', NULL, 'CL', '[]', true);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (17, 'NEW TEST COMPOUND', NULL, NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (7, '2%HC in  Cetaphil lotion (or 1%HC)', NULL, NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (36, '1% CLINDAMYCIN IN CETAPHIL LOTION (MFR)', NULL, NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (14, 'HYDERM1% and KETODERM CR     1:1 (MFR)', NULL, NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (29, 'CLOBETASOL & CLOTRIMAZOLE 2% CREAM   1:1  (MFR)', NULL, NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (26, '1/2% menthol & camphor in mometasone lotion', NULL, NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (18, 'test', NULL, NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (19, '2% HC in Cetaphil lotion', NULL, NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (20, '1% clotrimazole in Mupirocin&HC1% ointment 1:1', NULL, NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (23, '2% salicyclic acid in clobetasol lotion', NULL, NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (24, '1/4% menthol & camphor in mometasone ointment', NULL, NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (25, '1/4% menthol & camphor in Betaderm 0.05 or 0.1% CR', NULL, NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (22, '45% salicylic acid in mupirocin 2% cream (MFR)', NULL, NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (31, 'DESONIDE & MICONAZOLE CREAM   1:1  (MFR)', NULL, NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (34, 'HYDROVAL CREAM & GLAXAL BASE 1:1  (MFR)', NULL, NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (12, '1% HC IN NYSTATIN CREAM (MFR)', 'Vigilance:
Required equipment  
•plastic ointment jar	•Spatula
•Ointment slab or ointment paper	•Weigh boat or weigh paper
•Scale with 2 or more decimal places	 
Preparation protocol
Weigh the hydrocortisone micronized powder.
Transfer hydrocortisone micronized onto an ointment slab.
Weigh the nystatin cream.
Gradually add nystatin cream in successive portions on the ointment slab and stir well after each addition.
Mix until a homogeneous product is obtained.
Transfer into the final container and label.
Final appearance
Yellowish or yellow smooth and homogeneous cream
Packaging
plastic ointment jar
BUD=30 DAYS', NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (3, 'TEST COMPOUND 2 - edit', NULL, NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (1, 'test compound', NULL, NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (2, 'TEST COMPOUND (Changes here show on RA)', 'NOTES', NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (15, 'CLOTRIMAZOLE 1% CR AND HYDERM 1% CR 1:1', NULL, NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (11, '1% HC IN CLOTRIMAZOLE 2% CREAM', 'vigilance', NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (33, 'LOPROX 1% & HC1% CREAM 1:1 (MFR)', 'formulation created for 1:1 mixture and added to HWNG compound file', NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (32, 'DESONIDE & FUCIDIN OINTMENT 1:1', 'created 1:1 ointment master formulation and added to hwng compound record', NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (28, 'Lyderm & nystatin cream     1:1  (MFR)', 'created 1:1 cream master formulation and added to hwng compound record', NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (30, 'ELIDEL 1% & KETODERM  2%CREAM   1:1 (MFR)', 'created 1:1 cream formulation and added to HWNG compound file', NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (27, 'Fucidin & nystatin cream 1:1 (MFR)', 'created 1:1 cream master formulation and added to hwng compound record. 
REFERENCE: NO REFERENCES AVAILABLE SINCE MIXTURE OF 2 CREAMS 

REQUIRED EQUPMENT: 
      SPATULA 
      SCALE 
      WEIGH PAPER 
      OINTMENT JAR 
CALCULATIONS: 
     NO COMPLEX  CALCULATIONS SINCE CREAM MIXTURE 
COMPOUNDING METHOD 
     NO SPECIAL MIXING INSTRUCTIONS REQUIRED  
     RISK LEVEL A 
PPE REQUIRED:  
    COMPOUNDING COAT 
PHYSICAL DESCRIPTION: 
   WHITE SMOOTH AND HOMOGENOUS CREAM 
QUALITY CONTROL 
     DO NOT USE IF CHANGE IN APPEARANCE OR COLOUR 
STABILITY AND STORAGE: 
    BUD 30 DAYS, ROOM TEMPERATURE 
LABELING: 
    BUD DATE AUXILLARY LABEL:  30 DAYS 
PACKAGING 
  OINTMENT JAR', NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (21, '20-60% Salicyclic Acid in White Petrolatum (MFR)', 'Ingredients for 40% SA in White Petrolatum: 	 	 	 
Salicylic acid powder		40	grams	
Mineral oil heavy 	               14	grams	
White petrolatum 	               46	grams
Equipment:
•Amber glass or plastic ointment jar or lacquered metal or plastic ointment tube	•Scale with 2 or more decimal places
•Mortar and pestle	•Spatula
•Ointment slab or ointment paper	•Weigh boat or weigh paper
Preparation Protocol
Weigh the salicylic acid powder.
Put salicylic acid in a mortar.
Triturate to a fine powder.
Transfer salicylic acid onto an ointment slab.
Weigh mineral oil heavy.
Add mineral oil heavy to salicylic acid and mix well to form a smooth paste.
Weigh white petrolatum.
Gradually add white petrolatum in successive portions on the ointment slab and stir well after each addition.
Mix until a homogeneous preparation is obtained.
Transfer into the final container and label.
Appearance:
    White homogeneous smooth ointment
Packaging
    plastic ointment jar 
BUD= up to 6months (or earlier if ingredients used expiry before 6months)
Reference:  See Vigilance', NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (4, '1% HC POWDER IN CLOTRIMAZOLE 1% CREAM  (or 1.5%, 2% OR 2.5%HC)', 'Vigilance:
Required equipment  
•plastic ointment jar	•Spatula
•Ointment slab or ointment paper	•Weigh boat or weigh paper
•Scale with 2 or more decimal places	 
Preparation protocol
Weigh the hydrocortisone micronized powder.
Transfer hydrocortisone micronized onto an ointment slab.
Weigh the clotrimazole cream.
Gradually add clotrimazole to hydrocortisone micronized in successive portions on the ointment slab and stir well after each addition.
Mix until a homogeneous product is obtained.
Transfer into the final container and label.
Final appearance
White or slightly yellowish smooth and homogeneous cream
Packaging
plastic ointment jar 
BUD= 30 days', NULL, '[]', false);
INSERT INTO public.compounds (id, name, notes, "shortcutSuffix", "shortcutVariations", "hasShortcut") VALUES (13, '1% HC in Ketoderm Cream (or 2 or 2.5%)(MFR)', 'VIGILANCE:
Required equipment  
•Amber glass or plastic ointment jar or lacquered metal or plastic ointment tube	•Spatula
•Ointment slab or ointment paper	•Weigh boat or weigh paper
•Scale with 2 or more decimal places	 
Preparation protocol
Weigh the hydrocortisone micronized powder.
Transfer hydrocortisone micronized onto an ointment slab.
Weigh the ketoconazole cream.
Gradually add ketoconazole cream in successive portions on the ointment slab and stir well after each addition.
Mix until a homogeneous product is obtained.
Transfer into the final container and label.
Final appearance
White or slightly yellowish smooth and homogeneous cream
Packaging
Pack into an amber glass or plastic ointment jar or lacquered metal or plastic ointment tube.', 'HC', '[{"code": "A", "name": "1% Hydrocordisone powder"}, {"code": "B", "name": "2% Hydrocordisone powder"}, {"code": "C", "name": "2.5% Hydrocordisone powder"}]', true);


--
-- Data for Name: directory; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.directory (url, name, description, "order", "updatedAt", id) VALUES ('https://www.napra.ca/general-practice-resources/guidance-document-pharmacy-compounding-non-sterile-preparations', 'NAPRA - Guidance Document for Pharmacy Compounding of Non-sterile Preparations', NULL, 1, '2022-11-15 22:15:54.759', 1);
INSERT INTO public.directory (url, name, description, "order", "updatedAt", id) VALUES ('https://medisca.ca', 'Medisca2', NULL, 2, '2022-11-15 22:15:54.759', 4);
INSERT INTO public.directory (url, name, description, "order", "updatedAt", id) VALUES ('https://www.cdc.gov/niosh/docs/2016-161/default.html', 'NIOSH List of Antineoplastic and Other Hazardous Drugs in Healthcare Settings', '- Group 1: Antineoplastic drugs, including those with the manufacturer’s safe-handling guidance (MSHG).

- Group 2: Non-antineoplastic drugs that meet one or more of the NIOSH criteria for a hazardous drug, including those with the manufacturer’s safe-handling guidance (MSHG).

- Group 3: Non-antineoplastic drugs that primarily have adverse reproductive effects.', 3, '2022-11-15 22:15:54.759', 2);
INSERT INTO public.directory (url, name, description, "order", "updatedAt", id) VALUES ('https://unece.org/transport/standards/transport/dangerous-goods/ghs-rev9-2021', 'Globally Harmonized System of Classification and Labelling of Chemicals (GHS Rev. 9, 2021)', NULL, 4, '2022-11-15 22:15:54.759', 3);


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
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (14, 'DILTIAZEM HYDROCHLORIDE, EP', 11, 1, '2022-10-03 17:20:22.242');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (16, 'MOMETASONE FUROATE, USP', 12, 1, '2022-10-04 00:29:15.524');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (17, 'CICLOPIROX OLAMINE, USP', 35, 1, '2022-10-09 18:53:18.755');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (18, 'SALICYCLIC ACID, USP', 47, 1, '2022-10-09 19:05:39.011');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (19, 'PROGESTERONE, USP', 46, 1, '2022-10-09 19:06:07.151');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (20, 'PETROLATUM, USP (white)', 45, 1, '2022-10-09 19:06:41.765');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (21, 'MICONAZOLE, USP', 44, 1, '2022-10-09 19:07:04.019');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (22, 'MENTHOL, USP (crystals)', 40, 1, '2022-10-09 19:07:28.977');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (23, 'MUPIROCIN, USP', 39, 1, '2022-10-09 19:07:59.704');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (24, 'DILITIAZEM HYDROCHLORIDE,USP', 11, 1, '2022-10-09 19:08:50.096');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (25, 'DESONIDE (micronized)', 38, 1, '2022-10-09 19:09:23.3');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (26, 'CLOBETASOL 17-PROPIONATE,USP', 37, 1, '2022-10-09 19:10:08.637');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (27, 'BETAMETHASONE VALERATE, USP', 36, 1, '2022-10-09 19:10:34.819');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (28, 'CICLOPIROX OLAMINE, USP', 35, 1, '2022-10-09 19:11:04.302');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (29, 'LACTIC ACID, USP', 48, 1, '2022-10-09 20:08:02.725');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (30, 'TRICHLOROACETIC ACID, ACS (Reagent)', 49, 1, '2022-10-09 20:13:16.741');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (31, 'COAL TAR TOPICAL SOLUTION, USP', 50, 1, '2022-10-09 20:22:51.723');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (32, 'AMITRIPTYLINE HYDROCHLORIDE, USP', 51, 1, '2022-10-09 20:27:43.185');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (13, 'DILTIAZEM HYDROCHLORIDE, USP ', 11, 1, '2022-10-09 20:33:11.196');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (33, 'DICLOFENAC SODIUM, USP (Micronized)', 52, 1, '2022-10-09 20:36:45.78');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (34, 'HYDROQUINONE, USP', 53, 1, '2022-10-09 20:47:09.982');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (35, 'FLEXIBLE COLLODION, USP', 54, 1, '2022-10-09 20:55:00.105');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (36, 'GLYCERIN, USP', 55, 1, '2022-10-09 21:04:41.946');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (37, 'IBUPROFEN, USP', 56, 1, '2022-10-09 21:09:32.114');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (38, 'LIDOCAINE, USP', 57, 1, '2022-10-09 21:16:12.663');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (39, 'FLUOROURACIL (5), USP/EP', 58, 1, '2022-10-09 21:41:34.761');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (42, 'test product', 60, 2, '2022-10-18 19:04:37.466');
INSERT INTO public.products (id, name, "chemicalId", "vendorId", "updatedAt") VALUES (41, 'PURIFIED WATER, USP', 59, 1, '2022-11-28 18:45:47.78');


--
-- Data for Name: safety_data_sheets; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (1, 1, '2021-04-01', 2, true, '2022-08-14 14:11:31.531');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (2, 2, '2021-04-01', 2, true, '2022-08-14 14:11:31.531');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (3, 3, '2021-03-01', 4, true, '2022-08-14 14:11:31.531');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (5, 5, '2021-09-21', 2, true, '2022-08-14 14:11:31.531');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (7, 6, '2021-05-01', 2, false, '2022-08-14 14:11:31.531');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (8, 7, '2021-04-01', 2, false, '2022-08-14 14:11:31.531');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (9, 8, '2022-06-01', 2, true, '2022-09-01 18:51:21.696');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (15, 11, '2021-04-01', 0, true, '2022-09-29 23:04:52.627');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (16, 10, '2021-05-01', 4, true, '2022-09-29 23:10:53.695');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (17, 9, '2021-01-01', 0, true, '2022-09-29 23:42:39.021');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (6, 4, '1969-12-31', 3, false, '2022-10-01 18:15:42.647');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (4, 4, '2021-04-01', 1, true, '2022-08-14 14:11:31.531');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (18, 16, '2021-04-30', 1, true, '2022-10-04 01:04:40.725');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (20, 17, '2021-04-30', 1, true, '2022-10-09 18:55:05.138');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (19, 13, '2021-05-31', 2, true, '2022-10-09 19:13:29.198');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (21, 27, '2021-05-31', 2, true, '2022-10-09 19:16:29.899');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (22, 26, '2021-04-30', 2, true, '2022-10-09 19:17:44.302');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (23, 25, '2016-06-30', 2, true, '2022-10-09 19:19:20.438');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (24, 23, '2021-02-28', 1, true, '2022-10-09 19:20:32.622');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (25, 22, '2021-06-30', 2, true, '2022-10-09 19:23:45.83');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (26, 19, '2021-05-30', 2, true, '2022-10-09 19:27:01.011');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (27, 18, '2021-05-30', 3, true, '2022-10-09 19:28:39.973');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (28, 21, '2017-05-30', 3, true, '2022-10-09 19:30:33.171');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (29, 20, '2019-07-30', 0, true, '2022-10-09 19:31:09.471');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (30, 29, '2021-08-01', 3, true, '2022-10-09 20:10:41.989');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (31, 30, '2021-12-01', 3, true, '2022-10-09 20:17:15.255');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (32, 31, '2021-04-01', 2, true, '2022-10-09 20:25:31.167');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (33, 32, '2021-04-01', 2, true, '2022-10-09 20:29:34.082');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (34, 33, '2021-05-01', 3, true, '2022-10-09 20:40:40.487');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (35, 34, '2021-05-01', 2, true, '2022-10-09 20:50:54.312');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (36, 35, '2020-05-01', 2, true, '2022-10-09 20:59:42.931');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (37, 36, '2020-10-01', 0, false, '2022-10-09 21:08:01.525');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (38, 37, '2018-11-01', 2, true, '2022-10-09 21:12:44.109');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (39, 39, '2021-05-01', 4, true, '2022-10-09 21:45:04.27');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (41, 41, '2022-10-16', 0, false, '2022-11-28 18:09:58.516');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (42, 41, '2009-10-01', 0, false, '2022-11-29 20:01:50.051');
INSERT INTO public.safety_data_sheets (id, "productId", "revisionDate", "hmisHealthHazard", "requireVentilation", "updatedAt") VALUES (43, 41, '2004-12-08', 0, false, '2022-11-29 20:11:50.669');


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
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (78, 20, 6, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (79, 20, 25, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (70, 19, 7, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (71, 19, 13, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (72, 19, 17, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (73, 19, 25, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (74, 19, 26, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (75, 19, 46, 'CV');
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (76, 19, 43, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (77, 19, 44, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (80, 21, 6, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (81, 21, 42, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (82, 21, 17, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (83, 21, 49, 'endocrine');
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (84, 22, 6, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (85, 22, 42, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (86, 23, 7, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (87, 23, 43, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (88, 23, 48, 'endocrine');
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (89, 24, 6, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (90, 24, 27, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (91, 25, 25, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (92, 25, 17, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (93, 25, 47, 'respiratory');
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (94, 26, 6, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (95, 26, 42, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (96, 26, 38, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (97, 27, 7, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (98, 27, 17, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (99, 27, 23, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (100, 27, 43, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (101, 28, 7, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (102, 28, 26, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (103, 28, 33, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (104, 30, 6, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (105, 30, 20, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (106, 30, 23, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (107, 31, 6, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (108, 31, 18, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (109, 31, 23, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (110, 31, 39, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (111, 32, 17, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (112, 32, 24, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (113, 33, 6, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (114, 33, 18, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (115, 33, 23, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (116, 33, 39, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (117, 34, 8, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (118, 34, 14, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (119, 34, 17, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (120, 34, 25, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (121, 34, 43, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (122, 34, 48, 'CV, GI, LIVER');
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (123, 35, 7, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (124, 35, 23, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (125, 35, 17, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (126, 35, 26, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (127, 35, 32, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (128, 35, 39, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (129, 36, 7, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (130, 36, 25, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (131, 36, 47, 'narcotic effects*');
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (132, 36, 49, 'blood, kidneys, nervous system');
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (133, 38, 14, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (134, 38, 25, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (135, 38, 43, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (136, 38, 48, 'CV, GI');
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (137, 39, 8, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (138, 39, 17, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (139, 39, 25, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (140, 39, 42, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (141, 39, 34, NULL);
INSERT INTO public.hazard_category_to_sds (id, "sdsId", "hazardCategoryId", "additionalInfo") VALUES (142, 39, 48, 'bone marrow');


--
-- Data for Name: ingredients; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (2, 'cream', NULL, NULL, NULL, NULL, 1, 1);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (41, 'liquid', NULL, NULL, NULL, NULL, 2, 1);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (7, 'powder', NULL, NULL, NULL, NULL, 1, 4);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (8, 'cream', 'CLOTRIMADERM/CANESTEN 1%', 999995, false, NULL, 2, 4);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (7, 'powder', NULL, NULL, NULL, NULL, 1, 7);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (NULL, 'liquid', 'Cetaphil lotion', NULL, false, NULL, 2, 7);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (4, 'cream', NULL, NULL, NULL, NULL, 1, 17);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (3, 'solid', NULL, NULL, NULL, NULL, 1, 18);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (NULL, 'ointment', 'PRODUCT NAME 2', NULL, false, NULL, 2, 18);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (7, 'powder', NULL, NULL, NULL, NULL, 1, 19);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (NULL, 'liquid', 'CETAPHIL LOTION', NULL, false, NULL, 2, 19);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (8, 'powder', NULL, NULL, NULL, NULL, 1, 20);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (24, 'ointment', 'bactroban ointment', 99999, false, NULL, 2, 20);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (7, 'ointment', 'cortate 1% ointment', 99999, false, NULL, 3, 20);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (27, 'powder', NULL, NULL, NULL, NULL, 1, 23);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (22, 'liquid', 'clobetasol lotion', 99999, false, NULL, 2, 23);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (25, 'powder', NULL, NULL, NULL, NULL, 1, 24);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (9, 'powder', NULL, NULL, NULL, NULL, 2, 24);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (18, 'cream', 'mometasone ointment', 999, false, NULL, 3, 24);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (25, 'powder', NULL, NULL, NULL, NULL, 1, 26);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (9, 'powder', NULL, NULL, NULL, NULL, 2, 26);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (18, 'liquid', 'mometasone lotion', 999, false, NULL, 3, 26);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (25, 'powder', NULL, NULL, NULL, NULL, 1, 25);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (9, 'powder', NULL, NULL, NULL, NULL, 2, 25);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (21, 'cream', 'betaderm 0.05 or 1%', 716618, false, NULL, 3, 25);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (23, 'cream', 'DESONIDE', NULL, false, NULL, 1, 31);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (28, 'cream', 'MICATING', NULL, false, NULL, 2, 31);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (NULL, 'cream', 'HYDROVAL CREAM', 2242984, false, NULL, 1, 34);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (NULL, 'cream', 'GLAXAL BASE', NULL, false, NULL, 2, 34);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (22, 'cream', 'CLOBETASOL', 99, false, NULL, 1, 29);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (8, 'cream', 'CANESTEN 2%', NULL, false, NULL, 2, 29);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (7, 'cream', 'HYDERM CREAM', 716839, false, NULL, 1, 14);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (16, 'cream', 'KETODERM CREAM', 2245662, false, NULL, 2, 14);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (7, 'powder', NULL, NULL, NULL, NULL, 1, 16);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (15, 'cream', 'LAMISIL CREAM', 2031094, false, NULL, 2, 16);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (4, 'powder', NULL, NULL, NULL, NULL, 1, 10);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (NULL, 'liquid', 'NEOSTRATA SOLUTION', NULL, false, NULL, 2, 10);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (27, 'powder', NULL, NULL, NULL, NULL, 1, 22);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (24, 'cream', 'mupirocin cream', 999, false, NULL, 2, 22);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (4, 'powder', NULL, NULL, NULL, NULL, 1, 36);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (NULL, 'liquid', 'CETAPHIL', NULL, false, NULL, 2, 36);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (4, 'powder', NULL, NULL, NULL, NULL, 1, 8);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (NULL, 'cream', 'GLAXAL BASE', NULL, false, NULL, 2, 8);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (7, 'powder', NULL, NULL, NULL, NULL, 1, 13);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (16, 'cream', 'KETODERM CREAM', 2245662, false, NULL, 2, 13);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (1, 'cream', 'TEST COMMERCIAL PRODUCT 2', 967890, false, NULL, 1, 3);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (2, 'cream', NULL, NULL, NULL, NULL, 2, 3);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (7, 'cream', 'TEST COMMERCIAL PRODUCT (CHANGED)', 123456, true, 'TEST PRODUCT MONOGRAPH CONCERNS', 1, 2);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (7, 'cream', 'HYDERM 1% CREAM', 99999, false, NULL, 1, 15);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (8, 'cream', 'CLOTRIMADERM 1% CREAM', 999999, false, NULL, 2, 15);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (7, 'powder', NULL, NULL, NULL, NULL, 1, 11);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (NULL, 'cream', 'CLOTRIMADERM 2% CREAM or CANESTEN 2% CREAM', NULL, false, NULL, 2, 11);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (20, 'cream', 'LOPROX', NULL, false, NULL, 1, 33);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (7, 'cream', 'HYDERM 1% CREAM', 716839, false, NULL, 2, 33);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (23, 'ointment', 'DESONIDE', NULL, false, NULL, 1, 32);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (NULL, 'ointment', 'FUCIDIN ointment', 586676, false, NULL, 2, 32);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (NULL, 'cream', 'Lyderm', 99, false, NULL, 1, 28);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (17, 'cream', 'Nyaderm cream', 716871, false, NULL, 2, 28);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (NULL, 'cream', 'ELIDEL', 2247238, false, NULL, 1, 30);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (16, 'cream', 'KETODERM', 2245662, false, NULL, 2, 30);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (NULL, 'cream', 'Fucidin cream', 586668, false, NULL, 1, 27);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (17, 'cream', 'Nyaderm cream', 716871, false, NULL, 2, 27);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (27, 'powder', NULL, NULL, NULL, NULL, 1, 21);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (29, 'ointment', 'Vaseline or LB brand', NULL, false, NULL, 2, 21);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (7, 'powder', NULL, NULL, NULL, NULL, 1, 12);
INSERT INTO public.ingredients ("safetyDataSheetId", "physicalForm", "commercialProductName", "commercialProductDin", "hasProductMonographConcerns", "concernsDescription", "order", "compoundId") VALUES (17, 'cream', 'NYADERM CREAM', 716871, false, NULL, 2, 12);


--
-- Data for Name: risk_assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (17, 'Moderate', 'daily', false, false, 100, 'g', false, false, false, false, false, true, NULL, false, false, false, false, false, false, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, false, NULL, false, NULL, false, '', false, false, 'C', '{"Non-NIOSH ingredients.","Low concentration.","Compounding complexity is moderate.","Health hazards minimized by cream formulation"}', '{}', '2022-10-01', '2022-10-02 19:33:40.637', 'PC', 17);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (11, 'Simple', 'monthly', true, true, 50, 'g', false, false, false, true, false, true, NULL, false, false, true, true, true, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', true, 'medical', false, '', false, false, 'A', '{"Low frequency.","Small quantity is being used (50 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by use of commercial cream","Safety risks to compounding staff minimized by PPE: Mask (medical), Coat (designated), Gloves (regular)"}', '{"ventilation not needed due to the above mitigating meaures","eye protection not needed since only category 2B","minimized risk due to use of commercial cream","Mask recommended to reduce inhalation of the HC powder"}', '2022-09-11', '2022-10-03 00:39:50.524', 'PC', 11);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (7, 'Simple', 'monthly', true, true, 100, 'g', false, false, false, true, false, true, NULL, false, false, false, false, true, false, false, NULL, false, false, false, false, true, 'no product monograph available for Cetaphil lotion', true, 'regular', true, 'designated', true, 'medical', false, '', false, false, 'A', '{"Low frequency.","Small quantity is being used (100 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Safety risks to compounding staff minimized by PPE: Mask (medical), Coat (designated), Gloves (regular)"}', '{"Eye protection not needed to due HC having only 2B","Ventilation not required due to above mitigating measures"}', '2022-09-10', '2022-09-10 14:21:11.959', 'PC', 7);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (10, 'Simple', 'monthly', true, true, 100, 'ml', false, false, false, true, false, true, NULL, false, false, true, true, false, false, false, NULL, false, true, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, true, '', false, false, 'A', '{"Low frequency.","Small quantity is being used (100 ml)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Safety risks to compounding staff minimized by PPE: Eye protection, Coat (designated), Gloves (regular)"}', '{"Ventilitation not rquired due to above mitigating mesures","Eye protection required due to Eye damage hazard: category 2 reversible damage"}', '2022-09-10', '2022-10-09 23:23:00.987', 'PC', 10);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (16, 'Simple', 'monthly', true, true, 50, 'g', false, false, false, true, false, true, NULL, false, false, false, false, false, true, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', true, 'non medical', false, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (50 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by use of commercial cream","Safety risks to compounding staff minimized by PPE: Mask (non medical), Coat (designated), Gloves (regular)"}', '{"Mask to minimize inhalation of the HC powder to reduce \"target organ toxicity\" since a common compounding ingredient"}', '2022-09-29', '2022-10-13 01:46:27.858', 'PC', 16);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (32, 'Simple', 'monthly', true, true, 30, 'g', false, false, false, true, false, true, NULL, false, false, false, false, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, false, '', false, false, 'A', '{"Low frequency.","Small quantity is being used (30 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by ointment formulation","Safety risks to compounding staff minimized by PPE: Coat (designated), Gloves (regular)"}', '{}', '2022-10-09', '2022-10-12 01:37:08.033', 'PC', 32);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (36, 'Simple', 'monthly', true, true, 100, 'ml', false, false, false, true, true, true, NULL, false, false, true, true, false, true, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, true, '', false, false, 'A', '{"Low frequency.","Small quantity is being used (100 ml)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Safety risks to compounding staff minimized by PPE: Eye protection, Coat (designated), Gloves (regular)"}', '{"eye protection recommended due to risk of serious eye irritation"}', '2022-10-18', '2022-10-19 02:21:23.278', 'PC', 36);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (14, 'Simple', 'monthly', true, true, 30, 'g', false, false, false, true, false, true, NULL, false, false, false, false, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, false, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (30 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by cream formulation","Safety risks to compounding staff minimized by PPE: Coat (designated), Gloves (regular)"}', '{}', '2022-09-29', '2022-10-12 01:51:25.08', 'PC', 14);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (8, 'Simple', 'monthly', true, true, 100, 'g', false, false, false, true, false, true, NULL, false, false, true, true, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, true, '', false, false, 'A', '{"Low frequency.","Small quantity is being used (100 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by use of commercial cream","Safety risks to compounding staff minimized by PPE: Eye protection, Coat (designated), Gloves (regular)"}', '{"Ventilation  not required due to above mitagating measures","Eye protection required due to Eye damage hazard category 2: reversible eye damage"}', '2022-09-10', '2022-10-19 02:25:57.539', 'PC', 8);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (29, 'Simple', 'monthly', true, true, 100, 'g', false, false, false, true, false, true, NULL, false, false, false, false, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, false, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (100 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by cream formulation","Safety risks to compounding staff minimized by PPE: Coat (designated), Gloves (regular)"}', '{}', '2022-10-09', '2022-10-12 01:49:43.663', 'PC', 29);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (30, 'Simple', 'monthly', true, true, 50, 'g', false, false, false, true, false, true, NULL, false, false, false, false, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, false, '', false, false, 'A', '{"Low frequency.","Small quantity is being used (50 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by cream formulation","Safety risks to compounding staff minimized by PPE: Coat (designated), Gloves (regular)"}', '{}', '2022-10-09', '2022-10-12 01:48:54.046', 'PC', 30);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (34, 'Simple', 'monthly', true, true, 100, 'g', false, false, false, true, false, true, NULL, false, false, false, false, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, false, '', false, false, 'A', '{}', '{}', '2022-10-09', '2022-10-12 01:47:03.588', 'PC', 34);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (15, 'Simple', 'weekly', true, true, 30, 'g', false, false, false, true, false, true, NULL, false, false, false, false, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', true, 'non medical', false, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (30 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by cream formulation","Safety risks to compounding staff minimized by PPE: Mask (non medical), Coat (designated), Gloves (regular)"}', '{}', '2022-09-29', '2022-10-28 21:08:43.55', 'PC', 15);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (1, 'Complex', 'monthly', true, false, 12, 'g', false, false, false, true, false, true, NULL, false, false, true, false, false, false, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, 'regular', false, NULL, false, NULL, false, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Low concentration.","Have appropriate facilities.","Compounding complexity is complex.","Health hazards minimized by use of commercial cream","Safety risks to compounding staff minimized by PPE: Gloves (regular)"}', '{"Additional 1","Additional 2"}', '2022-08-10', '2022-12-04 17:29:02.935', 'PC', 1);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (13, 'Simple', 'monthly', true, true, 50, 'g', false, false, false, true, false, true, NULL, false, false, false, false, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, false, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (50 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by use of commercial cream","Safety risks to compounding staff minimized by PPE: Coat (designated), Gloves (regular)"}', '{}', '2022-09-29', '2022-10-13 01:42:35.742', 'PC', 13);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (28, 'Simple', 'monthly', true, true, 50, 'g', false, false, false, true, false, true, NULL, false, false, false, false, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, false, '', false, false, 'A', '{"Low frequency.","Small quantity is being used (50 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by cream formulation","Safety risks to compounding staff minimized by PPE: Coat (designated), Gloves (regular)"}', '{}', '2022-10-09', '2022-10-12 01:50:16.373', 'PC', 28);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (26, 'Simple', 'monthly', true, true, 60, 'ml', false, false, false, true, false, true, NULL, false, false, true, true, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, true, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (60 ml)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Safety risks to compounding staff minimized by PPE: Eye protection, Coat (designated), Gloves (regular)"}', '{"eye protection to mitigate serious eye irritation risk"}', '2022-10-09', '2022-10-10 00:53:36.811', 'PC', 26);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (18, 'Simple', 'monthly', true, true, 100, 'g', false, false, false, true, false, true, NULL, false, false, false, false, false, false, false, NULL, false, false, false, false, false, NULL, false, NULL, false, NULL, false, NULL, false, '', true, true, 'C', '{"Low frequency.","Small quantity is being used (100 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by use of commercial ointment"}', '{}', '2022-10-08', '2022-10-09 18:41:46.141', 'PC', 18);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (19, 'Simple', 'monthly', true, true, 100, 'g', false, false, false, true, false, true, NULL, false, false, true, true, true, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', true, 'non medical', false, '', false, false, 'A', '{"Low frequency.","Small quantity is being used (100 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Safety risks to compounding staff minimized by PPE: Mask (non medical), Coat (designated), Gloves (regular)"}', '{"ventilation not required due to above mitigating factors.","Mask required to prevent inhalation or oral absorption of the light weight HC powder"}', '2022-10-09', '2022-10-10 00:12:36.492', 'PC', 19);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (20, 'Simple', 'monthly', true, true, 50, 'g', false, false, false, true, false, true, NULL, false, false, false, false, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, false, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (50 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by use of commercial ointment","Safety risks to compounding staff minimized by PPE: Coat (designated), Gloves (regular)"}', '{"ventilation not required due to above mitigating factors","eye protection not required since only level 2B for clotrimazole powder"}', '2022-10-09', '2022-10-10 00:18:20.56', 'PC', 20);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (23, 'Simple', 'monthly', true, true, 60, 'ml', false, false, false, true, false, true, NULL, false, false, true, true, false, true, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', true, 'non medical', true, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (60 ml)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Safety risks to compounding staff minimized by PPE: Mask (non medical), Eye protection, Coat (designated), Gloves (regular)"}', '{"Mask for reproductive staff to minimize oral absorption via inhalation"}', '2022-10-09', '2022-10-10 00:32:27.932', 'PC', 23);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (24, 'Simple', 'monthly', true, true, 50, 'g', false, false, false, true, false, true, NULL, false, false, true, true, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, true, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (50 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by use of commercial cream","Safety risks to compounding staff minimized by PPE: Eye protection, Coat (designated), Gloves (regular)"}', '{"eye protection to mitigate serious eye irritation"}', '2022-10-09', '2022-10-10 00:39:29.2', 'PC', 24);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (25, 'Simple', 'monthly', true, true, 100, 'g', false, false, false, true, false, true, NULL, false, false, true, true, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, true, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (100 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by use of commercial cream","Safety risks to compounding staff minimized by PPE: Eye protection, Coat (designated), Gloves (regular)"}', '{"Eye protection to mitigate Serious Eye Irritation hazard"}', '2022-10-09', '2022-10-12 01:38:48.779', 'PC', 25);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (21, 'Simple', 'monthly', true, true, 30, 'g', false, false, false, true, false, true, NULL, false, false, true, true, false, true, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', true, 'non medical', true, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (30 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by use of commercial ointment","Safety risks to compounding staff minimized by PPE: Mask (non medical), Eye protection, Coat (designated), Gloves (regular)"}', '{"Mask recommended in certain staff to reduce reproductive risks","Eye protection required due to Category 1 for risk of irreversible eye damage","Ventilation not required due to above mitigating factors"}', '2022-10-09', '2022-10-13 01:48:28.062', 'PC', 21);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (22, 'Simple', 'monthly', true, true, 30, 'g', false, false, false, true, false, true, NULL, false, false, true, true, false, true, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', true, 'non medical', true, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (30 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by use of commercial cream","Safety risks to compounding staff minimized by PPE: Mask (non medical), Eye protection, Coat (designated), Gloves (regular)"}', '{"Eye protection to reduce risk of irreversible eye damage","Mask for reproductive staff suggested"}', '2022-10-09', '2022-10-13 23:58:30.209', 'PC', 22);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (31, 'Simple', 'monthly', true, true, 60, 'g', false, false, false, true, false, true, NULL, false, false, false, false, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, false, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (60 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by cream formulation","Safety risks to compounding staff minimized by PPE: Coat (designated), Gloves (regular)"}', '{}', '2022-10-09', '2022-10-12 01:45:27.263', 'PC', 31);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (33, 'Simple', 'monthly', true, true, 50, 'g', false, false, false, true, false, true, NULL, false, false, false, false, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, false, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (50 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by cream formulation","Safety risks to compounding staff minimized by PPE: Coat (designated), Gloves (regular)"}', '{}', '2022-10-09', '2022-10-12 01:46:23.688', 'PC', 33);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (27, 'Simple', 'monthly', true, true, 60, 'g', false, false, false, true, false, true, NULL, false, false, false, false, false, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', false, NULL, false, '', false, false, 'A', '{"Low frequency.","Small quantity is being used (60 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by cream formulation","Safety risks to compounding staff minimized by PPE: Coat (designated), Gloves (regular)"}', '{}', '2022-10-09', '2022-10-12 01:50:51.748', 'PC', 27);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (12, 'Simple', 'monthly', true, true, 50, 'g', false, false, false, true, false, true, NULL, false, false, false, false, true, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', true, 'Non medical', false, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (50 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by use of commercial cream","Safety risks to compounding staff minimized by PPE: Mask (Non medical), Coat (designated), Gloves (regular)"}', '{"Mask recommended to reduce risk of inhalation of HC powder to prevent target organ toxicity with repeated exposure"}', '2022-09-29', '2022-10-13 01:45:07.687', 'PC', 12);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (3, 'Complex', 'monthly', true, true, 5, 'g', false, false, false, true, true, false, 'TEST WORKFLOW INTERRUPTION MITIGATION STANDARDS DESCRIPTION', false, false, true, true, true, false, false, NULL, true, true, false, false, false, NULL, false, NULL, true, 'designated', true, 'Disposable', true, '', false, false, 'B', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (5 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is complex.","Health hazards minimized by cream formulation","Safety risks to compounding staff minimized by PPE: Mask (Disposable), Eye protection, Coat (designated)"}', '{"TEST ADDITIONAL RATIONALE 1","Additional 2"}', '2022-10-22', '2022-10-23 23:19:29.2', 'PC', 3);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (2, 'Complex', 'monthly', true, true, 5, 'g', false, false, false, true, true, false, 'TEST WORKFLOW INTERRUPTION MITIGATION STANDARDS DESCRIPTION', false, false, true, true, true, false, false, NULL, true, true, false, false, false, NULL, true, 'regular', true, 'designated', true, 'Disposable', true, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (5 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is complex.","Health hazards minimized by cream formulation","Safety risks to compounding staff minimized by PPE: Mask (Disposable), Eye protection, Coat (designated), Gloves (regular)"}', '{"TEST ADDITIONAL RATIONALE 1","TEST ADDITIONAL RATIONALE 2"}', '2022-08-19', '2022-10-25 18:33:31.261', 'PC', 2);
INSERT INTO public.risk_assessments (id, complexity, "preparationFrequency", "isPreparedOccasionally", "isSmallQuantity", "averagePreparationAmountQuantity", "averagePreparationAmountUnit", "isConcentrationHealthRisk", "requireSpecialEducation", "hasVerificationSteps", "haveAppropriateFacilities", "requireVentilation", "isWorkflowUninterrupted", "workflowStandardsProcess", "microbialContaminationRisk", "crossContaminationRisk", "sdsSkinExposureRisk", "sdsEyeExposureRisk", "sdsInhalationExposureRisk", "sdsOralExposureRisk", "sdsOtherExposureRisk", "sdsOtherExposureRiskDescription", "pmSkinExposureRisk", "pmEyeExposureRisk", "pmInhalationExposureRisk", "pmOralExposureRisk", "pmOtherExposureRisk", "pmOtherExposureRiskDescription", "ppeGlovesRequired", "ppeGlovesType", "ppeCoatRequired", "ppeCoatType", "ppeMaskRequired", "ppeMaskType", "ppeEyeProtectionRequired", "ppeOther", "requireEyeWashStation", "requireSafetyShower", "riskLevel", "automaticRationale", "additionalRationale", "dateAssessed", "updatedAt", "compoundingSupervisor", "compoundId") VALUES (4, 'Simple', 'monthly', true, true, 50, 'g', false, false, false, true, true, true, NULL, true, false, false, true, true, false, false, NULL, false, false, false, false, false, NULL, true, 'regular', true, 'designated', true, 'non medical', false, '', false, false, 'A', '{"Non-NIOSH ingredients.","Low frequency.","Small quantity is being used (50 g)","Low concentration.","Have appropriate facilities.","Compounding complexity is simple.","Health hazards minimized by use of commercial cream","Safety risks to compounding staff minimized by PPE: Mask (non medical), Coat (designated), Gloves (regular)"}', '{"VENTILATION NOT NEEDED DUE TO THE ABOVE ASSESSMENT RATIONALE","EYE PROTECTION NOT NEEDED SINCE ONLY CATEGORY 2B","MINIMIZED RISK DUE TO USE OF COMMERCIAL CREAM","MASK RECOMMENDED TO MINIMIZE HAZARD VIA INHALATION OF THIS LIGHT WEIGHT POWDER"}', '2022-09-03', '2022-12-26 19:54:05.645', 'PC', 4);


--
-- Data for Name: mfrs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.mfrs ("compoundId", version, "riskAssessmentId", quantities, "expectedYieldAmount", "expectedYieldUnit", training, "requiredEquipment", calculations, "compoundingMethod", "beyondUseDateValue", "beyondUseDateUnit", storage, packaging, labelling, "references", "developedBy", "verifiedBy", "effectiveDate", "updatedAt", "qualityControls", "pharmaceuticalForm", "routeOfAdministration") VALUES (26, 0, 26, '[{"unit": "g", "amount": 5}, {"unit": "g", "amount": 5}, {"unit": "g", "amount": 90}]', 100, 'g', '{}', '{"weight paper/boat",scale,spatula,"ointment pad/slab","graduated cylinder","mortar and pestle"}', 'None', '1. Levigate creams together until uniform mixture is obtained.
2. Transfer to ointment jar and label', 30, 'days', 'room', 'Ointment jar', '{"External use only","Store at room temperature","Expiry date"}', '{"USP795 guidelines - solid formulations since no stability data available","This formulation is not based on literature but based on historical use or pharmacist experience"}', 'MT', NULL, '2022-12-16', '2022-12-16 19:37:14.342', '{"{\"name\": \"Final product appearance\", \"expectedSpecification\": \"White smooth homogenous cream\"}"}', 'Cream', 'Topical');
INSERT INTO public.mfrs ("compoundId", version, "riskAssessmentId", quantities, "expectedYieldAmount", "expectedYieldUnit", training, "requiredEquipment", calculations, "compoundingMethod", "beyondUseDateValue", "beyondUseDateUnit", storage, packaging, labelling, "references", "developedBy", "verifiedBy", "effectiveDate", "updatedAt", "qualityControls", "pharmaceuticalForm", "routeOfAdministration") VALUES (26, 1, 26, '[{"unit": "g", "amount": 4.5}, {"unit": "g", "amount": 5.5}, {"unit": "g", "amount": 99}]', 100, 'g', '{"No specialized training required"}', '{scale,spatula,"ointment pad/slab","ointment jar","weight paper/boat"}', 'None', '1. Levigate creams together until uniform mixture is obtained.
2. Transfer to ointment jar and label
3.
4.
5.
6.', 4, 'months', 'room', 'Ointment jar', '{"External use only","Store at room temperature","Expiry date"}', '{"This formulation is not based on literature but based on historical use or pharmacist experience","USP795 guidelines - solid formulations since no stability data available"}', 'MT', NULL, '2022-12-16', '2022-12-22 19:52:39.586', '{"{\"name\": \"Final product appearance\", \"expectedSpecification\": \"White smooth homogenous cream\"}"}', 'Cream', 'Topical');
INSERT INTO public.mfrs ("compoundId", version, "riskAssessmentId", quantities, "expectedYieldAmount", "expectedYieldUnit", training, "requiredEquipment", calculations, "compoundingMethod", "beyondUseDateValue", "beyondUseDateUnit", storage, packaging, labelling, "references", "developedBy", "verifiedBy", "effectiveDate", "updatedAt", "qualityControls", "pharmaceuticalForm", "routeOfAdministration") VALUES (21, 0, 21, '[{"unit": "g", "amount": 40}, {"unit": "g", "amount": 60}]', 100, 'g', '{}', '{scale,"weight paper/boat",spatula,"ointment pad/slab","ointment jar"}', NULL, '1.  Weigh the salicylic acid powder.
2.  Put salicylic acid in a mortar.
3.  Triturate to a fine powder.
4.  Transfer salicylic acid onto an ointment slab.
5..  Weigh mineral oil heavy.
6.  Add mineral oil heavy to salicylic acid and mix well to form a smooth paste.
7. Weigh white petrolatum.
8. Gradually add white petrolatum in successive portions on the ointment slab and stir well after each addition.
9.  Mix until a homogeneous preparation is obtained.
10  Transfer into the final container and label.', 180, 'days', 'room', 'Ointment jar', '{"External use only"}', '{"Vigilance Reference #: ______ Date: YYYY-MM-DD"}', 'pc', 'pc', '2022-12-26', '2022-12-26 19:51:37.309', '{"{\"name\": \"Final product appearance\", \"expectedSpecification\": \"White smooth homogenous ointment\"}"}', 'Ointment', 'Topical');
INSERT INTO public.mfrs ("compoundId", version, "riskAssessmentId", quantities, "expectedYieldAmount", "expectedYieldUnit", training, "requiredEquipment", calculations, "compoundingMethod", "beyondUseDateValue", "beyondUseDateUnit", storage, packaging, labelling, "references", "developedBy", "verifiedBy", "effectiveDate", "updatedAt", "qualityControls", "pharmaceuticalForm", "routeOfAdministration") VALUES (30, 0, 30, '[{"unit": "g", "amount": 50}, {"unit": "g", "amount": 50}]', 100, 'g', '{"no specialized training required"}', '{scale,"weight paper/boat",spatula,"ointment pad/slab","ointment jar"}', 'none', '1. Levigate creams together until uniform mixture is obtained.
2. Transfer to ointment jar and label', 30, 'days', 'room', 'Ointment jar', '{"External use only","Store at room temperature","Expiry date"}', '{"This formulation is not based on literature but based on historical use or pharmacist experience","USP795 guidelines - solid formulations since no stability data available"}', 'PT', 'PT', '2022-12-22', '2022-12-22 20:00:38.979', '{"{\"name\": \"Final product appearance\", \"expectedSpecification\": \"White smooth homogenous cream\"}"}', 'Cream', 'Topical');
INSERT INTO public.mfrs ("compoundId", version, "riskAssessmentId", quantities, "expectedYieldAmount", "expectedYieldUnit", training, "requiredEquipment", calculations, "compoundingMethod", "beyondUseDateValue", "beyondUseDateUnit", storage, packaging, labelling, "references", "developedBy", "verifiedBy", "effectiveDate", "updatedAt", "qualityControls", "pharmaceuticalForm", "routeOfAdministration") VALUES (4, 0, 4, '[{"unit": "g", "amount": 1}, {"unit": "g", "amount": 99}]', 100, 'g', '{"no specialized training required"}', '{scale,"weight paper/boat",spatula,"ointment pad/slab","ointment jar"}', NULL, 'Weigh the hydrocortisone micronized powder.
1. Transfer hydrocortisone micronized onto an ointment slab.
2. Weigh the clotrimazole cream.
3. Gradually add clotrimazole to hydrocortisone micronized in successive portions on the ointment slab and stir well after each addition.
4. Mix until a homogeneous product is obtained.
5. Transfer into the final container and label.', 30, 'days', 'room', 'Ointment jar', '{"External use only","Expiry date"}', '{"Vigilance Reference #: ______ Date: YYYY-MM-DD"}', 'pc', 'pc', '2022-12-26', '2022-12-26 19:43:56.745', '{"{\"name\": \"Final product appearance\", \"expectedSpecification\": \"White smooth homogenous cream\"}"}', 'Cream', 'Topical');
INSERT INTO public.mfrs ("compoundId", version, "riskAssessmentId", quantities, "expectedYieldAmount", "expectedYieldUnit", training, "requiredEquipment", calculations, "compoundingMethod", "beyondUseDateValue", "beyondUseDateUnit", storage, packaging, labelling, "references", "developedBy", "verifiedBy", "effectiveDate", "updatedAt", "qualityControls", "pharmaceuticalForm", "routeOfAdministration") VALUES (13, 0, 13, '[{"unit": "g", "amount": 1}, {"unit": "g", "amount": 99}]', 100, 'g', '{"training 1","training 2"}', '{scale,"weight paper/boat",spatula,"ointment pad/slab","ointment jar"}', NULL, '1. Weigh the hydrocortisone micronized powder.
2. Transfer hydrocortisone micronized onto an ointment slab.
3. Weigh the ketoconazole cream.
4. Gradually add ketoconazole cream in successive portions on the ointment slab and stir well after each addition.
5. Mix until a homogeneous product is obtained.
6. Transfer into the final container and label.', 30, 'days', 'room', 'Ointment jar', '{"External use only","Expiry date"}', '{"Vigilance Reference #:1234 Date: YYYY-MM-DD"}', 'pc', 'pc', '2022-12-26', '2023-01-23 20:29:20.134', '{"{\"name\": \"Final product appearance\", \"expectedSpecification\": \"White smooth homogenous cream\"}"}', 'Cream', 'Topical');


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.settings (id, "mfrFieldPresets", "shortcutSuffixes") VALUES (0, '{"labelling": [{"value": "External use only"}, {"value": "Shake well"}, {"value": "Store at room temperature"}, {"value": "Store in fridge"}, {"value": "Expiry date"}], "packaging": [{"value": "Ointment jar"}, {"value": "Amber plastic bottle"}], "references": [{"label": "Based on historical use/pharmacist experience", "value": "This formulation is not based on literature but based on historical use or pharmacist experience"}, {"label": "USP795 - solid formulations, no stability data", "value": "USP795 guidelines - solid formulations since no stability data available"}, {"label": "Vigilance", "value": "Vigilance Reference #: ________ Date: YYYY-MM-DD"}], "qualityControls": [{"label": "White smooth cream", "value": [{"name": "Final product appearance", "expectedSpecification": "White smooth homogenous cream"}]}, {"label": "Yellow smooth cream", "value": [{"name": "Final product appearance", "expectedSpecification": "Yellow smooth homogenous cream"}]}, {"label": "White smooth ointment", "value": [{"name": "Final product appearance", "expectedSpecification": "White smooth homogenous ointment"}]}, {"label": "Yellow smooth ointment", "value": [{"name": "Final product appearance", "expectedSpecification": "Yellow smooth homogenous ointment"}]}], "compoundingMethod": [{"label": "Creams template", "value": "1. Levigate creams together until uniform mixture is obtained.\n2. Transfer to ointment jar and label"}, {"label": "Ointments template", "value": "1. Levigate ointments together until uniform mixture is obtained.\n2. Transfer to ointment jar and label"}], "requiredEquipment": [{"value": "scale"}, {"value": "weight paper/boat"}, {"value": "spatula"}, {"value": "ointment pad/slab"}, {"value": "graduated cylinder"}, {"value": "mortar and pestle"}, {"value": "ointment jar"}, {"value": "amber plastic bottle"}]}', '[{"code": "HC", "description": "Hydrocortisone powder"}, {"code": "CL", "description": "Clindamycin powder"}, {"code": "ER", "description": "Erythromycin powder"}, {"code": "CZ", "description": "Clotrimazole powder"}, {"code": "MC", "description": "Menthol & camphor"}, {"code": "MZ", "description": "Miconazole crystals"}, {"code": "SA", "description": "Salicylic acid"}, {"code": "AA", "description": "Half & half"}, {"code": "BB", "description": "TEST"}]');


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
-- Name: compounds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.compounds_id_seq', COALESCE(MAX(id), 1), TRUE) FROM public.compounds;

--
-- Name: directory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.directory_id_seq', COALESCE(MAX(id), 1), TRUE) FROM public.directory;


--
-- Name: directory_order_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.directory_order_seq', COALESCE(MAX("order"), 1), TRUE) FROM public.directory;


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.settings_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

COMMIT;