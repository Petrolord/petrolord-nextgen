-- NextGen N2 (petrolord-suite docs/scope/NextGen-ROADMAP.md, approved
-- 2026-07-14): drop the engineering-tool table families orphaned by
-- the N2 application purge. 57 tables across the casing, correlation,
-- DCA, facilities, IRR, nodal, pipeline-sizer, PTA, wells and
-- tool-project/collaboration families, plus ml_models — all verified
-- 2026-07-14 against the live DB: zero references from the surviving
-- LMS code, no outside FK children, no views, no policies on kept
-- tables using the four tool helper functions (dropped at the end).
-- Data discarded is demo-scale (largest: well_logs 194 rows).
-- Drops use CASCADE: cross-table POLICY dependencies inside the set
-- (e.g. project_metadata policies referencing project_members) break
-- plain child-first ordering, and the verified closure means CASCADE
-- can only reach other members of this same drop set.
-- NOTE: code also referenced correlation_lines and well_tops — those
-- tables never existed in this DB (never-migrated pattern).

drop table if exists public.analysis_versions cascade;
drop table if exists public.comments cascade;
drop table if exists public.correlation_comments cascade;
drop table if exists public.correlation_versions cascade;
drop table if exists public.dca_groups cascade;
drop table if exists public.dca_scenarios cascade;
drop table if exists public.design_sections cascade;
drop table if exists public.facility_equipment cascade;
drop table if exists public.facility_layout_audit_log cascade;
drop table if exists public.facility_layout_collaborators cascade;
drop table if exists public.facility_layout_comments cascade;
drop table if exists public.facility_layout_versions cascade;
drop table if exists public.facility_lines cascade;
drop table if exists public.facility_zones cascade;
drop table if exists public.file_history cascade;
drop table if exists public.files cascade;
drop table if exists public.irr_capex_schedule cascade;
drop table if exists public.irr_cashflows cascade;
drop table if exists public.irr_financial_params cascade;
drop table if exists public.irr_opex_schedule cascade;
drop table if exists public.irr_production_schedule cascade;
drop table if exists public.irr_revenues cascade;
drop table if exists public.irr_scenarios cascade;
drop table if exists public.marker_details cascade;
drop table if exists public.markers cascade;
drop table if exists public.ml_models cascade;
drop table if exists public.nodal_analysis_results cascade;
drop table if exists public.nodal_calculation_params cascade;
drop table if exists public.nodal_equipment_data cascade;
drop table if exists public.nodal_fluid_properties cascade;
drop table if exists public.nodal_well_data cascade;
drop table if exists public.pipeline_sizer_audit_log cascade;
drop table if exists public.pipeline_sizer_reports cascade;
drop table if exists public.project_invites cascade;
drop table if exists public.project_members cascade;
drop table if exists public.project_metadata cascade;
drop table if exists public.pta_analysis_results cascade;
drop table if exists public.pta_fluids cascade;
drop table if exists public.pta_reservoirs cascade;
drop table if exists public.pta_test_data_points cascade;
drop table if exists public.well_details cascade;
drop table if exists public.well_files cascade;
drop table if exists public.well_logs cascade;
drop table if exists public.well_metadata cascade;
drop table if exists public.well_uploads cascade;
drop table if exists public.analyses cascade;
drop table if exists public.casing_tubing_designs cascade;
drop table if exists public.facility_layouts cascade;
drop table if exists public.irr_analysis_results cascade;
drop table if exists public.irr_cost_structures cascade;
drop table if exists public.irr_projects cascade;
drop table if exists public.nodal_analysis_sessions cascade;
drop table if exists public.pipeline_sizer_cases cascade;
drop table if exists public.pta_pressure_tests cascade;
drop table if exists public.pta_wells cascade;
drop table if exists public.wells cascade;
drop table if exists public.projects cascade;

-- Tool RLS/RPC helpers — only ever gated the tables above.
drop function if exists public.is_project_member_or_demo(uuid);
drop function if exists public.is_project_owner(uuid);
drop function if exists public.check_is_project_owner(uuid);
drop function if exists public.get_user_wells();
