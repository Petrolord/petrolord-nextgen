#!/usr/bin/env bash
# =============================================================================
# EC1 MID-YEAR RECUT (cashflow): the owner's apply script, content-addressed.
# Adapted from tools/course-waves/pia-recut/apply_ec7_pia_recut.sh: the SQL is
# read out of the git object store at $REF, never a working tree, and must match
# the sha256 pinned below or the run REFUSES. Re-pin only with `pin <ref>`.
#
# THE FILE.  migrations/20261014090000_ec1_midyear_recut_cashflow.sql
#   21 cashflow question rows (all Professional), the Professional capstone's
#   mid-year sentence and jv_npv_mid_year_usd (20030970.834339857 ->
#   21301227.52139557). No keyed index moves. No begin/commit of its own: this
#   script wraps it in ONE transaction.
#
# ATTEMPTS. Quiz and capstone attempts are scored once, at submission, and never
# re-scored; the file touches no attempt or certification, notices how many it
# found and asserts all of them byte-identical after it.
#
# THE SITE GOES WITH IT. The lessons, lab and panels ship in the NextGen zip.
# Apply this file in the same window as the upload that carries this branch.
#
# MODES
#   verify        content pin only; touches no database
#   dryrun        LOCAL SCRATCH ONLY (dryrun_ec1_midyear.sh): seed, apply,
#                 idempotent re-apply, three negative controls
#   attempts      PRODUCTION, read-only: cashflow quiz attempts, capstone
#                 attempts and certifications, by tier
#   prod-status   PRODUCTION, ROLLED BACK: the file inside BEGIN ... ROLLBACK;
#                 PENDING, ALREADY-APPLIED or REFUSED (with the reason)
#   apply --prod  PRODUCTION: prod-status, then the file in one transaction
#                 (begin ... commit), then prod-status must read ALREADY-APPLIED
#   rows          the MIGRATIONS.md row to paste over NOT YET APPLIED (HELD)
#   pin <ref>     print the digest at a ref
# ENV  REF=origin/main (before the merge: origin/fix/ec1-mid-year-discounting)
#      NG_REPO=/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen (supabase-linked)
# EXIT 0 did the thing; 2 refused or failed.
# =============================================================================
set -u
REF=${REF:-origin/main}
NG_REPO=${NG_REPO:-/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen}
HERE=$(cd "$(dirname "$0")" && pwd)
RUN=$(mktemp -d /tmp/ec1midapply.XXXXXX)
F=20261014090000_ec1_midyear_recut_cashflow
PIN=bd54d35d736628cb807f1a636736696c1e973af8a56f72877965359f84ebb196
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
  say "  ok  $F  ${got:0:12} (matches its pin)"
}

HASH_Q="md5(coalesce((select string_agg(md5(q::text), ',' order by q.app_slug, q.tier, q.scope, q.module_key, q.ord) from (select app_slug, tier, scope, module_key, ord, prompt, options, answer_index, explanation, active from public.academy_quiz_questions where app_slug = 'cashflow') q), '')
 || coalesce((select string_agg(md5(c::text), ',' order by c.app_slug, c.tier) from (select app_slug, tier, cert_tier, dataset, title, prompt, fields, active from public.academy_capstones where app_slug = 'cashflow') c), ''))"

state() {  # PENDING | ALREADY-APPLIED | REFUSED:<reason>
  { echo "begin;"
    echo "create temp table ec1mid_before on commit drop as select $HASH_Q as h;"
    cat "$RUN/$F.sql"; echo
    echo "select case when (select h from ec1mid_before) = $HASH_Q then 'ALREADY-APPLIED' else 'PENDING' end as ec1mid_state;"
    echo "rollback;"; } > "$RUN/state.sql"
  out=$(prod_q "$RUN/state.sql"); rc=$?
  echo "$out" > "$RUN/state.out"
  if failed $rc "$out"; then echo "REFUSED:$(grep -m1 -oE '(ec1 midyear recut refused|ERROR)[^"]*' <<<"$out" | cut -c1-220)"
  elif grep -q PENDING <<<"$out"; then echo PENDING
  elif grep -q ALREADY-APPLIED <<<"$out"; then echo ALREADY-APPLIED
  else echo UNKNOWN; fi
}

attempts() {
  cat > "$RUN/attempts.sql" <<'SQL'
select 'ATT|' || coalesce(string_agg(t, ' | ' order by t), 'none') as ec1mid_attempts from (
  select 'quiz_attempts ' || tier || '/' || scope || ' ' || count(*) t from public.academy_quiz_attempts where app_slug = 'cashflow' group by tier, scope
  union all select 'capstone_attempts ' || tier || ' ' || count(*) from public.academy_capstone_attempts where app_slug = 'cashflow' group by tier
  union all select 'certifications ' || tier || ' ' || count(*) from public.academy_certifications where app_slug = 'cashflow' group by tier) x;
SQL
  out=$(prod_q "$RUN/attempts.sql")
  line=$(grep -oE 'ATT\|[^"]+' <<<"$out" | head -1)
  [ -n "$line" ] || { echo "$out" | tail -5; refuse "could not read the attempt counts"; }
  say "  ${line#ATT|}"
  say "  These stand as issued: nothing re-scores a submitted attempt, no keyed index moves, and the file asserts every one byte-identical."
}

case "${1:-verify}" in
  verify)  fetch; say "VERIFY ONLY. No database was touched." ;;
  pin)     [ $# -ge 2 ] || { echo "usage: $0 pin <ref>"; exit 2; }
           git -C "$NG_REPO" show "$2:migrations/$F.sql" | sha256sum | awk '{print "PIN=" $1}' ;;
  dryrun)  bash "$HERE/dryrun_ec1_midyear.sh" | tail -20 ;;
  attempts) fetch; say "target: PRODUCTION (read-only)"; attempts ;;
  prod-status) fetch; say "target: PRODUCTION (rolled back)"; st=$(state); say "  $F: $st"; case "$st" in PENDING|ALREADY-APPLIED) ;; *) exit 2 ;; esac ;;
  apply)
    [ "${2:-}" = "--prod" ] || refuse "apply writes PRODUCTION; pass --prod explicitly (run verify, dryrun, attempts and prod-status first)"
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
    grep -oE 'ec1 midyear recut: [^"]*' <<<"$out" | sed 's/^/  /'
    st=$(state); say "post-check: $F $st"
    [ "$st" = ALREADY-APPLIED ] || refuse "the post-check reads $st"
    say "APPLIED. Now run: $0 rows, and paste the row over its NOT YET APPLIED (HELD) row in MIGRATIONS.md." ;;
  rows) d=$(date -u +%F)
        echo "| $d | \`$F.sql\` | EC1 mid-year recut (engines 3.12.3, owner decision 2026-10-14): 21 cashflow Professional question rows and the Professional capstone (mid-year sentence; jv_npv_mid_year_usd 20030970.834339857 -> 21301227.52139557); no keyed index moves; attempts and certifications stand as issued | **APPLIED $d** by the owner via tools/course-waves/cashflow/midyear-recut/apply_ec1_midyear.sh apply --prod from $REF (content pinned by sha256; scratch dry run and rolled-back prod-status first) |" ;;
  *) refuse "unknown mode '${1:-}' (verify | dryrun | attempts | prod-status | apply --prod | rows | pin <ref>)" ;;
esac
