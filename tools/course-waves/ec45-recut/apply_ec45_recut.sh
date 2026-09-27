#!/usr/bin/env bash
# =============================================================================
# EC45 RECUT (decision + portfolio + joa): the owner's apply script, content-addressed.
# Adapted from tools/course-waves/pia-recut/apply_ec7_pia_recut.sh: the SQL is read out
# of the git object store at $REF, never a working tree, and must match the sha256
# pinned below or the run REFUSES. Re-pin only with `pin <ref>`.
#
# THE FILE.  migrations/20261113_ec45_recut_decision_portfolio_joa.sql
#   321 question rows (decision 141, of which 9 carry a re-derived key; portfolio 178;
#   joa 2) and the decision and portfolio Expert capstone dataset lines ("repaired"
#   goes). No capstone prompt, title or graded field moves. No begin/commit of its own:
#   this script wraps it in ONE transaction. It applies whether or not W3
#   (20261026_w3_decision / _w3_portfolio) is applied: every row is guarded on its
#   served text or the recut text, and each capstone prompt on its pre- or post-W3 md5.
#
# ATTEMPTS. Existing capstone attempts and certificates stand as issued; the file
# touches neither table and asserts both byte-identical for the three courses.
#
# THE SITE GOES WITH IT. The lessons, labs and panels ship in the NextGen zip. Apply this
# file in the same window as the upload that carries this branch, so the served banks
# never disagree with the served lessons for long.
#
# MODES
#   verify        content pin only; touches no database
#   dryrun        LOCAL SCRATCH ONLY (dryrun_ec45.sh at the worktree of NG_REPO), run
#                 twice: seeded pre-W3 and post-W3; apply, idempotent re-apply, W3 on
#                 top (pre), three negative controls
#   attempts      PRODUCTION, read-only: capstone attempts and certifications on the
#                 three courses, by tier
#   prod-status   PRODUCTION, ROLLED BACK: the file inside BEGIN ... ROLLBACK;
#                 PENDING, ALREADY-APPLIED or REFUSED (with the reason)
#   prod-dryrun   PRODUCTION, ROLLED BACK: the file inside BEGIN ... ROLLBACK with all
#                 its notices printed (rows updated per course, which W3 form), and
#                 the three courses' digest read before and after, which must agree
#   apply --prod  PRODUCTION: prod-status, then the file in one transaction
#                 (begin ... commit), then prod-status must read ALREADY-APPLIED
#   rows          the MIGRATIONS.md row to paste over NOT YET APPLIED (HELD)
#   pin <ref>     print the digest at a ref
# ENV  REF=origin/main (before the merge: origin/fix/decision-portfolio-recut)
#      NG_REPO=/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen (supabase-linked)
# EXIT 0 did the thing; 2 refused or failed.
# =============================================================================
set -u
REF=${REF:-origin/main}
NG_REPO=${NG_REPO:-/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen}
HERE=$(cd "$(dirname "$0")" && pwd)
RUN=$(mktemp -d /tmp/ec45apply.XXXXXX)
F=20261113_ec45_recut_decision_portfolio_joa
PIN=226c49c797311b27edcb71e276faf46cc9eecd90b19c807796017d2160945c01

say()    { echo "$*"; }
refuse() { echo; echo "REFUSED: $*"; echo "Nothing was applied. run artefacts: $RUN"; exit 2; }
prod_q() { ( cd "$NG_REPO" && supabase db query --linked -f "$1" 2>&1 ); }
failed() { [ "$1" -ne 0 ] || grep -qE '(^|[^A-Z_])ERROR' <<<"$2"; }

fetch() {
  git -C "$NG_REPO" rev-parse --git-dir >/dev/null 2>&1 || refuse "$NG_REPO is not a git checkout; set NG_REPO"
  git -C "$NG_REPO" fetch --quiet origin 2>/dev/null || say "  (fetch failed, using the objects already present)"
  SHA=$(git -C "$NG_REPO" rev-parse --verify --quiet "$REF^{commit}") || refuse "$REF does not resolve in $NG_REPO"
  say "repo $NG_REPO   ref $REF = ${SHA:0:9}"
  git -C "$NG_REPO" show "$SHA:migrations/$F.sql" > "$RUN/$F.sql" 2>/dev/null || refuse "$F.sql is not in $REF"
  got=$(sha256sum "$RUN/$F.sql" | cut -c1-64)
  [ "$got" = "$PIN" ] || refuse "$F.sql at $REF hashes to ${got:0:12}, pinned ${PIN:0:12}. Re-pin with: $0 pin $REF, naming the PR that moved it. Never hand-edit the digest."
  grep -qiE '^\s*(begin|commit|rollback)\s*;|start transaction' "$RUN/$F.sql" && refuse "$F.sql carries a transaction line of its own"
  say "  ok  $F  ${got:0:12} (matches its pin; no transaction line inside)"
}

HASH_Q="md5(coalesce((select string_agg(md5(q::text), ',' order by q.app_slug, q.tier, q.scope, q.module_key, q.ord) from (select app_slug, tier, scope, module_key, ord, prompt, options, answer_index, explanation, active from public.academy_quiz_questions where app_slug in ('decision', 'portfolio', 'joa')) q), '')
 || coalesce((select string_agg(md5(c::text), ',' order by c.app_slug, c.tier) from (select app_slug, tier, cert_tier, dataset, title, prompt, fields, active from public.academy_capstones where app_slug in ('decision', 'portfolio', 'joa')) c), ''))"

state() {  # PENDING | ALREADY-APPLIED | REFUSED:<reason>
  { echo "begin;"
    echo "create temp table ec45_before on commit drop as select $HASH_Q as h;"
    cat "$RUN/$F.sql"; echo
    echo "select case when (select h from ec45_before) = $HASH_Q then 'ALREADY-APPLIED' else 'PENDING' end as ec45_state;"
    echo "rollback;"; } > "$RUN/state.sql"
  out=$(prod_q "$RUN/state.sql"); rc=$?
  echo "$out" > "$RUN/state.out"
  if failed $rc "$out"; then echo "REFUSED:$(grep -m1 -oE '(ec45 recut refused|ERROR)[^"]*' <<<"$out" | cut -c1-240)"
  elif grep -q PENDING <<<"$out"; then echo PENDING
  elif grep -q ALREADY-APPLIED <<<"$out"; then echo ALREADY-APPLIED
  else echo UNKNOWN; fi
}

digest() {
  echo "select 'DIG|' || $HASH_Q as ec45_digest;" > "$RUN/digest.sql"
  prod_q "$RUN/digest.sql" | grep -oE 'DIG\|[0-9a-f]{32}' | head -1
}

prod_dryrun() {
  before=$(digest); [ -n "$before" ] || refuse "could not read the production digest"
  { echo "begin;"; cat "$RUN/$F.sql"; echo
    echo "select 'W3FORM|' || string_agg(app_slug || ' ' || case md5(prompt) when '9c474d00ca4f4b701116d084e1d22d06' then 'pre-W3' when '9099fda79bc00d69eaef2d67fad28009' then 'post-W3' when '2ea18ad13ac9723309bce7467bc3291f' then 'pre-W3' when '4fd416a471af05473c90bb7f526cf591' then 'post-W3' else 'unknown' end, ', ' order by app_slug) as ec45_w3 from public.academy_capstones where app_slug in ('decision', 'portfolio') and tier = 'advanced' and active;"
    echo "rollback;"; } > "$RUN/dryrun.sql"
  out=$(prod_q "$RUN/dryrun.sql"); rc=$?
  echo "$out" > "$RUN/dryrun.out"
  if failed $rc "$out"; then echo "$out" | grep -E 'ERROR|refused' | head -3; refuse "the file raised inside the rolled-back transaction"; fi
  grep -oE 'ec45 recut: [^"]*' <<<"$out" | sed 's/^/  /'
  say "  Expert capstone prompts: $(grep -oE 'W3FORM\|[^"]*' <<<"$out" | head -1 | cut -d'|' -f2)"
  after=$(digest)
  [ "$before" = "$after" ] || refuse "the production digest moved across a rolled-back run (${before#DIG|} -> ${after#DIG|})"
  say "  rolled back: the three courses' digest is unchanged (${after#DIG|})"
}

attempts() {
  cat > "$RUN/attempts.sql" <<'SQL'
select 'ATT|' || coalesce(string_agg(t, ' | ' order by t), 'none') as ec45_attempts from (
  select 'capstone_attempts ' || app_slug || '/' || tier || ' ' || count(*) t from public.academy_capstone_attempts where app_slug in ('decision', 'portfolio', 'joa') group by app_slug, tier
  union all select 'certifications ' || app_slug || '/' || tier || ' ' || count(*) from public.academy_certifications where app_slug in ('decision', 'portfolio', 'joa') group by app_slug, tier) x;
SQL
  out=$(prod_q "$RUN/attempts.sql")
  line=$(grep -oE 'ATT\|[^"]+' <<<"$out" | head -1)
  [ -n "$line" ] || { echo "$out" | tail -5; refuse "could not read the attempt counts"; }
  say "  ${line#ATT|}"
  say "  These stand as issued. No graded field moves; the file touches neither table."
}

case "${1:-verify}" in
  verify)  fetch; say "VERIFY ONLY. No database was touched." ;;
  pin)     [ $# -ge 2 ] || { echo "usage: $0 pin <ref>"; exit 2; }
           git -C "$NG_REPO" show "$2:migrations/$F.sql" | sha256sum | awk '{print "PIN=" $1}' ;;
  dryrun)  for s in pre post; do
             W3=$s NG="$NG_REPO" bash "$HERE/dryrun_ec45.sh" > "$RUN/dryrun_$s.log" 2>&1; rc=$?
             grep -v '^seed ok' "$RUN/dryrun_$s.log" | tail -30
             [ $rc = 0 ] || refuse "the scratch dry run ($s-W3) failed; log $RUN/dryrun_$s.log"
           done ;;
  attempts) fetch; say "target: PRODUCTION (read-only)"; attempts ;;
  prod-status) fetch; say "target: PRODUCTION (rolled back)"; st=$(state); say "  $F: $st"; case "$st" in PENDING|ALREADY-APPLIED) ;; *) exit 2 ;; esac ;;
  prod-dryrun) fetch; say "target: PRODUCTION (the whole file, rolled back)"; prod_dryrun ;;
  apply)
    [ "${2:-}" = "--prod" ] || refuse "apply writes PRODUCTION; pass --prod explicitly (run verify, dryrun, attempts, prod-status and prod-dryrun first)"
    fetch
    st=$(state); say "pre-check: $F $st"
    case "$st" in
      ALREADY-APPLIED) say "Nothing to do: production already carries the recut."; exit 0 ;;
      PENDING) ;;
      *) refuse "prod-status is $st" ;;
    esac
    { echo "begin;"; cat "$RUN/$F.sql"; echo; echo "commit;"; } > "$RUN/apply.sql"
    out=$(prod_q "$RUN/apply.sql"); rc=$?
    echo "$out" > "$RUN/apply.out"
    if failed $rc "$out"; then echo "$out" | grep -E 'ERROR|refused' | head -3; refuse "the file failed and rolled back"; fi
    grep -oE 'ec45 recut: [^"]*' <<<"$out" | sed 's/^/  /'
    st=$(state); say "post-check: $F $st"
    [ "$st" = ALREADY-APPLIED ] || refuse "the post-check reads $st"
    say "APPLIED. Now run: $0 rows, and paste the row over its NOT YET APPLIED (HELD) row in MIGRATIONS.md." ;;
  rows) d=$(date -u +%F)
        echo "| $d | \`$F.sql\` | EC45 recut, decision + portfolio + joa: 321 question rows (decision 141 with 9 re-derived keys, portfolio 178, joa 2) and the decision and portfolio Expert dataset lines; no prompt or graded field moves; attempts stand as issued | **APPLIED $d** by the owner via tools/course-waves/ec45-recut/apply_ec45_recut.sh apply --prod from $REF (content pinned by sha256; scratch dry run pre- and post-W3, rolled-back prod-status and prod-dryrun first) |" ;;
  *) refuse "unknown mode '${1:-}' (verify | dryrun | attempts | prod-status | prod-dryrun | apply --prod | rows | pin <ref>)" ;;
esac
