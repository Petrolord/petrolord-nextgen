# Migration log (petrolord-nextgen)

Suite discipline (petrolord-suite CLAUDE.md database rules): every
schema change ships as a migration file under `migrations/`, applied
after a rollback-wrapped dry run, and logged here.

| Date (UTC) | Migration file | Purpose | Applied |
|---|---|---|---|
| 2026-07-14 | `20260714_n2_drop_tool_tables.sql` | N2 (NextGen-ROADMAP): drop the 57 engineering-tool tables orphaned by the application purge (casing/correlation/DCA/facilities/IRR/nodal/pipeline-sizer/PTA/wells/tool-project families + ml_models) and their 4 RLS helper functions. Verified pre-drop: zero surviving-code references, no outside FK children, no views, no kept-table policies on the helpers; demo-scale data only (max well_logs 194 rows). CASCADE used deliberately — in-set policy cross-dependencies break child-first ordering and the closure is verified. Post-apply: 150→93 public tables; courses/lessons/profiles intact. Note: `correlation_lines`/`well_tops` were referenced by deleted code but never existed in the DB | 2026-07-14 |

Migrations before this log predate it; see `migrations/` for the set.
