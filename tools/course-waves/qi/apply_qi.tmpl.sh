#!/usr/bin/env bash
# =============================================================================
# QI "Quantitative Interpretation" SEED LADDER, content-addressed. The owner's
# script. Adapted from SC4 marine's apply_sc4_marine.sh: content pins read out
# of the git object store, never a working tree, and the same modes (verify,
# dryrun, attempts, prod-status, prod-dryrun, apply --prod, apply --prod
# --go-live, rows, pin).
#
# WHY CONTENT PINS. This repository squash merges, so a pinned commit sha is
# wrong the moment the PR lands; file CONTENT survives a squash unchanged. Each
# file is resolved with `git show` at $REF and must match the sha256 pinned
# below, or the run REFUSES and names the file. Re-pin only with `pin <ref>`.
#
# THE FILES, in the order they apply (names stamped with their real creation
# time, UTC; ship_names.json in tools/course-waves/qi is the record):
#   <ts>_qi_course              catalogue row (coming_soon, geoscience,
#                               path_order 80, prerequisite welldata,
#                               course_type app) + the Associate capstone
#   <ts>_qi_<tier>_deep         a tier's structure and 132 questions
#   <ts>_qi_<tier>_capstone     the Professional or Expert capstone, written
#                               only once its engines pass the extraction gate
#   <ts>_qi_go_live             HELD. coming_soon -> available, behind the
#                               completeness, shape, grader, prompt, engine
#                               ledger, second-route, oracle and trap checks.
#                               It REFUSES while any tier lacks its capstone.
# The ladder applies only the files pinned below; a tier still pending has no
# file and no pin yet. THE COURSE SEED GOES FIRST (the other files reference
# the course row through a foreign key on app_slug).
#
# =========================== THE UPLOAD GATE ================================
# The lessons, the teaching lab, the four explorer panels and the capstone
# case files ship in the NextGen ZIP. Upload the zip FIRST; the seeds may then
# be applied (the course stays coming_soon, invisible to learners). The go-live
# runs ONLY after the deployed site serves /dashboard/apps/qi and every tier
# has its capstone: `apply --prod --go-live` will not run until you type the
# route.
# ============================================================================
#
# ENV
#   REF=origin/main (before the merge: REF=origin/feat/qi-course)
#   NG_REPO=/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen
#     (the checkout `supabase link`ed to NextGen production)
# EXIT: 0 did the thing; 2 refused or failed.
# =============================================================================
set -u

REF=${REF:-origin/main}
NG_REPO=${NG_REPO:-/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen}
HERE=$(cd "$(dirname "$0")" && pwd)
RUN=$(mktemp -d /tmp/qiapply.XXXXXX)
SLUG=qi

# @@PINS@@ (written by pin_qi.py from the committed tree; never by hand)
SEEDS="@@SEEDS@@"
GOLIVE=@@GOLIVE@@
FILES="$SEEDS
$GOLIVE"
digest_for() {
  case $1 in
@@CASES@@
    *) echo UNPINNED ;;
  esac
}

say()    { echo "$*"; }
refuse() { echo; echo "REFUSED: $*"; echo "Nothing was applied. run artefacts: $RUN"; exit 2; }
# stdin is closed for every production call, so a confirmation piped into
# `apply --prod --go-live` is read by the prompt and by nothing else.
prod_q() { ( cd "$NG_REPO" && supabase db query --linked -f "$1" 2>&1 < /dev/null ); }
failed() { [ "$1" -ne 0 ] || grep -qE '(^|[^A-Z_])ERROR' <<<"$2"; }

fetch() {
  git -C "$NG_REPO" rev-parse --git-dir >/dev/null 2>&1 || refuse "$NG_REPO is not a git checkout; set NG_REPO"
  git -C "$NG_REPO" fetch --quiet origin 2>/dev/null || say "  (fetch failed, using the objects already present)"
  SHA=$(git -C "$NG_REPO" rev-parse --verify --quiet "$REF^{commit}") || refuse "$REF does not resolve in $NG_REPO"
  say "repo $NG_REPO   ref $REF = ${SHA:0:9}"
  bad=0
  for f in $FILES; do
    want=$(digest_for "$f")
    if ! git -C "$NG_REPO" show "$SHA:migrations/$f.sql" > "$RUN/$f.sql" 2>/dev/null; then
      say "  MISSING   $f.sql is not in $REF"; bad=1; continue
    fi
    got=$(sha256sum "$RUN/$f.sql" | cut -c1-64)
    if [ "$got" = "$want" ]; then printf '  ok        %-40s %s\n' "$f" "${got:0:12}"
    else printf '  STALE     %-40s expected %s found %s\n' "$f" "${want:0:12}" "${got:0:12}"; bad=1; fi
  done
  [ $bad = 0 ] || refuse "the SQL at $REF is not the content this ladder was pinned to. If a later PR legitimately moved it, re-pin with: $0 pin $REF, and say in that commit which PR moved it. Never hand-edit a digest."
  say "all $(echo "$FILES" | grep -c .) files match their pinned content"
}

# The hash of every qi row the seeds write, so a seed inside BEGIN ... ROLLBACK
# can say whether it would change anything.
HASH_Q="md5(coalesce((select string_agg(md5(a::text), ',') from (select slug, name, module, path_order, prereq_slug from public.academy_apps where slug = 'qi') a), '')
 || coalesce((select string_agg(md5(s::text), ',' order by s.tier) from (select tier, structure, content_version, active from public.academy_course_structures where app_slug = 'qi') s), '')
 || coalesce((select string_agg(md5(q::text), ',' order by q.tier, q.scope, q.module_key, q.ord) from (select tier, scope, module_key, ord, prompt, options, answer_index, explanation, active from public.academy_quiz_questions where app_slug = 'qi') q), '')
 || coalesce((select string_agg(md5(c::text), ',' order by c.tier) from (select tier, cert_tier, dataset, title, prompt, fields from public.academy_capstones where app_slug = 'qi') c), ''))"

COURSE_SEED=@@COURSE@@
state_of() {  # file -> PENDING | ALREADY-APPLIED | REFUSED:<reason>
  { echo "begin;"
    # A deep seed is judged with the course seed run ahead of it in the same
    # rolled-back transaction (the FK on app_slug), a no-op once it is applied.
    [ "$1" = "$COURSE_SEED" ] || { cat "$RUN/$COURSE_SEED.sql"; echo; }
    echo "create temp table qi_before on commit drop as select $HASH_Q as h;"
    cat "$RUN/$1.sql"; echo
    echo "select case when (select h from qi_before) = $HASH_Q then 'ALREADY-APPLIED' else 'PENDING' end as qi_state;"
    echo "rollback;"; } > "$RUN/$1.state.sql"
  out=$(prod_q "$RUN/$1.state.sql"); rc=$?
  if failed $rc "$out"; then echo "REFUSED:$(grep -m1 -oE '[A-Za-z0-9 /_.-]*(refused|ERROR)[^"]*' <<<"$out" | cut -c1-200)"
  elif grep -q PENDING <<<"$out"; then echo PENDING
  elif grep -q ALREADY-APPLIED <<<"$out"; then echo ALREADY-APPLIED
  else echo UNKNOWN; fi
}

golive_state() {
  echo "select 'QI|' || coalesce((select status from public.academy_apps where slug = 'qi'), 'absent') as qi_golive;" > "$RUN/golive.sql"
  out=$(prod_q "$RUN/golive.sql")
  case "$(grep -oE 'QI\|[a-z_]+' <<<"$out" | head -1)" in
    'QI|available') echo APPLIED ;;
    'QI|coming_soon') echo HELD ;;
    'QI|absent') echo "HELD (the course row is not seeded yet)" ;;
    *) echo UNKNOWN ;;
  esac
}

status() {
  pending=0; done_=0; bad=0
  for f in $SEEDS; do
    st=$(state_of "$f")
    case "$st" in
      PENDING) say "  PENDING          $f"; pending=$((pending + 1)) ;;
      ALREADY-APPLIED) say "  ALREADY-APPLIED  $f"; done_=$((done_ + 1)) ;;
      *) say "  $st  $f"; bad=$((bad + 1)) ;;
    esac
  done
  say "  go-live          $GOLIVE: $(golive_state)"
  say "prod-status: $pending pending, $done_ already applied, $bad refused or unknown, of $(echo "$SEEDS" | grep -c .) seeds"
  [ $bad = 0 ]
}

attempts() {
  cat > "$RUN/attempts.sql" <<'SQL'
select 'ATT|' || string_agg(t || ' ' || n, ' | ' order by t) as qi_attempts from (
  select 'enrollments' t, count(*) n from public.academy_enrollments where app_slug = 'qi'
  union all select 'lesson_progress', count(*) from public.academy_lesson_progress where app_slug = 'qi'
  union all select 'quiz_attempts', count(*) from public.academy_quiz_attempts where app_slug = 'qi'
  union all select 'capstone_attempts', count(*) from public.academy_capstone_attempts where app_slug = 'qi'
  union all select 'certifications', count(*) from public.academy_certifications where app_slug = 'qi') x;
SQL
  out=$(prod_q "$RUN/attempts.sql")
  line=$(grep -oE 'ATT\|[^"]+' <<<"$out" | head -1)
  [ -n "$line" ] || { echo "$out" | tail -5; refuse "could not read the attempt counts"; }
  say "  ${line#ATT|}"
  say "  A new course must show 0 everywhere. A non-zero count means qi rows already exist in production: stop and read them before applying."
}

rows() {
  d=$(date -u +%F)
  for f in $SEEDS; do
    echo "| $d | \`$f.sql\` | QI Quantitative Interpretation (qi), seed | **APPLIED $d** by the owner via tools/course-waves/qi/apply_qi.sh apply --prod from $REF (content pinned by sha256; scratch dry run and prod rolled-back dry run first) |"
  done
  echo "| $d | \`$GOLIVE.sql\` | QI Quantitative Interpretation (qi), GO-LIVE: coming_soon to available | **APPLIED $d** via apply_qi.sh apply --prod --go-live, after the deployed site served /dashboard/apps/qi |"
}

dryrun() {
  local ok=1
  REPO="$NG_REPO" bash "$HERE/scratch_db.sh" "$REF" | tail -2 || refuse "scratch_db.sh failed"
  # While a tier's capstone is pending the go-live must REFUSE through its
  # completeness block; once all three exist it must run clean.
  if [ -z "$(git -C "$NG_REPO" show "$REF:tools/course-waves/qi/ship_names.json" | python3 -c "import json,sys; n=json.load(sys.stdin); print('' if n['intermediate_capstone'] and n['advanced_capstone'] else 'pending')")" ]; then
    REPO="$NG_REPO" bash "$HERE/dryrun_qi.sh" "$REF" | tail -3 | sed 's/^/  /'; [ "${PIPESTATUS[0]}" = 0 ] || ok=0
    REPO="$NG_REPO" bash "$HERE/dryrun_qi.sh" "$REF" --idempotent | grep -E '^IDEMPOTENT' | sed 's/^/  /'; [ "${PIPESTATUS[0]}" = 0 ] || ok=0
    P=""
  else
    REPO="$NG_REPO" bash "$HERE/dryrun_qi.sh" "$REF" --control completeness | grep -E '^CONTROL' | sed 's/^/  /'; [ "${PIPESTATUS[0]}" = 0 ] || ok=0
    say "  (a tier's capstone is pending: the per-field checks run with the completeness and shape blocks cut)"
    P=1
    QI_PARTIAL=1 REPO="$NG_REPO" bash "$HERE/dryrun_qi.sh" "$REF" | tail -2 | sed 's/^/  /'; [ "${PIPESTATUS[0]}" = 0 ] || ok=0
    QI_PARTIAL=1 REPO="$NG_REPO" bash "$HERE/dryrun_qi.sh" "$REF" --idempotent | grep -E '^IDEMPOTENT' | sed 's/^/  /'; [ "${PIPESTATUS[0]}" = 0 ] || ok=0
  fi
  for c in ledger route oracle trap prompt leak; do
    QI_PARTIAL=$P REPO="$NG_REPO" bash "$HERE/dryrun_qi.sh" "$REF" --control "$c" | grep -E '^CONTROL' | sed 's/^/  /'; [ "${PIPESTATUS[0]}" = 0 ] || ok=0
  done
  REPO="$NG_REPO" python3 "$HERE/verify_sql.py" "$REF" | tail -1 | sed 's/^/  /'; [ "${PIPESTATUS[0]}" = 0 ] || ok=0
  for c in --canary --canary-key --canary-field --canary-lesson; do
    REPO="$NG_REPO" python3 "$HERE/verify_sql.py" "$REF" "$c" >/dev/null 2>&1; rc=$?
    [ $rc = 2 ] && say "  verify_sql $c: DISAGREE as it must" || { say "  verify_sql $c did NOT disagree"; ok=0; }
  done
  docker rm -f qi-scratch >/dev/null 2>&1 && say "  scratch container qi-scratch removed"
  [ $ok = 1 ] || refuse "the scratch dry run did not come back clean"
  say "DRYRUN OK on the local scratch database: safe to run attempts, prod-status and prod-dryrun"
}

case "${1:-verify}" in
  verify)      fetch; say "VERIFY ONLY. No database was touched." ;;
  pin)
    [ $# -ge 2 ] || { echo "usage: $0 pin <ref>   (rewrites the pin block of this script from the tree at <ref>)"; exit 2; }
    python3 "$HERE/pin_qi.py" "$NG_REPO" "$2" ;;
  dryrun)      fetch; dryrun ;;
  attempts)    fetch; say "target: PRODUCTION (read-only)"; attempts ;;
  prod-status) fetch; say "target: PRODUCTION (each seed rolled back)"; status || exit 2 ;;
  prod-dryrun) fetch; say "target: PRODUCTION, the whole ladder rolled back"
               TARGET=linked LINKED="$NG_REPO" REPO="$NG_REPO" bash "$HERE/dryrun_qi.sh" "$SHA" || refuse "the production rolled-back dry run did not come back clean" ;;
  apply)
    [ "${2:-}" = "--prod" ] || refuse "apply writes PRODUCTION; pass --prod explicitly (run dryrun, attempts, prod-status and prod-dryrun first)"
    fetch
    if [ "${3:-}" = "--go-live" ]; then
      say "THE GO-LIVE. Confirm you have SERVED the built DashboardPage chunk and SEEN 'apps/qi' in it."
      printf "Type exactly  apps/qi  to proceed (or pipe it: echo \"apps/qi\" | %s apply --prod --go-live): " "$0"
      answer=""; read -r answer || true
      [ "$answer" = "apps/qi" ] || refuse "upload gate not confirmed"
      [ "$(golive_state)" = HELD ] || refuse "the go-live is not HELD on production: $(golive_state). Apply the four seeds first."
      { echo "begin;"; cat "$RUN/$GOLIVE.sql"; echo; echo "commit;"; } > "$RUN/golive.apply.sql"
      out=$(prod_q "$RUN/golive.apply.sql"); rc=$?
      if failed $rc "$out"; then echo "$out" | grep -E 'ERROR|refused' | head -3; refuse "the go-live failed and rolled back"; fi
      say "  applied $GOLIVE"; say "  go-live: $(golive_state)"
      say "Now run: $0 rows, and paste the go-live row over its NOT YET APPLIED row in MIGRATIONS.md"
      exit 0
    fi
    say "pre-check:"; status || refuse "prod-status shows refusals; nothing applied"
    for f in $SEEDS; do
      { echo "begin;"; cat "$RUN/$f.sql"; echo; echo "commit;"; } > "$RUN/$f.apply.sql"
      out=$(prod_q "$RUN/$f.apply.sql"); rc=$?
      if failed $rc "$out"; then echo "$out" | grep -E 'ERROR|refused' | head -3; refuse "$f failed and rolled back; earlier seeds stay applied (re-running is safe)"; fi
      say "  applied $f"
    done
    say "post-check:"; status || refuse "the post-check shows refusals"
    say; say "SEEDED. qi is coming_soon and no learner can reach it."
    say "Now run: $0 rows, and paste the four seed rows over their NOT YET APPLIED rows in MIGRATIONS.md."
    say "The go-live stays HELD until the deployed site serves /dashboard/apps/qi." ;;
  rows)        rows ;;
  *) refuse "unknown mode '${1:-}' (verify | dryrun | attempts | prod-status | prod-dryrun | apply --prod [--go-live] | rows | pin <ref>)" ;;
esac
