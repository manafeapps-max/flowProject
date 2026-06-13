--
-- PostgreSQL database dump
--

\restrict QqS7lBpmDgs6UtaR3YGfSLViTmu9arvJpVgEr9LaqfmmQf8Ff8f8fbJN28M1h0F

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--

INSERT INTO auth.users VALUES ('00000000-0000-0000-0000-000000000000', 'de641feb-9990-4057-ba23-6c66253e2fa9', 'authenticated', 'authenticated', 'stolaputih@gmail.com', '$2a$10$Zj5VMqcl2EJkTYtpwjLqEueoYHoK2lZA6VrtkmdFfMWAXqLGIW9wi', '2026-06-02 22:54:37.741428+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-06-02 22:54:55.110328+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-06-02 22:54:37.723829+00', '2026-06-02 22:54:55.13234+00', NULL, NULL, '', '', NULL, DEFAULT, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: -
--

INSERT INTO auth.identities VALUES ('de641feb-9990-4057-ba23-6c66253e2fa9', 'de641feb-9990-4057-ba23-6c66253e2fa9', '{"sub": "de641feb-9990-4057-ba23-6c66253e2fa9", "email": "stolaputih@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-06-02 22:54:37.73657+00', '2026-06-02 22:54:37.736624+00', '2026-06-02 22:54:37.736624+00', DEFAULT, '97514e46-011c-4377-a24d-a524346edfda');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: -
--

INSERT INTO auth.sessions VALUES ('0c60390d-1009-4e96-aaa0-0dcbae8fb093', 'de641feb-9990-4057-ba23-6c66253e2fa9', '2026-06-02 22:54:55.111662+00', '2026-06-02 22:54:55.111662+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', '118.99.110.164', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: -
--

INSERT INTO auth.mfa_amr_claims VALUES ('0c60390d-1009-4e96-aaa0-0dcbae8fb093', '2026-06-02 22:54:55.133983+00', '2026-06-02 22:54:55.133983+00', 'password', '3c6a847f-a4e5-4e16-8b27-6277e792f7a7');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

INSERT INTO auth.refresh_tokens VALUES ('00000000-0000-0000-0000-000000000000', 1, 'mubl7dknvgwp', 'de641feb-9990-4057-ba23-6c66253e2fa9', false, '2026-06-02 22:54:55.121576+00', '2026-06-02 22:54:55.121576+00', NULL, '0c60390d-1009-4e96-aaa0-0dcbae8fb093');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: -
--

INSERT INTO auth.schema_migrations VALUES ('20171026211738');
INSERT INTO auth.schema_migrations VALUES ('20171026211808');
INSERT INTO auth.schema_migrations VALUES ('20171026211834');
INSERT INTO auth.schema_migrations VALUES ('20180103212743');
INSERT INTO auth.schema_migrations VALUES ('20180108183307');
INSERT INTO auth.schema_migrations VALUES ('20180119214651');
INSERT INTO auth.schema_migrations VALUES ('20180125194653');
INSERT INTO auth.schema_migrations VALUES ('00');
INSERT INTO auth.schema_migrations VALUES ('20210710035447');
INSERT INTO auth.schema_migrations VALUES ('20210722035447');
INSERT INTO auth.schema_migrations VALUES ('20210730183235');
INSERT INTO auth.schema_migrations VALUES ('20210909172000');
INSERT INTO auth.schema_migrations VALUES ('20210927181326');
INSERT INTO auth.schema_migrations VALUES ('20211122151130');
INSERT INTO auth.schema_migrations VALUES ('20211124214934');
INSERT INTO auth.schema_migrations VALUES ('20211202183645');
INSERT INTO auth.schema_migrations VALUES ('20220114185221');
INSERT INTO auth.schema_migrations VALUES ('20220114185340');
INSERT INTO auth.schema_migrations VALUES ('20220224000811');
INSERT INTO auth.schema_migrations VALUES ('20220323170000');
INSERT INTO auth.schema_migrations VALUES ('20220429102000');
INSERT INTO auth.schema_migrations VALUES ('20220531120530');
INSERT INTO auth.schema_migrations VALUES ('20220614074223');
INSERT INTO auth.schema_migrations VALUES ('20220811173540');
INSERT INTO auth.schema_migrations VALUES ('20221003041349');
INSERT INTO auth.schema_migrations VALUES ('20221003041400');
INSERT INTO auth.schema_migrations VALUES ('20221011041400');
INSERT INTO auth.schema_migrations VALUES ('20221020193600');
INSERT INTO auth.schema_migrations VALUES ('20221021073300');
INSERT INTO auth.schema_migrations VALUES ('20221021082433');
INSERT INTO auth.schema_migrations VALUES ('20221027105023');
INSERT INTO auth.schema_migrations VALUES ('20221114143122');
INSERT INTO auth.schema_migrations VALUES ('20221114143410');
INSERT INTO auth.schema_migrations VALUES ('20221125140132');
INSERT INTO auth.schema_migrations VALUES ('20221208132122');
INSERT INTO auth.schema_migrations VALUES ('20221215195500');
INSERT INTO auth.schema_migrations VALUES ('20221215195800');
INSERT INTO auth.schema_migrations VALUES ('20221215195900');
INSERT INTO auth.schema_migrations VALUES ('20230116124310');
INSERT INTO auth.schema_migrations VALUES ('20230116124412');
INSERT INTO auth.schema_migrations VALUES ('20230131181311');
INSERT INTO auth.schema_migrations VALUES ('20230322519590');
INSERT INTO auth.schema_migrations VALUES ('20230402418590');
INSERT INTO auth.schema_migrations VALUES ('20230411005111');
INSERT INTO auth.schema_migrations VALUES ('20230508135423');
INSERT INTO auth.schema_migrations VALUES ('20230523124323');
INSERT INTO auth.schema_migrations VALUES ('20230818113222');
INSERT INTO auth.schema_migrations VALUES ('20230914180801');
INSERT INTO auth.schema_migrations VALUES ('20231027141322');
INSERT INTO auth.schema_migrations VALUES ('20231114161723');
INSERT INTO auth.schema_migrations VALUES ('20231117164230');
INSERT INTO auth.schema_migrations VALUES ('20240115144230');
INSERT INTO auth.schema_migrations VALUES ('20240214120130');
INSERT INTO auth.schema_migrations VALUES ('20240306115329');
INSERT INTO auth.schema_migrations VALUES ('20240314092811');
INSERT INTO auth.schema_migrations VALUES ('20240427152123');
INSERT INTO auth.schema_migrations VALUES ('20240612123726');
INSERT INTO auth.schema_migrations VALUES ('20240729123726');
INSERT INTO auth.schema_migrations VALUES ('20240802193726');
INSERT INTO auth.schema_migrations VALUES ('20240806073726');
INSERT INTO auth.schema_migrations VALUES ('20241009103726');
INSERT INTO auth.schema_migrations VALUES ('20250717082212');
INSERT INTO auth.schema_migrations VALUES ('20250731150234');
INSERT INTO auth.schema_migrations VALUES ('20250804100000');
INSERT INTO auth.schema_migrations VALUES ('20250901200500');
INSERT INTO auth.schema_migrations VALUES ('20250903112500');
INSERT INTO auth.schema_migrations VALUES ('20250904133000');
INSERT INTO auth.schema_migrations VALUES ('20250925093508');
INSERT INTO auth.schema_migrations VALUES ('20251007112900');
INSERT INTO auth.schema_migrations VALUES ('20251104100000');
INSERT INTO auth.schema_migrations VALUES ('20251111201300');
INSERT INTO auth.schema_migrations VALUES ('20251201000000');
INSERT INTO auth.schema_migrations VALUES ('20260115000000');
INSERT INTO auth.schema_migrations VALUES ('20260121000000');
INSERT INTO auth.schema_migrations VALUES ('20260219120000');
INSERT INTO auth.schema_migrations VALUES ('20260302000000');


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: -
--



--
-- Data for Name: organization_period; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.organization_period VALUES ('550e8400-e29b-41d4-a716-446655440000', 'TA2026-2027', '2026-04-01', '2027-03-31', 'ACTIVE', '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');


--
-- Data for Name: bidang; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.bidang VALUES ('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', 'Bidang II Pelkes', 'PELKES', NULL, '2026-06-02 14:40:18.054459+00');


--
-- Data for Name: sub_bidang; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sub_bidang VALUES ('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', 'Pelkes', 'SUB-PELKES', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.sub_bidang VALUES ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', 'UPB', 'SUB-UPB', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.sub_bidang VALUES ('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', 'UP2M', 'SUB-UP2M', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.sub_bidang VALUES ('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', 'PMKI', 'SUB-PMKI', '2026-06-02 14:40:18.054459+00');


--
-- Data for Name: type_program; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.type_program VALUES ('550e8400-e29b-41d4-a716-446655440001', 'Rutin', 'Program rutin berkala', true, 1, '2026-06-02 13:54:24.04268+00');
INSERT INTO public.type_program VALUES ('550e8400-e29b-41d4-a716-446655440002', 'Non Rutin', 'Program insidental/spesial', true, 2, '2026-06-02 13:54:24.04268+00');
INSERT INTO public.type_program VALUES ('550e8400-e29b-41d4-a716-446655440003', 'Proyek', 'Program berbasis proyek', true, 3, '2026-06-02 13:54:24.04268+00');


--
-- Data for Name: program; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440119', NULL, 'Diskusi Daring Gereja Tangguh Bencana', 'Sosialisasi konsep & pembentukan 5 model Gereja Tangguh Bencana GPIB', 2026, 'Q1', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440002', 1, 'Daring (Zoom)', NULL, 'April 2026', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440101', NULL, 'Rapat Rutin Departemen Pelkes', 'Rapat dan Koordinasi Departemen Pelkes', 2026, 'Q1', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', 4, NULL, 'Penerimaan MS: Rp 14.260.000...', 'April 2026 - Maret 2027', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440102', NULL, 'Rapat Rutin Sub Bidang UPB', 'Rapat dan Koordinasi UPB', 2026, 'Q2', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440001', 6, NULL, 'Penerimaan MS: Rp 4.440.000...', 'April 2026 - Maret 2027', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440103', NULL, 'Rapat Rutin Sub Bidang UP2M', 'Rapat dan Koordinasi UP2M', 2026, 'Q2', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440001', 6, NULL, 'Penerimaan MS: Rp 4.995.000...', 'April 2026 - Maret 2027', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440104', NULL, 'Rapat Rutin Sub Bidang PMKI', 'Rapat dan Koordinasi PMKI', 2026, 'Q2', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440001', 6, NULL, 'Penerimaan MS: Rp 4.440.000...', 'April 2026 - Maret 2027', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440105', NULL, 'Rapat Koordinasi MS dengan semua K1 dan S1 di Jemaat dan Mupel', 'Evaluasi, Koordinasi dan Pelaporan kegiatan serta keuangan', 2026, 'Q4', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', 2, 'Daring', 'dilakukan melalui media zoom', NULL, 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440106', NULL, 'Rapat Koordinasi MS dengan semua Pendeta Jemaat di Pos-Pos Pelkes', 'Koordinasi dengan semua Pendeta Jemaat di Pos-Pos Pelkes GPIB', 2026, 'Q1', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', 4, 'Daring', 'dilakukan melalui media zoom', NULL, 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440107', NULL, 'Kesekretariatan', 'Penyediaan Alat Tulis Kantor, Barang Cetak, Kebutuhan Kuota GDrive, dan Pulsa Call Center PMKI', 2026, 'Q1', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', 12, 'Kantor Majelis Sinode', 'Penerimaan MS : Rp 5.300.000...', NULL, 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440108', NULL, 'Penyusunan Panduan Pemutakhiran Data Pos Pelkes, Database UPB, UP2M & PMKI di Jemaat dan Mupel', 'Pemutakhiran Data dari Pos Pelkes, Database Pengurus UPB, UP2M dan PMKI di Jemaat dan Mupel yang Komprehensif', 2026, 'Q1', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', 12, 'Kantor Majelis Sinode', 'Definisi data komprehensif akan didiskusikan lebih lanjut dengan Bidang lainnya.', NULL, 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440109', NULL, 'Visitasi Pos Pelkes', 'Memberikan Data untuk Proses Penyusunan Panduan Pemutakhiran Data', 2026, 'Q1', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', 1, 'Mupel Kalimantan Barat', 'Penerimaan MS : Rp 50.375.000...', 'July 2026', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440110', NULL, 'Panduan Safari/Kegiatan Bulan Pelkes di masing-masing Mupel', 'Membuat Panduan Kegiatan Bulan Pelkes yang dilaksanakan di masing-masing Mupel sesuai dengan Konteks dan Kebutuhan Lokal', 2026, 'Q1', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', 1, 'Tiap Mupel', 'PENERIMAAN: Persembahan Khusus Bulan Pelkes...', '1 - 30 Juni 2026', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440111', NULL, 'Ibadah Pembukaan Bulan Pelkes GPIB', 'Pembukaan Bulan Pelkes GPIB dilakukan di Jemaat yang terdampak bencana alam', 2026, 'Q1', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', 1, 'GPIB Jemaat Siloam Sibolga - Mupel Sumut NAD', 'PENERIMAAN: Dana MS & Dana UPB...', '1 - 30 Juni 2026', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440112', NULL, 'Ibadah Penutupan Bulan Pelkes GPIB', 'Penutupan Bulan Pelkes GPIB dilakukan di Jemaat yang terdampak bencana alam', 2026, 'Q1', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', 1, 'GPIB Jemaat Pancaran Kasih Lumajang - Mupel Jawa Timur', 'PENERIMAAN: Dana MS & Dana UPB...', '1 - 30 Juni 2026', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440113', NULL, 'Pembuatan Tata Ibadah Minggu dan Keluarga', 'Tata Ibadah Minggu dan Keluarga yang inovatif dan kreatif', 2026, 'Q1', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', 1, NULL, 'Penerimaan MS: Rp 4.000.000...', '1 - 30 Juni 2026', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440114', NULL, 'Penyaluran Dana Kebencanaan sebagai bagian dari Upaya Pemulihan', 'Sebagai respon GPIB dalam menghadapi situasi tanggap darurat', 2026, 'Q1', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440001', 3, '25 Mupel', 'Penerimaan MS: Rp 105.000.000...', 'April 2026 - Maret 2027', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440115', NULL, 'Identifikasi Calon Pemimpin Perubahan (Vikaris)', 'Membekali para calon Pendeta GPIB dengan materi potensi wilayah & inkubator', 2026, 'Q2', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440001', 1, 'Griya Bina Lawang - Malang', 'Penerimaan MS & Kontribusi 59 Jemaat...', 'Juli - Agustus 2026 (4 hari)', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440116', NULL, 'Semiloka Pemberdayaan Jemaat lingkup Mupel pada Bulan Pelkes', 'Profiling Jemaat lingkup Mupel di bidang Pemberdayaan Masyarakat', 2026, 'Q1', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440001', 2, 'Online via zoom dan live streaming Youtube', 'Penerimaan MS: Rp 5.000.000...', 'Bulan Pelkes Juni & Oktober 2026', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440117', NULL, 'Partisipasi Undangan Kegiatan di Mupel/Sinodal', 'Mendukung kegiatan yang berkaitan dengan Departemen Pelkes di Unit Misioner lainnya', 2026, 'Q1', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440002', 5, 'Indonesia', 'Penerimaan MS: Rp 25.000.000...', 'April 2026 - Maret 2027', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440118', NULL, 'Pendewasaan dan Pelembagaan Pos Pelkes', 'Pendampingan Pos Pelkes/Bajem menjadi Jemaat Mandiri', 2026, 'Q1', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440002', 10, '9 Mupel target', 'Penerimaan MS: Rp 5.000.000...', 'April 2026 - Maret 2027', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440120', NULL, 'Berpartisipasi pada Peringatan Hari Pengurangan Risiko Bencana Nasional', 'Menjaga sinergisitas bersama BNPB & meningkatkan ketrampilan kebencanaan', 2026, 'Q3', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440002', 1, 'GPIB Abraham, Tangerang - Mupel Banten', 'Penerimaan MS: Rp 15.500.000...', 'October 2026', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440121', NULL, 'Identifikasi Kompetensi serta Penyusunan Panduan Pelatihan Mitigasi Kebencanaan Tingkat Dasar', 'Meningkatkan kemampuan Trainer tingkat dasar di Mupel & Jemaat', 2026, 'Q3', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440002', 1, 'Bogor', 'Penerimaan MS & Kontribusi 30 Peserta...', 'October 2026', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440122', NULL, 'Penyediaan Target Kompetensi serta Pemulihan Lingkungan dan Modul Pelatihan Tingkat Lanjut (Tahap III)', 'Meningkatkan kemampuan Trainer tahap mahir', 2026, 'Q2', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440002', 1, 'Bogor', 'Penerimaan MS & Kontribusi 30 Peserta...', 'July 2026', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440123', NULL, 'Eksplorasi Pesona Pos Pelkes dan Pospel Melalui Media Digital GPIB', 'Memperkenalkan potensi Pos Pelkes melalui media digital GPIB', 2026, 'Q1', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440002', 60, 'Kanal Youtube', 'Penerimaan MS: Rp 4.000.000...', 'Setiap hari, selama Bulan Pelkes Juni 2026', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440124', NULL, 'Penetapan Jemaat Pendamping untuk Pos Pelkes', 'PST GPIB 2026 Menetapkan Nama Jemaat Pendamping untuk Program Prioritas No 4', 2026, 'Q4', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440002', 1, 'Mupel Lampung', 'Penerimaan Kontribusi 59 Jemaat...', 'Februari - Maret 2027', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440125', NULL, 'Identifikasi Calon Pemimpin Perubahan Sesuai Kriteria PPSDI-PPK (Pendamping PA)', 'Menghasilkan pendampingan Perempuan dan Anak yang memiliki ketrampilan dan empati', 2026, 'Q3', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440002', 1, 'Jakarta', 'Penerimaan MS & Kontribusi 30 Peserta...', '7 - 9 September 2026', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440126', NULL, 'Pengkajian Kelayakan & Penelitian Pilot Project di Mupel Jatim', 'Meningkatkan tata kelola Pilot Project PMKI: Rumah Belajar & Pekerja Migran', 2026, 'Q3', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440002', 1, 'Malang, Jatim & Kesamben, Blitar', 'PENERIMAAN Dana MS - Malang dan Blitar...', '13 - 16 November 2026', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440127', NULL, 'Pengkajian Kelayakan & Penelitian Pilot Project di Batam Mupel Kepri', 'Meningkatkan tata kelola Pilot Project PMKI: Shelter Komunitas Perempuan dan Anak', 2026, 'Q4', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440002', 1, 'Batam, Kepri', 'PENERIMAAN Dana Ms - Batam...', '15 - 19 Desember 2026', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.program VALUES ('550e8400-e29b-41d4-a716-446655440128', NULL, 'Pengkajian Kelayakan & Penelitian Pilot Project di Mupel Jaksel & Banten', 'Meningkatkan tata kelola Pilot Project PMKI: Day Care & Pelayanan Lansia', 2026, 'Q1', NULL, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440002', 12, 'Jakarta Selatan & Banten', 'PENERIMAAN & PENGELUARAN: Rp 0', 'April 2026 - Maret 2027', 'DRAFT', false, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');


--
-- Data for Name: anggaran_program; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.anggaran_program VALUES ('6bff5c53-66ad-4557-97c4-50316521ed92', '550e8400-e29b-41d4-a716-446655440101', 'PENGELUARAN', 'Uang Rapat - Daring', 20, NULL, 50000, 'MANUAL', 4, NULL, 'Untuk 20 orang mengikuti secara Daring', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('10e35a7c-1f1c-4da5-acce-e11eb97118ad', '550e8400-e29b-41d4-a716-446655440101', 'PENGELUARAN', 'Uang Rapat - Luring', 19, NULL, 100000, 'MANUAL', 4, NULL, 'Untuk 19 orang mengikuti secara Luring', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('742f3b6b-f444-4e72-a11f-0c31bad9c6e7', '550e8400-e29b-41d4-a716-446655440101', 'PENGELUARAN', 'Konsumsi', 19, NULL, 35000, 'MANUAL', 4, NULL, 'Untuk 19 orang mengikuti secara Luring', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('3d734f3d-b463-4beb-891e-b9a40e570e6c', '550e8400-e29b-41d4-a716-446655440101', 'PENERIMAAN', 'Dana MS', 1, NULL, 3565000, 'MANUAL', 4, 'Dana MS', 'Biaya Rapat untuk 39 orang anggota', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('acd7e1f2-5bac-4578-a1ae-573fa92dd3d5', '550e8400-e29b-41d4-a716-446655440102', 'PENGELUARAN', 'Rapat Daring', 8, NULL, 50000, 'MANUAL', 3, NULL, 'Uang Rapat Daring untuk 8 orang selama 3x', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('401ade53-6784-4a78-ba2d-b608281444fa', '550e8400-e29b-41d4-a716-446655440102', 'PENGELUARAN', 'Rapat Luring', 8, NULL, 100000, 'MANUAL', 3, NULL, 'Uang Rapat Luring untuk 8 orang selama 3x', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('ed6e427b-1bb8-4abf-b22e-152dd3d611f2', '550e8400-e29b-41d4-a716-446655440102', 'PENGELUARAN', 'Konsumsi', 8, NULL, 35000, 'MANUAL', 3, NULL, 'Biaya Makan Rapat Luring untuk 8 orang selama 3x', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('cb8d01e1-2b8b-4cf5-a4f5-7ba604a27b3a', '550e8400-e29b-41d4-a716-446655440102', 'PENERIMAAN', 'Dana MS', 1, NULL, 4440000, 'MANUAL', 1, 'Dana MS', 'Lumpsum', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('7b041b4c-de45-415b-899a-1f7f9fe327ee', '550e8400-e29b-41d4-a716-446655440103', 'PENGELUARAN', 'Rapat Daring', 9, NULL, 50000, 'MANUAL', 3, NULL, 'Uang Rapat Daring untuk 9 orang', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('c47d7a10-ab8a-4fb7-8378-98ed1baad312', '550e8400-e29b-41d4-a716-446655440103', 'PENGELUARAN', 'Rapat Luring', 9, NULL, 100000, 'MANUAL', 3, NULL, 'Uang Rapat Luring untuk 9 orang', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('5db5403a-7b6e-471f-a575-0296bb2ada96', '550e8400-e29b-41d4-a716-446655440103', 'PENGELUARAN', 'Konsumsi', 9, NULL, 35000, 'MANUAL', 3, NULL, 'Biaya Konsumsi Rapat Luring untuk 9 orang', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('d8989a73-6bb5-445b-a8e5-19fbf5bfdcd4', '550e8400-e29b-41d4-a716-446655440103', 'PENERIMAAN', 'Dana MS', 1, NULL, 4995000, 'MANUAL', 1, 'Dana MS', 'Lumpsum', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('9e3dcf63-e174-40ee-b285-bb01fd42d97b', '550e8400-e29b-41d4-a716-446655440104', 'PENGELUARAN', 'Rapat Daring', 8, NULL, 50000, 'MANUAL', 3, NULL, 'Uang Rapat', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('8529ebea-468c-4107-98e1-ec844a2084cb', '550e8400-e29b-41d4-a716-446655440104', 'PENGELUARAN', 'Rapat Luring', 8, NULL, 100000, 'MANUAL', 3, NULL, 'Uang Rapat Luring', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('7122c65d-4230-43fd-a8b4-d3b63ea32dc8', '550e8400-e29b-41d4-a716-446655440104', 'PENGELUARAN', 'Konsumsi', 8, NULL, 35000, 'MANUAL', 3, NULL, 'Konsumsi rapat luring', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('9e653385-d894-49f8-8e63-4934c8e2d701', '550e8400-e29b-41d4-a716-446655440104', 'PENERIMAAN', 'Dana MS', 1, NULL, 4440000, 'MANUAL', 1, 'Dana MS', 'Lumpsum', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('9793f3cc-f78c-4d82-86c4-c9ca27e4d7dd', '550e8400-e29b-41d4-a716-446655440105', 'PENGELUARAN', 'Uang Rapat', 1, NULL, 0, 'MANUAL', 2, NULL, 'Tanpa Biaya, dilakukan secara Daring', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('a601d832-b0a6-4d0d-b926-0bf8ba44af08', '550e8400-e29b-41d4-a716-446655440105', 'PENERIMAAN', 'Dana MS', 1, NULL, 0, 'MANUAL', 2, 'Dana MS', 'Tanpa Biaya', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('a027f6fb-772e-424b-8391-2ca177377b63', '550e8400-e29b-41d4-a716-446655440106', 'PENGELUARAN', 'Uang Rapat', 1, NULL, 0, 'MANUAL', 4, NULL, 'Tanpa Biaya, dilakukan secara Daring', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('c75151e7-ec98-4ef8-8489-da43d6f80fbf', '550e8400-e29b-41d4-a716-446655440106', 'PENERIMAAN', 'Dana MS', 1, NULL, 0, 'MANUAL', 4, 'Dana MS', 'Tanpa Biaya', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('84635388-2e29-4558-922b-4f45a1cc932f', '550e8400-e29b-41d4-a716-446655440107', 'PENGELUARAN', 'Google Drive', 1, NULL, 500000, 'MANUAL', 1, NULL, 'Biaya sewa Google Drive selama 1 tahun', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('f3f1cdfa-60c7-4090-b557-d1ee0b469d7c', '550e8400-e29b-41d4-a716-446655440107', 'PENGELUARAN', 'Call Center PMKI', 1, NULL, 100000, 'MANUAL', 12, NULL, 'Biaya Internet untuk Cal Center PMKI', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('67b561e9-9481-4f1f-bb1f-ca69fdf1f321', '550e8400-e29b-41d4-a716-446655440107', 'PENGELUARAN', 'ATK', 1, NULL, 200000, 'MANUAL', 12, NULL, 'Pembelian Alat tulis Kantor', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('862907aa-9615-461a-835e-3d69c14e6fa7', '550e8400-e29b-41d4-a716-446655440107', 'PENGELUARAN', 'Barang Cetak', 1, NULL, 100000, 'MANUAL', 12, NULL, 'Pembuatan barang-barang cetak', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('58091397-afbc-400e-bbb1-de645a8c2a95', '550e8400-e29b-41d4-a716-446655440107', 'PENERIMAAN', 'Dana MS', 1, NULL, 5300000, 'MANUAL', 1, 'Dana MS', 'Biaya diberikan sesuai pengajuan', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('e4d13d18-6365-4832-ac41-844fda360333', '550e8400-e29b-41d4-a716-446655440108', 'PENGELUARAN', 'Diskusi dengan bidang lain', 1, NULL, 0, 'MANUAL', 1, NULL, 'Tanpa Biaya', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('8e730a3f-2461-475a-ac31-64b355e5002e', '550e8400-e29b-41d4-a716-446655440108', 'PENERIMAAN', 'Dana MS', 1, NULL, 0, 'MANUAL', 1, 'Dana MS', 'Tanpa Biaya', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('84f02f8e-ad0b-447b-b432-ed85c6d170b6', '550e8400-e29b-41d4-a716-446655440109', 'PENGELUARAN', 'Tiket Pesawat', 5, NULL, 2000000, 'MANUAL', 2, NULL, 'Jakarta-Kalbar untuk 5 orang PP', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('c5edf799-151c-48a0-93ff-a5dc03fbdcd6', '550e8400-e29b-41d4-a716-446655440109', 'PENGELUARAN', 'Transportasi Lokal', 5, NULL, 250000, 'MANUAL', 2, NULL, 'Transportasi Pontianak - Pos Pelkes PP', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('a9d2cc6a-1a5e-4339-baa3-4c2889d4e306', '550e8400-e29b-41d4-a716-446655440109', 'PENGELUARAN', 'Transportasi Rumah Bandara', 5, NULL, 300000, 'MANUAL', 1, NULL, 'Transportasi Rumah masing-masing ke Bandara PP', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('27061022-a011-499c-9d96-f8f37d6df931', '550e8400-e29b-41d4-a716-446655440109', 'PENGELUARAN', 'Konsumsi', 5, NULL, 35000, 'MANUAL', 15, NULL, 'Konsumsi selama 5 hari (@3x makan)', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('e9325026-62ed-4ffe-b43e-dc5d7c374dde', '550e8400-e29b-41d4-a716-446655440109', 'PENGELUARAN', 'Uang Saku', 5, NULL, 150000, 'MANUAL', 5, NULL, 'uang Saku selama 5 hari', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('edf11d84-afb8-4fc8-a2f1-b9224c210fe7', '550e8400-e29b-41d4-a716-446655440109', 'PENGELUARAN', 'Bantuan Pos Pelkes', 1, NULL, 20000000, 'MANUAL', 1, NULL, 'Bantuan untuk Pos Pelkes', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('e5710fee-75c6-4c83-bae3-6634fbc82eb6', '550e8400-e29b-41d4-a716-446655440109', 'PENERIMAAN', 'Dana MS', 1, NULL, 50375000, 'MANUAL', 1, 'Dana MS', 'Lumpsum, detail di rincian pengeluaran', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('9e3ee05d-0aca-49cb-990f-a04962d2e71b', '550e8400-e29b-41d4-a716-446655440110', 'PENGELUARAN', 'Pembuatan Panduan', 1, NULL, 0, 'MANUAL', 1, NULL, 'Pembuatan Panduan Kegiatan Bulan Pelkes. Tanpa Biaya', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('fbebd390-a521-4cb1-913c-c2aef13d133f', '550e8400-e29b-41d4-a716-446655440110', 'PENERIMAAN', 'Persembahan Khusus Bulan Pelkes', 1, NULL, 114500000, 'MANUAL', 1, 'Persembahan Khusus', 'dari Kotak Persembahan Khusus di semua Jemaat', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('194a2e76-8deb-43d2-8da1-dfa58b7408e9', '550e8400-e29b-41d4-a716-446655440111', 'PENGELUARAN', 'Baksos', 1, NULL, 150000000, 'MANUAL', 1, NULL, 'Baksos Pasca Bencana Sibolga', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('6fb22f2b-0013-4283-841e-a5fcdc560ca6', '550e8400-e29b-41d4-a716-446655440111', 'PENGELUARAN', 'Tiket Jakarta-Silangit', 5, NULL, 2000000, 'MANUAL', 2, NULL, 'Tiket Pesawat Jakarta-Silangit PP', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('ba1bf569-176e-4133-8521-5a750f6040fa', '550e8400-e29b-41d4-a716-446655440111', 'PENGELUARAN', 'Transport Lokal', 5, NULL, 250000, 'MANUAL', 2, NULL, 'Transportasi Silangit-Sibolga PP', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('c8dd7f5f-92e4-4f48-817f-ccef963548bb', '550e8400-e29b-41d4-a716-446655440111', 'PENGELUARAN', 'Transport Rumah - Bandara', 5, NULL, 300000, 'MANUAL', 1, NULL, 'Transportasi Rumah masing-masing ke Bandara PP', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('a17db2ef-ea81-4c46-88bf-f0f6ba5c08e7', '550e8400-e29b-41d4-a716-446655440111', 'PENGELUARAN', 'Akomodasi', 5, NULL, 500000, 'MANUAL', 2, NULL, 'Penginapan 5 kamar untuk 2 malam', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('dc93660c-9fb9-41ec-bd5f-0aed156c0357', '550e8400-e29b-41d4-a716-446655440111', 'PENGELUARAN', 'Konsumsi', 50, NULL, 50000, 'MANUAL', 9, NULL, 'Konsumsi selama 3 hari (@3x makan) untuk 50 orang', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('341b006e-4737-4bed-a47b-7849b3ec6098', '550e8400-e29b-41d4-a716-446655440111', 'PENGELUARAN', 'Uang Saku', 5, NULL, 150000, 'MANUAL', 3, NULL, 'Uang Saku selama 3 hari', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('5f477ba1-5930-424b-b654-d43c4c6715f1', '550e8400-e29b-41d4-a716-446655440111', 'PENERIMAAN', 'Dana MS', 1, NULL, 53750000, 'MANUAL', 1, 'Dana MS', 'Lumpsum', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('e3171d9c-608a-45a9-bdc6-84bfa42332b8', '550e8400-e29b-41d4-a716-446655440111', 'PENERIMAAN', 'Dana UPB', 1, NULL, 150000000, 'MANUAL', 1, 'Dana UPB', 'Diambil dari Dana Crisis Center GPIB', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('5a1cb38b-8cb0-4516-a1ca-adda16d4a1a9', '550e8400-e29b-41d4-a716-446655440112', 'PENGELUARAN', 'Baksos', 1, NULL, 50000000, 'MANUAL', 1, NULL, 'Baksos Pasca Bencana Lumajang', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('8ffa34b6-c0db-4050-bbeb-dd4e56017195', '550e8400-e29b-41d4-a716-446655440112', 'PENGELUARAN', 'Transportasi Kereta Api', 5, NULL, 550000, 'MANUAL', 2, NULL, 'Kereta Api Jakarta - Lumajang PP', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('d536c294-ed55-4c20-8f26-3af0968ba72b', '550e8400-e29b-41d4-a716-446655440112', 'PENGELUARAN', 'Transportasi Lokal', 1, NULL, 500000, 'MANUAL', 3, NULL, 'Sewa 1 unit Mobil + Supir dan BBM', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('84fb71a4-d7ac-432a-b566-69710f7485d9', '550e8400-e29b-41d4-a716-446655440112', 'PENGELUARAN', 'Transportasi Rumah - Stasiun KA', 5, NULL, 300000, 'MANUAL', 1, NULL, 'Transportasi dari Rumah masing-masing ke Stasiun KA', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('41c6a74c-b630-4362-86d3-56cd14f79883', '550e8400-e29b-41d4-a716-446655440112', 'PENGELUARAN', 'Konsumsi', 50, NULL, 50000, 'MANUAL', 9, NULL, 'Konsumsi selama 3 hari (3x makan)', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('717956b6-e1c8-4387-a721-8324fdd314a2', '550e8400-e29b-41d4-a716-446655440112', 'PENGELUARAN', 'Uang Saku', 5, NULL, 150000, 'MANUAL', 3, NULL, 'Uang Saku selama 3 hari', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('0ea5a022-2cda-4341-825e-55b5b5d9bd21', '550e8400-e29b-41d4-a716-446655440112', 'PENERIMAAN', 'Dana MS', 1, NULL, 33250000, 'MANUAL', 1, 'Dana MS', 'Lumpsum', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('fbe3af69-d3cc-4508-b797-670b15deb994', '550e8400-e29b-41d4-a716-446655440112', 'PENERIMAAN', 'Dana UPB', 1, NULL, 50000000, 'MANUAL', 1, 'Dana UPB', 'Diambil dari Dana Crisis Center GPIB', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('294e29fa-04a7-457e-a513-dbdc8cc8bf5a', '550e8400-e29b-41d4-a716-446655440113', 'PENGELUARAN', 'tata Ibadah Minggu', 4, NULL, 500000, 'MANUAL', 1, NULL, 'Pembuatan TAIB Minggu', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('ccdb24dc-20b4-4684-9635-c32541d5133e', '550e8400-e29b-41d4-a716-446655440113', 'PENGELUARAN', 'tata Ibadah Keluarga', 4, NULL, 500000, 'MANUAL', 1, NULL, 'Pembuatan TAIB Keluarga', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('708e74bf-ab24-4741-8e71-ca66869693ac', '550e8400-e29b-41d4-a716-446655440113', 'PENERIMAAN', 'Dana MS', 2, NULL, 500000, 'MANUAL', 4, 'Dana MS', 'Untuk biaya pembuatan TAIB', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('8308c0be-3571-401a-ae8c-a6cbcc92710b', '550e8400-e29b-41d4-a716-446655440114', 'PENGELUARAN', 'Assesmen dan Pemetaan', 1, NULL, 10000000, 'MANUAL', 3, NULL, 'Biaya Assesmen dan Pemetaan untuk 3x Bencana', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('386764ef-957d-4272-a574-d7837fd573c3', '550e8400-e29b-41d4-a716-446655440114', 'PENGELUARAN', 'Bantuan Bencana', 1, NULL, 25000000, 'MANUAL', 3, NULL, 'Pemberian Bantuan untuk 3x bencana', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('f054b9f9-3074-428b-bd33-ea44215589d1', '550e8400-e29b-41d4-a716-446655440114', 'PENERIMAAN', 'Dana MS', 1, NULL, 35000000, 'MANUAL', 3, 'Dana MS', '3 kali Bencana', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('6f93faab-db2d-417f-be0a-f9b0487df863', '550e8400-e29b-41d4-a716-446655440115', 'PENGELUARAN', 'Narasumber - Balai Besar Pelatihan', 4, NULL, 2500000, 'MANUAL', 1, NULL, 'Stipendium 4 orang Narasumber', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('bff46d8d-90ec-4ed3-8337-2c3e5bf8955d', '550e8400-e29b-41d4-a716-446655440115', 'PENGELUARAN', 'Moderator - Balai Besar Pertanian', 1, NULL, 500000, 'MANUAL', 2, NULL, 'Stipendium 1 orang Moderator', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('1f946d2a-dba1-4e11-bf81-038413bc432b', '550e8400-e29b-41d4-a716-446655440115', 'PENGELUARAN', 'Bahan Praktek', 59, NULL, 100000, 'MANUAL', 2, NULL, 'Bahan Praktek untuk 59 orang', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('dd8d1735-a8be-47e9-af1e-467a2df0e925', '550e8400-e29b-41d4-a716-446655440115', 'PENGELUARAN', 'Narasumber Akademisi', 6, NULL, 1500000, 'MANUAL', 1, NULL, 'Stipendium 6 orang Narasumber', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('3195032d-9033-4feb-a6e3-b912a56b82c0', '550e8400-e29b-41d4-a716-446655440115', 'PENGELUARAN', 'Narasumber - GPIB', 5, NULL, 750000, 'MANUAL', 1, NULL, 'Stipendium 5 orang Narasumber Internal', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('600621d4-1a82-4ce0-841c-2c39f4299af5', '550e8400-e29b-41d4-a716-446655440115', 'PENGELUARAN', 'Tiket Kereta Api', 6, NULL, 730000, 'MANUAL', 2, NULL, 'Tiket Kereta Api Bogor/Jakarta - Malang PP', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('1e070a31-bfda-45e2-a886-8c781efe81a3', '550e8400-e29b-41d4-a716-446655440115', 'PENGELUARAN', 'Transport Lokal', 6, NULL, 300000, 'MANUAL', 1, NULL, 'Biaya Transportasi Lokal', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('d03e9593-c605-4107-b299-cf20259c336b', '550e8400-e29b-41d4-a716-446655440115', 'PENGELUARAN', 'Konsumsi KA', 6, NULL, 100000, 'MANUAL', 2, NULL, 'Biaya Makan di perjalanan KA', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('c168bd4b-b5bb-47af-b3bb-cb2d39ec3b63', '550e8400-e29b-41d4-a716-446655440115', 'PENGELUARAN', 'Uang Saku', 6, NULL, 150000, 'MANUAL', 6, NULL, 'Uang saku untuk 6 orang selama 6 hari', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('eeecab1e-ad2d-40f3-8d77-b349a36fa069', '550e8400-e29b-41d4-a716-446655440115', 'PENGELUARAN', 'Bahan Praktikum', 59, NULL, 150000, 'MANUAL', 2, NULL, 'Biaya pengadaan bahan praktikum', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('0e334784-eb3d-4240-8e91-d0a5ad61147d', '550e8400-e29b-41d4-a716-446655440115', 'PENGELUARAN', 'ATK dan Pulsa', 1, NULL, 1500000, 'MANUAL', 1, NULL, 'Biaya pengadaan ATK dan pembelian pulsa', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('5d7efb77-b4b5-4f9c-9084-029db0c1badf', '550e8400-e29b-41d4-a716-446655440115', 'PENERIMAAN', 'Dana MS', 1, NULL, 12910000, 'MANUAL', 1, 'Dana MS', 'Lumpsum', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('fa6cc44a-065e-4fcf-bb9b-856a841280f8', '550e8400-e29b-41d4-a716-446655440115', 'PENERIMAAN', 'Konstribusi', 59, NULL, 1000000, 'MANUAL', 1, NULL, 'Uang Kontribusi 59 orang Peserta', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('2ab41685-3102-4dc3-af8c-dd7d4bb879ed', '550e8400-e29b-41d4-a716-446655440116', 'PENGELUARAN', 'Narasumber', 5, NULL, 500000, 'MANUAL', 2, NULL, 'Stipendium 5 orang Narasumber untuk 2x pertemuan', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('5a29a500-6d90-4b51-8f85-ee4fc1be8ba9', '550e8400-e29b-41d4-a716-446655440116', 'PENERIMAAN', 'Dana MS', 1, NULL, 5000000, 'MANUAL', 1, 'Dana MS', 'Lumpsum', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('29dce62b-38e6-4d1c-9530-bb3cfdf89661', '550e8400-e29b-41d4-a716-446655440117', 'PENGELUARAN', 'Kontribusi, Tiket dan Uang Saku', 1, NULL, 5000000, 'MANUAL', 5, NULL, 'Lumpsum untuk Uang Kontribusi, Tiket PP dan Uang Saku', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('e3cbb184-8b67-44cd-8aee-704a7215f25c', '550e8400-e29b-41d4-a716-446655440117', 'PENERIMAAN', 'Dana MS', 1, NULL, 5000000, 'MANUAL', 5, 'Dana MS', 'Lumpsum Biaya Kontribusi, Tiket PP dan Uang Saku', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('3d30f28d-64dc-4265-8fa2-9faae786c1ec', '550e8400-e29b-41d4-a716-446655440118', 'PENGELUARAN', 'Evaluasi dan Pembinaan', 1, NULL, 5000000, 'MANUAL', 1, NULL, 'Lumpsum', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('83d7b4b9-47b7-45e3-a0e6-462cb7e4e1fa', '550e8400-e29b-41d4-a716-446655440118', 'PENERIMAAN', 'Dana MS', 1, NULL, 5000000, 'MANUAL', 1, 'Dana MS', 'Lumpsum', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('4fdfad6d-dea1-4adc-adc4-a2fc1bbea8ad', '550e8400-e29b-41d4-a716-446655440119', 'PENGELUARAN', 'Biaya Zoom''s Meeting', 1, NULL, 0, 'MANUAL', 1, NULL, 'Tanpa Biaya, dilakukan secara Daring', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('74c86fd5-c93f-4c2c-87a6-076dbcdfae1b', '550e8400-e29b-41d4-a716-446655440119', 'PENERIMAAN', 'Dana MS', 1, NULL, 0, 'MANUAL', 1, 'Dana MS', 'Tanpa Biaya', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('48c478e2-459f-48f0-a195-db97fe21c215', '550e8400-e29b-41d4-a716-446655440120', 'PENGELUARAN', 'Transport Jakarta - Banten', 6, NULL, 300000, 'MANUAL', 1, NULL, 'Biaya Transportasi Jakarta-Banten PP', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('d92d63db-652f-4a70-aa82-2dbd5687402f', '550e8400-e29b-41d4-a716-446655440120', 'PENGELUARAN', 'Tiket Pesawat', 1, NULL, 3200000, 'MANUAL', 1, NULL, 'Biaya Tiket Pesawat Makasar-Jakarta PP', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('19796e95-f30d-4d6d-97b1-1d84319f393a', '550e8400-e29b-41d4-a716-446655440120', 'PENGELUARAN', 'Transport Rumah-Bandara', 1, NULL, 300000, 'MANUAL', 1, NULL, 'Biaya Transport Rumah-Bandara PP', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('1b101771-9a5b-4dfd-a402-bdae3a0cff85', '550e8400-e29b-41d4-a716-446655440120', 'PENGELUARAN', 'Transport Lokal', 6, NULL, 100000, 'MANUAL', 3, NULL, 'Biaya Transport Lokal untuk 6 orang', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('36710fa6-30a7-4405-9968-b4d80651552a', '550e8400-e29b-41d4-a716-446655440120', 'PENGELUARAN', 'Akomodasi', 3, NULL, 500000, 'MANUAL', 2, NULL, 'Biaya Hotel untuk 3 kamar', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('0bae8048-740f-4dc9-85cb-d63e51f35add', '550e8400-e29b-41d4-a716-446655440120', 'PENGELUARAN', 'Uang Saku', 6, NULL, 150000, 'MANUAL', 3, NULL, 'uang Saku untuk 6 orang', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('1322c264-fab7-48fe-9812-235bbf233ece', '550e8400-e29b-41d4-a716-446655440120', 'PENGELUARAN', 'Konsumsi', 6, NULL, 50000, 'MANUAL', 9, NULL, 'Biaya Makan untuk 6 orang', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('f5825424-efb5-4e36-a1b9-ca43850892cc', '550e8400-e29b-41d4-a716-446655440120', 'PENERIMAAN', 'Dana MS', 1, NULL, 15500000, 'MANUAL', 1, 'Dana MS', 'Lumpsum', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('4f39cd53-5c88-4233-9b5b-4742edcf9081', '550e8400-e29b-41d4-a716-446655440121', 'PENGELUARAN', 'Persiapan', 1, NULL, 1100000, 'MANUAL', 1, NULL, 'Biaya Persiapan (lumpsum)', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('d1a4ac8f-bad0-4e3b-a88c-de4bd73d8928', '550e8400-e29b-41d4-a716-446655440121', 'PENGELUARAN', 'Akomodasi', 50, NULL, 343530, 'MANUAL', 1, NULL, 'Biaya Akomodasi bagi 50 orang', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('bfe9558d-40e3-49b4-b899-2e4c0034e220', '550e8400-e29b-41d4-a716-446655440121', 'PENGELUARAN', 'Konsumsi', 1, NULL, 21300000, 'MANUAL', 1, NULL, 'Biaya Konsumsi - lumpsum', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('13c2ea94-6672-425a-92f7-9081f85c5b52', '550e8400-e29b-41d4-a716-446655440121', 'PENGELUARAN', 'Perlengkapan', 1, NULL, 19250000, 'MANUAL', 1, NULL, 'Biaya Perlengkapan - lumpsum', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('c5434a6a-809c-47dd-a73f-2933438423b1', '550e8400-e29b-41d4-a716-446655440121', 'PENGELUARAN', 'Honor', 1, NULL, 23000000, 'MANUAL', 1, NULL, 'Biaya Stipendium/Honor dan Uang Saku', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('86142d0e-8981-4c0d-acc7-b0388e9d7498', '550e8400-e29b-41d4-a716-446655440121', 'PENGELUARAN', 'Kesekretariatan', 1, NULL, 2250000, 'MANUAL', 1, NULL, 'Biaya Kesekretariatan', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('8182b87c-507d-44bd-8e50-849aa64f9e02', '550e8400-e29b-41d4-a716-446655440121', 'PENERIMAAN', 'Dana MS', 1, NULL, 39076500, 'MANUAL', 1, 'Dana MS', 'Lumpsum', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('3491761f-0ff4-4172-8946-26e28d442847', '550e8400-e29b-41d4-a716-446655440121', 'PENERIMAAN', 'Kontribusi', 30, NULL, 1500000, 'MANUAL', 1, 'Kontribusi', 'Kontribusi 30 orang peserta', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('781b2a0f-0f29-45c7-a593-8fa5bde03be9', '550e8400-e29b-41d4-a716-446655440122', 'PENGELUARAN', 'Panitia dan FMS', 1, NULL, 15900000, 'MANUAL', 1, NULL, 'Biaya Akomodasi, Transportasi, Konsumsi dan Uang saku', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('ca972ccb-dd07-4bdb-b741-fe49f0cf2b91', '550e8400-e29b-41d4-a716-446655440122', 'PENGELUARAN', 'Peserta dan lain-lain', 1, NULL, 48000000, 'MANUAL', 1, NULL, 'Biaya Akomodasi Peserta, Pelatih, Narasumber, PF, Tim Medis', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('5f102ceb-69a4-4959-b8d8-d7e07244a943', '550e8400-e29b-41d4-a716-446655440122', 'PENGELUARAN', 'Kesekretariatan', 1, NULL, 9900000, 'MANUAL', 1, NULL, 'Biaya Kesekretariatan', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('551d3f43-aa6e-49bd-b50c-b83a258e3a61', '550e8400-e29b-41d4-a716-446655440122', 'PENGELUARAN', 'Persiapan', 1, NULL, 1100000, 'MANUAL', 1, NULL, 'Biaya Persiapan', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('2f12a51f-00c3-408f-8d6b-2c7dc6c6eb73', '550e8400-e29b-41d4-a716-446655440122', 'PENERIMAAN', 'Dana MS', 1, NULL, 29900000, 'MANUAL', 1, 'Dana MS', 'Lumpsum', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('014f670d-43d8-477f-9de1-0317bd3f92bf', '550e8400-e29b-41d4-a716-446655440122', 'PENERIMAAN', 'Konstribusi', 30, NULL, 1500000, 'MANUAL', 1, NULL, 'Kontribusi 30 orang Peserta', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('9a5e4c8c-626b-4851-b4c8-d346a7e124e0', '550e8400-e29b-41d4-a716-446655440123', 'PENGELUARAN', 'Pulsa', 1, NULL, 200000, 'MANUAL', 3, NULL, 'Biaya Pulsa selama 3 bulan', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('b354679b-4a56-40fb-afdc-b492f5ed6726', '550e8400-e29b-41d4-a716-446655440123', 'PENGELUARAN', 'Insentif', 2, NULL, 500000, 'MANUAL', 3, NULL, 'Insentif untuk 2 orang pengelola Media Digital', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('1d76291d-cae7-4dd3-8a26-8a61e95aca21', '550e8400-e29b-41d4-a716-446655440123', 'PENGELUARAN', 'Kamera', 1, NULL, 400000, 'MANUAL', 1, NULL, 'Biaya sewa kamera dan beli batere', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('6621c1f9-0b6a-40e4-bf74-d52a04716504', '550e8400-e29b-41d4-a716-446655440123', 'PENERIMAAN', 'Dana MS', 1, NULL, 4000000, 'MANUAL', 1, 'Dana MS', 'Lumpsum', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('9c7f9730-015b-4f59-8d95-c5398c41ed12', '550e8400-e29b-41d4-a716-446655440124', 'PENGELUARAN', 'Transport', 59, NULL, 1000000, 'MANUAL', 1, NULL, 'Biaya Transportasi untuk 59 orang Pendeta', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('39269dca-347f-40af-af26-ece7fcab639a', '550e8400-e29b-41d4-a716-446655440124', 'PENGELUARAN', 'Pelatihan', 59, NULL, 1000000, 'MANUAL', 1, NULL, 'Biaya Pelatihan Peningkatan Kapasitas', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('3b33e620-b2c7-4423-a553-21f25ca5e0ae', '550e8400-e29b-41d4-a716-446655440124', 'PENERIMAAN', 'Konstribusi', 59, NULL, 2000000, 'MANUAL', 1, NULL, 'Kontribusi 59 orang Pendeta baru', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('3d1155f8-95f2-47df-92b0-155045123340', '550e8400-e29b-41d4-a716-446655440125', 'PENGELUARAN', 'Akomodasi', 35, NULL, 600000, 'MANUAL', 2, NULL, 'Akomodasi Full Board untuk 35 orang', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('044835e1-d7cc-401b-98b5-0988118da1c6', '550e8400-e29b-41d4-a716-446655440125', 'PENGELUARAN', 'Narasumber', 4, NULL, 2500000, 'MANUAL', 1, NULL, 'Stipendium Narasumber', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('b27aebea-fe92-4a79-9ad7-51d668088051', '550e8400-e29b-41d4-a716-446655440125', 'PENGELUARAN', 'Fasilitator', 4, NULL, 500000, 'MANUAL', 1, NULL, 'Stipendium Fasilitator', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('ce1dadd9-bd6f-42e6-8ba4-d0d722c4ba1a', '550e8400-e29b-41d4-a716-446655440125', 'PENGELUARAN', 'Moderator', 4, NULL, 500000, 'MANUAL', 1, NULL, 'Stipendium Moderator', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('0f3f05f7-71e5-4ce2-8042-1f3297cc2555', '550e8400-e29b-41d4-a716-446655440125', 'PENGELUARAN', 'Uang Saku', 5, NULL, 150000, 'MANUAL', 3, NULL, 'Uang Saku 5 orang Tim PMKI', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('ac3396f1-325b-48d0-8bc1-3161be2572fe', '550e8400-e29b-41d4-a716-446655440125', 'PENGELUARAN', 'Transport Lokal', 5, NULL, 100000, 'MANUAL', 1, NULL, 'Uang Transport 5 orang tim PMKI', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('0110ff3a-55be-41db-bf68-7de74c53efb6', '550e8400-e29b-41d4-a716-446655440125', 'PENGELUARAN', 'Tiket', 1, NULL, 3500000, 'MANUAL', 1, NULL, 'Tiket Pesawat Batam-Jakarta PP', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('bf2e7f93-e6fb-430a-b72d-4dcf3fcbcb0d', '550e8400-e29b-41d4-a716-446655440125', 'PENGELUARAN', 'Transport Lokal Pdt Lius', 1, NULL, 300000, 'MANUAL', 1, NULL, 'Uang Transport Lokal Pdt. Lius', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('534e2125-db9b-4ac3-843f-92497705f990', '550e8400-e29b-41d4-a716-446655440125', 'PENGELUARAN', 'Sekretariat', 1, NULL, 1000000, 'MANUAL', 1, NULL, 'Biaya Sekretariat', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('d6c04560-ed55-405c-a212-bb55792a3522', '550e8400-e29b-41d4-a716-446655440125', 'PENERIMAAN', 'Dana MS', 1, NULL, 15550000, 'MANUAL', 1, 'Dana MS', 'Lumpsum', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('6ba9dc4d-ff26-4484-a8c4-9af01ed93b69', '550e8400-e29b-41d4-a716-446655440125', 'PENERIMAAN', 'Kontribusi', 30, NULL, 1600000, 'MANUAL', 1, 'Kontribusi', 'Kontribusi 30 orang Peserta', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('3c3c0b91-3b94-4e5e-aadc-2dd31a06f6ff', '550e8400-e29b-41d4-a716-446655440126', 'PENGELUARAN', 'Akomodasi - Malang dan Kesamben', 2, NULL, 500000, 'MANUAL', 4, NULL, 'Biaya Hotel untuk 2 kamar selama 4 malam', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('15a781ad-3ed1-467c-8e62-6ba7998025df', '550e8400-e29b-41d4-a716-446655440126', 'PENGELUARAN', 'Tiket Ketera Api', 4, NULL, 1000000, 'MANUAL', 1, NULL, 'Tiket Kereta Api Jakarta-Surabaya PP', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('5960bc4e-ef08-4706-a05d-c0fda9f8cc87', '550e8400-e29b-41d4-a716-446655440126', 'PENGELUARAN', 'Uang Saku - Malang dan Kesamben', 4, NULL, 150000, 'MANUAL', 4, NULL, 'Uang saku untuk 4 orang selama 4 hari', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('05edc469-ddaa-4229-b221-c8b27774174e', '550e8400-e29b-41d4-a716-446655440126', 'PENGELUARAN', 'Transport Rumah-Stasiun KA', 4, NULL, 300000, 'MANUAL', 1, NULL, 'Uang Transport lokal Rumah-Stasiun KA PP', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('f43c5523-6f35-4390-bf6a-e8fb9ad5a94a', '550e8400-e29b-41d4-a716-446655440126', 'PENGELUARAN', 'Konsumsi - Malang dan Kesamben', 4, NULL, 150000, 'MANUAL', 4, NULL, 'Uang Makan selama 4 hari', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('5580de01-134e-440b-bb67-28938332fce8', '550e8400-e29b-41d4-a716-446655440126', 'PENGELUARAN', 'Transport Lokal - Malang dan Kesamben', 4, NULL, 100000, 'MANUAL', 4, NULL, 'Biaya transport lokal selama di Malang dan Kesamben', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('8f1d3b76-e2b8-4373-8ae4-f074826e1995', '550e8400-e29b-41d4-a716-446655440126', 'PENERIMAAN', 'Dana MS - Malang dan Blitar', 1, NULL, 15600000, 'MANUAL', 1, 'Dana MS', 'Untuk pelaksanaan di Jawa Timur', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('aa9e9ddc-dba6-4cb7-a52f-86041962af03', '550e8400-e29b-41d4-a716-446655440127', 'PENGELUARAN', 'Akomodasi - Batam', 2, NULL, 500000, 'MANUAL', 4, NULL, 'Biaya 2 kamar Hotel selama 4 malam', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('0d60c809-3b9c-40c2-a3bf-c28efbcd4d27', '550e8400-e29b-41d4-a716-446655440127', 'PENGELUARAN', 'Tiket Pesawat - Batam', 2, NULL, 3500000, 'MANUAL', 1, NULL, 'Tiket Pesawat Jakarta-Batam PP', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('ad82bc9a-38fd-47f5-a613-22b82b25bc3e', '550e8400-e29b-41d4-a716-446655440127', 'PENGELUARAN', 'Uang Saku - Batam', 3, NULL, 150000, 'MANUAL', 5, NULL, 'Uang saku untuk 3 orang selama 5 hari', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('2610525d-376b-41de-aee9-4de08dd5067d', '550e8400-e29b-41d4-a716-446655440127', 'PENGELUARAN', 'Transport Rumah-Bandara (Batam)', 2, NULL, 300000, 'MANUAL', 1, NULL, 'Biaya Transportasi Rumah - Bandara PP', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('217a4e53-5b5c-494d-b281-2b14088ad86c', '550e8400-e29b-41d4-a716-446655440127', 'PENGELUARAN', 'Konsumsi - Batam', 3, NULL, 150000, 'MANUAL', 5, NULL, 'Biaya Makan 3x sehari untuk 3 orang', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('3b6d8eea-62cd-4aa1-a3d5-b91152f106da', '550e8400-e29b-41d4-a716-446655440127', 'PENGELUARAN', 'Transport Lokal - Batam', 3, NULL, 100000, 'MANUAL', 5, NULL, 'Biaya Transportasi lokal selama di Batam', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('ace67b99-614a-4191-a451-20442de1af4d', '550e8400-e29b-41d4-a716-446655440127', 'PENERIMAAN', 'Dana Ms - Batam', 1, NULL, 17600000, 'MANUAL', 1, NULL, 'Untuk pelaksanaan di Batam', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('063b4eb6-a811-49f3-a0aa-19e96641f16b', '550e8400-e29b-41d4-a716-446655440128', 'PENGELUARAN', 'Biaya - Jakarta Selatan dan Banten', 1, NULL, 0, 'MANUAL', 13, NULL, 'Biaya untuk 12x di Jakarta Selatan dan 1x di Banten', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');
INSERT INTO public.anggaran_program VALUES ('18140b06-de74-427c-aecc-bca6d6a041d0', '550e8400-e29b-41d4-a716-446655440128', 'PENERIMAAN', 'Dana MS - Jakarta dan Banten', 1, NULL, 0, 'MANUAL', 1, 'Dana MS', 'Untuk pelaksanaan di Jakarta Selatan dan Banten', NULL, NULL, DEFAULT, '2026-06-02 14:40:18.054459+00', '2026-06-02 14:40:18.054459+00');


--
-- Data for Name: position; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.role VALUES ('83269bf0-397f-46fc-adcf-76c7ed28052c', 'SYSTEM_OWNER', 'Full system ownership', true, '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role VALUES ('985dd163-6d78-44da-bd6b-6158ba1cc371', 'SUPER_ADMIN', 'Access all modules & bypass guards', true, '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role VALUES ('c2fc5ad3-6769-4188-ab9c-de1d08d1a792', 'ADMIN', 'Operational management per bidang', true, '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role VALUES ('1bd81edc-0414-40d2-b81f-57916b18298f', 'STAFF', 'Create & submit programs/realizations', true, '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role VALUES ('4b29da0a-9573-459c-a066-00ec48035e7d', 'BENDAHARA', 'Verify & post financial entries', true, '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role VALUES ('4073bc1f-d1c3-49da-9e74-0efdf90b05c0', 'AUDITOR', 'Read-only access for compliance', true, '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role VALUES ('8eca8f50-f503-41f0-a0fc-d3dad38fee78', 'USER', 'Personal dashboard & limited views', false, '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role VALUES ('c24c5906-1573-4846-a682-37a7ca62d7df', 'PUBLIC', 'Public-facing content only', false, '2026-06-02 13:42:09.290219+00');


--
-- Data for Name: organization_membership; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: permission; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.permission VALUES ('7df331db-48e2-4717-99d4-566088cba15b', 'USER.CREATE', 'IAM', 'CREATE', NULL, '2026-06-02 13:42:09.290219+00');
INSERT INTO public.permission VALUES ('275fef54-69c2-43bb-b74a-769d97cfbd3c', 'USER.READ', 'IAM', 'READ', NULL, '2026-06-02 13:42:09.290219+00');
INSERT INTO public.permission VALUES ('36fd03c7-e5fd-4e4a-b1fb-54d11332b9b4', 'USER.UPDATE', 'IAM', 'UPDATE', NULL, '2026-06-02 13:42:09.290219+00');
INSERT INTO public.permission VALUES ('bd26f30f-a1d9-4993-8f28-bdd05c768bb2', 'ROLE.MANAGE', 'IAM', 'MANAGE', NULL, '2026-06-02 13:42:09.290219+00');
INSERT INTO public.permission VALUES ('ca1bdc9d-a686-4cf4-8fc1-c13a4f010a33', 'PERIOD.CREATE', 'ORG_MGMT', 'CREATE', NULL, '2026-06-02 13:42:09.290219+00');
INSERT INTO public.permission VALUES ('97a528a6-fa67-46fc-9f72-502c94046a87', 'PERIOD.READ', 'ORG_MGMT', 'READ', NULL, '2026-06-02 13:42:09.290219+00');
INSERT INTO public.permission VALUES ('ae338417-d599-4d68-8511-70aa722a51a3', 'PERIOD.UPDATE', 'ORG_MGMT', 'UPDATE', NULL, '2026-06-02 13:42:09.290219+00');
INSERT INTO public.permission VALUES ('2b5d4e7c-5ec4-4112-8015-bc577ba70da8', 'BIDANG.MANAGE', 'ORG_MGMT', 'MANAGE', NULL, '2026-06-02 13:42:09.290219+00');
INSERT INTO public.permission VALUES ('92337380-3236-436d-a86c-f23b823a5b40', 'MEMBERSHIP.MANAGE', 'ORG_MEMBERSHIP', 'MANAGE', NULL, '2026-06-02 13:42:09.290219+00');


--
-- Data for Name: program_indicator_quantitative; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: program_pp; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: program_protas; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: role_permission; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.role_permission VALUES ('83269bf0-397f-46fc-adcf-76c7ed28052c', '7df331db-48e2-4717-99d4-566088cba15b', '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role_permission VALUES ('985dd163-6d78-44da-bd6b-6158ba1cc371', '7df331db-48e2-4717-99d4-566088cba15b', '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role_permission VALUES ('83269bf0-397f-46fc-adcf-76c7ed28052c', '275fef54-69c2-43bb-b74a-769d97cfbd3c', '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role_permission VALUES ('985dd163-6d78-44da-bd6b-6158ba1cc371', '275fef54-69c2-43bb-b74a-769d97cfbd3c', '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role_permission VALUES ('83269bf0-397f-46fc-adcf-76c7ed28052c', '36fd03c7-e5fd-4e4a-b1fb-54d11332b9b4', '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role_permission VALUES ('985dd163-6d78-44da-bd6b-6158ba1cc371', '36fd03c7-e5fd-4e4a-b1fb-54d11332b9b4', '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role_permission VALUES ('83269bf0-397f-46fc-adcf-76c7ed28052c', 'bd26f30f-a1d9-4993-8f28-bdd05c768bb2', '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role_permission VALUES ('985dd163-6d78-44da-bd6b-6158ba1cc371', 'bd26f30f-a1d9-4993-8f28-bdd05c768bb2', '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role_permission VALUES ('83269bf0-397f-46fc-adcf-76c7ed28052c', 'ca1bdc9d-a686-4cf4-8fc1-c13a4f010a33', '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role_permission VALUES ('985dd163-6d78-44da-bd6b-6158ba1cc371', 'ca1bdc9d-a686-4cf4-8fc1-c13a4f010a33', '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role_permission VALUES ('83269bf0-397f-46fc-adcf-76c7ed28052c', '97a528a6-fa67-46fc-9f72-502c94046a87', '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role_permission VALUES ('985dd163-6d78-44da-bd6b-6158ba1cc371', '97a528a6-fa67-46fc-9f72-502c94046a87', '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role_permission VALUES ('83269bf0-397f-46fc-adcf-76c7ed28052c', 'ae338417-d599-4d68-8511-70aa722a51a3', '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role_permission VALUES ('985dd163-6d78-44da-bd6b-6158ba1cc371', 'ae338417-d599-4d68-8511-70aa722a51a3', '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role_permission VALUES ('83269bf0-397f-46fc-adcf-76c7ed28052c', '2b5d4e7c-5ec4-4112-8015-bc577ba70da8', '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role_permission VALUES ('985dd163-6d78-44da-bd6b-6158ba1cc371', '2b5d4e7c-5ec4-4112-8015-bc577ba70da8', '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role_permission VALUES ('83269bf0-397f-46fc-adcf-76c7ed28052c', '92337380-3236-436d-a86c-f23b823a5b40', '2026-06-02 13:42:09.290219+00');
INSERT INTO public.role_permission VALUES ('985dd163-6d78-44da-bd6b-6158ba1cc371', '92337380-3236-436d-a86c-f23b823a5b40', '2026-06-02 13:42:09.290219+00');


--
-- Data for Name: user_role; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: -
--

INSERT INTO realtime.schema_migrations VALUES (20211116024918, '2026-06-02 12:56:31');
INSERT INTO realtime.schema_migrations VALUES (20211116045059, '2026-06-02 12:56:31');
INSERT INTO realtime.schema_migrations VALUES (20211116050929, '2026-06-02 12:56:31');
INSERT INTO realtime.schema_migrations VALUES (20211116051442, '2026-06-02 12:56:31');
INSERT INTO realtime.schema_migrations VALUES (20211116212300, '2026-06-02 12:56:31');
INSERT INTO realtime.schema_migrations VALUES (20211116213355, '2026-06-02 12:56:31');
INSERT INTO realtime.schema_migrations VALUES (20211116213934, '2026-06-02 12:56:31');
INSERT INTO realtime.schema_migrations VALUES (20211116214523, '2026-06-02 12:56:31');
INSERT INTO realtime.schema_migrations VALUES (20211122062447, '2026-06-02 12:56:31');
INSERT INTO realtime.schema_migrations VALUES (20211124070109, '2026-06-02 12:56:31');
INSERT INTO realtime.schema_migrations VALUES (20211202204204, '2026-06-02 12:56:31');
INSERT INTO realtime.schema_migrations VALUES (20211202204605, '2026-06-02 12:56:31');
INSERT INTO realtime.schema_migrations VALUES (20211210212804, '2026-06-02 12:56:31');
INSERT INTO realtime.schema_migrations VALUES (20211228014915, '2026-06-02 12:56:31');
INSERT INTO realtime.schema_migrations VALUES (20220107221237, '2026-06-02 12:56:31');
INSERT INTO realtime.schema_migrations VALUES (20220228202821, '2026-06-02 12:56:31');
INSERT INTO realtime.schema_migrations VALUES (20220312004840, '2026-06-02 12:56:31');
INSERT INTO realtime.schema_migrations VALUES (20220603231003, '2026-06-02 12:56:31');
INSERT INTO realtime.schema_migrations VALUES (20220603232444, '2026-06-02 12:56:31');
INSERT INTO realtime.schema_migrations VALUES (20220615214548, '2026-06-02 12:56:31');
INSERT INTO realtime.schema_migrations VALUES (20220712093339, '2026-06-02 12:56:31');
INSERT INTO realtime.schema_migrations VALUES (20220908172859, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20220916233421, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20230119133233, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20230128025114, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20230128025212, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20230227211149, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20230228184745, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20230308225145, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20230328144023, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20231018144023, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20231204144023, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20231204144024, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20231204144025, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20240108234812, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20240109165339, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20240227174441, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20240311171622, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20240321100241, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20240401105812, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20240418121054, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20240523004032, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20240618124746, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20240801235015, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20240805133720, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20240827160934, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20240919163303, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20240919163305, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20241019105805, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20241030150047, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20241108114728, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20241121104152, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20241130184212, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20241220035512, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20241220123912, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20241224161212, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20250107150512, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20250110162412, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20250123174212, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20250128220012, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20250506224012, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20250523164012, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20250714121412, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20250905041441, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20251103001201, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20251120212548, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20251120215549, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20260218120000, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20260326120000, '2026-06-02 12:56:32');
INSERT INTO realtime.schema_migrations VALUES (20260514120000, '2026-06-09 10:11:41');
INSERT INTO realtime.schema_migrations VALUES (20260527120000, '2026-06-09 10:11:41');
INSERT INTO realtime.schema_migrations VALUES (20260528120000, '2026-06-09 10:11:41');
INSERT INTO realtime.schema_migrations VALUES (20260603120000, '2026-06-09 10:11:42');


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: -
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: -
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: -
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: -
--



--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: -
--

INSERT INTO storage.migrations VALUES (0, 'create-migrations-table', 'e18db593bcde2aca2a408c4d1100f6abba2195df', '2026-06-02 11:08:10.703107');
INSERT INTO storage.migrations VALUES (1, 'initialmigration', '6ab16121fbaa08bbd11b712d05f358f9b555d777', '2026-06-02 11:08:10.746854');
INSERT INTO storage.migrations VALUES (2, 'storage-schema', 'f6a1fa2c93cbcd16d4e487b362e45fca157a8dbd', '2026-06-02 11:08:10.752411');
INSERT INTO storage.migrations VALUES (3, 'pathtoken-column', '2cb1b0004b817b29d5b0a971af16bafeede4b70d', '2026-06-02 11:08:10.778533');
INSERT INTO storage.migrations VALUES (4, 'add-migrations-rls', '427c5b63fe1c5937495d9c635c263ee7a5905058', '2026-06-02 11:08:10.790845');
INSERT INTO storage.migrations VALUES (5, 'add-size-functions', '79e081a1455b63666c1294a440f8ad4b1e6a7f84', '2026-06-02 11:08:10.79543');
INSERT INTO storage.migrations VALUES (6, 'change-column-name-in-get-size', 'ded78e2f1b5d7e616117897e6443a925965b30d2', '2026-06-02 11:08:10.80108');
INSERT INTO storage.migrations VALUES (7, 'add-rls-to-buckets', 'e7e7f86adbc51049f341dfe8d30256c1abca17aa', '2026-06-02 11:08:10.80608');
INSERT INTO storage.migrations VALUES (8, 'add-public-to-buckets', 'fd670db39ed65f9d08b01db09d6202503ca2bab3', '2026-06-02 11:08:10.810626');
INSERT INTO storage.migrations VALUES (9, 'fix-search-function', 'af597a1b590c70519b464a4ab3be54490712796b', '2026-06-02 11:08:10.817135');
INSERT INTO storage.migrations VALUES (10, 'search-files-search-function', 'b595f05e92f7e91211af1bbfe9c6a13bb3391e16', '2026-06-02 11:08:10.822843');
INSERT INTO storage.migrations VALUES (11, 'add-trigger-to-auto-update-updated_at-column', '7425bdb14366d1739fa8a18c83100636d74dcaa2', '2026-06-02 11:08:10.829324');
INSERT INTO storage.migrations VALUES (12, 'add-automatic-avif-detection-flag', '8e92e1266eb29518b6a4c5313ab8f29dd0d08df9', '2026-06-02 11:08:10.834661');
INSERT INTO storage.migrations VALUES (13, 'add-bucket-custom-limits', 'cce962054138135cd9a8c4bcd531598684b25e7d', '2026-06-02 11:08:10.83949');
INSERT INTO storage.migrations VALUES (14, 'use-bytes-for-max-size', '941c41b346f9802b411f06f30e972ad4744dad27', '2026-06-02 11:08:10.844525');
INSERT INTO storage.migrations VALUES (15, 'add-can-insert-object-function', '934146bc38ead475f4ef4b555c524ee5d66799e5', '2026-06-02 11:08:10.871018');
INSERT INTO storage.migrations VALUES (16, 'add-version', '76debf38d3fd07dcfc747ca49096457d95b1221b', '2026-06-02 11:08:10.876764');
INSERT INTO storage.migrations VALUES (17, 'drop-owner-foreign-key', 'f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101', '2026-06-02 11:08:10.881283');
INSERT INTO storage.migrations VALUES (18, 'add_owner_id_column_deprecate_owner', 'e7a511b379110b08e2f214be852c35414749fe66', '2026-06-02 11:08:10.886668');
INSERT INTO storage.migrations VALUES (19, 'alter-default-value-objects-id', '02e5e22a78626187e00d173dc45f58fa66a4f043', '2026-06-02 11:08:10.893058');
INSERT INTO storage.migrations VALUES (20, 'list-objects-with-delimiter', 'cd694ae708e51ba82bf012bba00caf4f3b6393b7', '2026-06-02 11:08:10.898715');
INSERT INTO storage.migrations VALUES (21, 's3-multipart-uploads', '8c804d4a566c40cd1e4cc5b3725a664a9303657f', '2026-06-02 11:08:10.906421');
INSERT INTO storage.migrations VALUES (22, 's3-multipart-uploads-big-ints', '9737dc258d2397953c9953d9b86920b8be0cdb73', '2026-06-02 11:08:10.929661');
INSERT INTO storage.migrations VALUES (23, 'optimize-search-function', '9d7e604cddc4b56a5422dc68c9313f4a1b6f132c', '2026-06-02 11:08:10.944355');
INSERT INTO storage.migrations VALUES (24, 'operation-function', '8312e37c2bf9e76bbe841aa5fda889206d2bf8aa', '2026-06-02 11:08:10.949441');
INSERT INTO storage.migrations VALUES (25, 'custom-metadata', 'd974c6057c3db1c1f847afa0e291e6165693b990', '2026-06-02 11:08:10.955198');
INSERT INTO storage.migrations VALUES (26, 'objects-prefixes', '215cabcb7f78121892a5a2037a09fedf9a1ae322', '2026-06-02 11:08:10.960178');
INSERT INTO storage.migrations VALUES (27, 'search-v2', '859ba38092ac96eb3964d83bf53ccc0b141663a6', '2026-06-02 11:08:10.96457');
INSERT INTO storage.migrations VALUES (28, 'object-bucket-name-sorting', 'c73a2b5b5d4041e39705814fd3a1b95502d38ce4', '2026-06-02 11:08:10.968727');
INSERT INTO storage.migrations VALUES (29, 'create-prefixes', 'ad2c1207f76703d11a9f9007f821620017a66c21', '2026-06-02 11:08:10.972842');
INSERT INTO storage.migrations VALUES (30, 'update-object-levels', '2be814ff05c8252fdfdc7cfb4b7f5c7e17f0bed6', '2026-06-02 11:08:10.977361');
INSERT INTO storage.migrations VALUES (31, 'objects-level-index', 'b40367c14c3440ec75f19bbce2d71e914ddd3da0', '2026-06-02 11:08:10.981609');
INSERT INTO storage.migrations VALUES (32, 'backward-compatible-index-on-objects', 'e0c37182b0f7aee3efd823298fb3c76f1042c0f7', '2026-06-02 11:08:10.98584');
INSERT INTO storage.migrations VALUES (33, 'backward-compatible-index-on-prefixes', 'b480e99ed951e0900f033ec4eb34b5bdcb4e3d49', '2026-06-02 11:08:10.99089');
INSERT INTO storage.migrations VALUES (34, 'optimize-search-function-v1', 'ca80a3dc7bfef894df17108785ce29a7fc8ee456', '2026-06-02 11:08:10.995147');
INSERT INTO storage.migrations VALUES (35, 'add-insert-trigger-prefixes', '458fe0ffd07ec53f5e3ce9df51bfdf4861929ccc', '2026-06-02 11:08:10.999505');
INSERT INTO storage.migrations VALUES (36, 'optimise-existing-functions', '6ae5fca6af5c55abe95369cd4f93985d1814ca8f', '2026-06-02 11:08:11.003721');
INSERT INTO storage.migrations VALUES (37, 'add-bucket-name-length-trigger', '3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1', '2026-06-02 11:08:11.007945');
INSERT INTO storage.migrations VALUES (38, 'iceberg-catalog-flag-on-buckets', '02716b81ceec9705aed84aa1501657095b32e5c5', '2026-06-02 11:08:11.013069');
INSERT INTO storage.migrations VALUES (39, 'add-search-v2-sort-support', '6706c5f2928846abee18461279799ad12b279b78', '2026-06-02 11:08:11.030753');
INSERT INTO storage.migrations VALUES (40, 'fix-prefix-race-conditions-optimized', '7ad69982ae2d372b21f48fc4829ae9752c518f6b', '2026-06-02 11:08:11.034857');
INSERT INTO storage.migrations VALUES (41, 'add-object-level-update-trigger', '07fcf1a22165849b7a029deed059ffcde08d1ae0', '2026-06-02 11:08:11.039061');
INSERT INTO storage.migrations VALUES (42, 'rollback-prefix-triggers', '771479077764adc09e2ea2043eb627503c034cd4', '2026-06-02 11:08:11.043223');
INSERT INTO storage.migrations VALUES (43, 'fix-object-level', '84b35d6caca9d937478ad8a797491f38b8c2979f', '2026-06-02 11:08:11.04739');
INSERT INTO storage.migrations VALUES (44, 'vector-bucket-type', '99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3', '2026-06-02 11:08:11.05148');
INSERT INTO storage.migrations VALUES (45, 'vector-buckets', '049e27196d77a7cb76497a85afae669d8b230953', '2026-06-02 11:08:11.056236');
INSERT INTO storage.migrations VALUES (46, 'buckets-objects-grants', 'fedeb96d60fefd8e02ab3ded9fbde05632f84aed', '2026-06-02 11:08:11.066269');
INSERT INTO storage.migrations VALUES (47, 'iceberg-table-metadata', '649df56855c24d8b36dd4cc1aeb8251aa9ad42c2', '2026-06-02 11:08:11.071015');
INSERT INTO storage.migrations VALUES (48, 'iceberg-catalog-ids', 'e0e8b460c609b9999ccd0df9ad14294613eed939', '2026-06-02 11:08:11.075381');
INSERT INTO storage.migrations VALUES (49, 'buckets-objects-grants-postgres', '072b1195d0d5a2f888af6b2302a1938dd94b8b3d', '2026-06-02 11:08:11.090701');
INSERT INTO storage.migrations VALUES (50, 'search-v2-optimised', '6323ac4f850aa14e7387eb32102869578b5bd478', '2026-06-02 11:08:11.095524');
INSERT INTO storage.migrations VALUES (51, 'index-backward-compatible-search', '2ee395d433f76e38bcd3856debaf6e0e5b674011', '2026-06-02 11:08:11.767819');
INSERT INTO storage.migrations VALUES (52, 'drop-not-used-indexes-and-functions', '5cc44c8696749ac11dd0dc37f2a3802075f3a171', '2026-06-02 11:08:11.769851');
INSERT INTO storage.migrations VALUES (53, 'drop-index-lower-name', 'd0cb18777d9e2a98ebe0bc5cc7a42e57ebe41854', '2026-06-02 11:08:11.779942');
INSERT INTO storage.migrations VALUES (54, 'drop-index-object-level', '6289e048b1472da17c31a7eba1ded625a6457e67', '2026-06-02 11:08:11.782761');
INSERT INTO storage.migrations VALUES (55, 'prevent-direct-deletes', '262a4798d5e0f2e7c8970232e03ce8be695d5819', '2026-06-02 11:08:11.784611');
INSERT INTO storage.migrations VALUES (56, 'fix-optimized-search-function', 'b823ed1e418101032fa01374edc9a436e54e3ed4', '2026-06-02 11:08:11.790179');
INSERT INTO storage.migrations VALUES (57, 's3-multipart-uploads-metadata', 'f127886e00d1b374fadbc7c6b31e09336aad5287', '2026-06-02 11:08:11.796003');
INSERT INTO storage.migrations VALUES (58, 'operation-ergonomics', '00ca5d483b3fe0d522133d9002ccc5df98365120', '2026-06-02 11:08:11.800767');
INSERT INTO storage.migrations VALUES (59, 'drop-unused-functions', '38456f13e39691c2bbb4b5151d0d1cdbabd4a8c4', '2026-06-02 11:08:11.805957');
INSERT INTO storage.migrations VALUES (60, 'optimize-existing-functions-again', 'db35e1c91a9201e59f4fef8d972c2f277d68b157', '2026-06-02 11:08:11.811046');


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: -
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: -
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: -
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: -
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: -
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: -
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: -
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

\unrestrict QqS7lBpmDgs6UtaR3YGfSLViTmu9arvJpVgEr9LaqfmmQf8Ff8f8fbJN28M1h0F

