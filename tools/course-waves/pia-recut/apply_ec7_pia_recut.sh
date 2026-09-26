#!/usr/bin/env bash
# =============================================================================
# EC7 PIA RECUT (cashflow + fiscal): the owner's apply script, content-addressed.
# Adapted from tools/course-waves/appliedai/apply_d5_appliedai.sh: the SQL is read
# out of the git object store at $REF, never a working tree, and must match the
# sha256 pinned below or the run REFUSES. Re-pin only with `pin <ref>`.
#
# THE FILE.  migrations/20261108_ec7_pia_recut_cashflow_fiscal.sql
#   264 question rows (cashflow 154, fiscal 110), the cashflow Professional prompt,
#   the cashflow Expert capstone (dataset, prompt, six graded fields), the fiscal
#   Expert prompt and one fiscal tolerance (0.001 -> 0.0003). No begin/commit of
#   its own: this script wraps it in ONE transaction.
#
# ATTEMPTS. Lead decision L1: existing capstone attempts and certificates stand as
# issued; only new attempts use the new keys. The file never re-scores, notices
# every attempt on the two tiers whose grading moves, and asserts the stored
# attempts and certifications of both courses are byte-identical after it.
#
# THE SITE GOES WITH IT. The lessons, labs and panels ship in the NextGen zip. Apply
# this file in the same window as the upload that carries this branch, so the
# served banks and capstone never disagree with the served lessons for long.
#
# MODES
#   verify        content pin only; touches no database
#   dryrun        LOCAL SCRATCH ONLY (dryrun_ec7.sh at the worktree of NG_REPO):
#                 seed replay, apply, idempotent re-apply, two negative controls
#   attempts      PRODUCTION, read-only: capstone attempts and certifications on
#                 cashflow and fiscal, by tier
#   prod-status   PRODUCTION, ROLLED BACK: the file inside BEGIN ... ROLLBACK;
#                 PENDING, ALREADY-APPLIED or REFUSED (with the reason)
#   apply --prod  PRODUCTION: prod-status, then the file in one transaction
#                 (begin ... commit), then prod-status must read ALREADY-APPLIED
#   rows          the MIGRATIONS.md row to paste over NOT YET APPLIED (HELD)
#   pin <ref>     print the digest at a ref
# ENV  REF=origin/main (before the merge: origin/fix/cashflow-fiscal-pia-recut)
#      NG_REPO=/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen (supabase-linked)
# EXIT 0 did the thing; 2 refused or failed.
# =============================================================================
set -u
REF=${REF:-origin/main}
NG_REPO=${NG_REPO:-/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen}
HERE=$(cd "$(dirname "$0")" && pwd)
RUN=$(mktemp -d /tmp/ec7apply.XXXXXX)
F=20261108_ec7_pia_recut_cashflow_fiscal
PIN=aa2cb7ce5023466d99cb19ff08eadd19b8993547ff3bbcc8251949bb7bd40b32

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

HASH_Q="md5(coalesce((select string_agg(md5(q::text), ',' order by q.app_slug, q.tier, q.scope, q.module_key, q.ord) from (select app_slug, tier, scope, module_key, ord, prompt, options, answer_index, explanation, active from public.academy_quiz_questions where app_slug in ('cashflow', 'fiscal')) q), '')
 || coalesce((select string_agg(md5(c::text), ',' order by c.app_slug, c.tier) from (select app_slug, tier, cert_tier, dataset, title, prompt, fields, active from public.academy_capstones where app_slug in ('cashflow', 'fiscal')) c), ''))"

state() {  # PENDING | ALREADY-APPLIED | REFUSED:<reason>
  { echo "begin;"
    echo "create temp table ec7_before on commit drop as select $HASH_Q as h;"
    cat "$RUN/$F.sql"; echo
    echo "select case when (select h from ec7_before) = $HASH_Q then 'ALREADY-APPLIED' else 'PENDING' end as ec7_state;"
    echo "rollback;"; } > "$RUN/state.sql"
  out=$(prod_q "$RUN/state.sql"); rc=$?
  echo "$out" > "$RUN/state.out"
  if failed $rc "$out"; then echo "REFUSED:$(grep -m1 -oE '(ec7 pia recut refused|ERROR)[^"]*' <<<"$out" | cut -c1-220)"
  elif grep -q PENDING <<<"$out"; then echo PENDING
  elif grep -q ALREADY-APPLIED <<<"$out"; then echo ALREADY-APPLIED
  else echo UNKNOWN; fi
}

attempts() {
  cat > "$RUN/attempts.sql" <<'SQL'
select 'ATT|' || coalesce(string_agg(t, ' | ' order by t), 'none') as ec7_attempts from (
  select 'capstone_attempts ' || app_slug || '/' || tier || ' ' || count(*) t from public.academy_capstone_attempts where app_slug in ('cashflow', 'fiscal') group by app_slug, tier
  union all select 'certifications ' || app_slug || '/' || tier || ' ' || count(*) from public.academy_certifications where app_slug in ('cashflow', 'fiscal') group by app_slug, tier) x;
SQL
  out=$(prod_q "$RUN/attempts.sql")
  line=$(grep -oE 'ATT\|[^"]+' <<<"$out" | head -1)
  [ -n "$line" ] || { echo "$out" | tail -5; refuse "could not read the attempt counts"; }
  say "  ${line#ATT|}"
  say "  These stand as issued (lead decision L1). The file re-scores nothing; cashflow/advanced and fiscal/beginner attempts are the ones taken against keys this file moves."
}

case "${1:-verify}" in
  verify)  fetch; say "VERIFY ONLY. No database was touched." ;;
  pin)     [ $# -ge 2 ] || { echo "usage: $0 pin <ref>"; exit 2; }
           git -C "$NG_REPO" show "$2:migrations/$F.sql" | sha256sum | awk '{print "PIN=" $1}' ;;
  dryrun)  NG="$NG_REPO" bash "$HERE/dryrun_ec7.sh" | tail -20 ;;
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
    grep -oE 'ec7 pia recut: [^"]*' <<<"$out" | sed 's/^/  /'
    st=$(state); say "post-check: $F $st"
    [ "$st" = ALREADY-APPLIED ] || refuse "the post-check reads $st"
    say "APPLIED. Now run: $0 rows, and paste the row over its NOT YET APPLIED (HELD) row in MIGRATIONS.md." ;;
  rows) d=$(date -u +%F)
        echo "| $d | \`$F.sql\` | EC7 PIA recut, cashflow + fiscal: 264 question rows (cashflow 154, fiscal 110), cashflow Expert capstone re-keyed (six fields), cashflow Professional and fiscal Expert prompts, fiscal con_payback_year_cum_ncf_musd tol 0.001 -> 0.0003; attempts stand as issued | **APPLIED $d** by the owner via tools/course-waves/pia-recut/apply_ec7_pia_recut.sh apply --prod from $REF (content pinned by sha256; scratch dry run and rolled-back prod-status first) |" ;;
  *) refuse "unknown mode '${1:-}' (verify | dryrun | attempts | prod-status | apply --prod | rows | pin <ref>)" ;;
esac
