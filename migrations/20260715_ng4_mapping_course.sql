-- NG4 — Mapping Beginner
-- (petrolord-suite docs/scope/NextGen-Geoscience-Courses-PLAN.md §2).
--
-- Fourth course of the geoscience path. Capstone machinery, prereq gate
-- (welldata certification required) and scope ladder are in place —
-- this migration only seeds the capstone and opens the catalog row.
--
-- Teaching dataset: the Ekene teaching wells with map coordinates
-- (src/lib/mappingTeaching.js — the same field the Well Correlation
-- course sections, plus Ekene-5/6 beyond the section line). The
-- learner grids TOP_SAND with the central thin-plate-spline gridding
-- engine at the capstone settings (100 m cell, 2-cell pad, 800 m
-- extrapolation limit — wells are ~1 km apart, and the limit itself is
-- a lesson: a grid only lives near data support).
--
-- Oracle reproduced by running exactly this pipeline in Node against
-- @petrolord/engines before this migration was written (see the NG4
-- pentest doc): 6 control points, a 25×20 node grid, 201 live nodes,
-- crest 1539.72 m (BETWEEN the wells, near Ekene-6 — TPS interpolates a
-- culmination the wells only bracket), 1542.62 m at prospect P-1
-- (1600, 1600), and a 10 m contour step.

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values (
  'mapping', 'beginner', 'associate',
  'mapping/ekene-topsand',
  'Map the Ekene TOP_SAND surface',
  'Grid TOP_SAND at the capstone settings (100 m cell) and read the map panel: report the control-point count, the grid width in nodes, how many nodes were mapped, the crest depth, the depth at prospect P-1, and the contour interval the map uses.',
  jsonb_build_array(
    jsonb_build_object('key','n_control_points','label','Control points used',            'unit','count','expected',6,                 'tol',0),
    jsonb_build_object('key','grid_nx',         'label','Grid width',                     'unit','nodes','expected',25,                'tol',0),
    jsonb_build_object('key','live_nodes',      'label','Mapped (live) grid nodes',       'unit','count','expected',201,               'tol',0),
    jsonb_build_object('key','crest_depth_m',   'label','Crest (shallowest) depth',       'unit','m',    'expected',1539.7181396484375,'tol',0.5),
    jsonb_build_object('key','depth_at_p1_m',   'label','Depth at prospect P-1',          'unit','m',    'expected',1542.619873046875, 'tol',0.5),
    jsonb_build_object('key','contour_step_m',  'label','Contour interval',               'unit','m',    'expected',10,                'tol',0)
  ))
on conflict (app_slug, tier) do nothing;

update public.academy_apps set status = 'available' where slug = 'mapping';
