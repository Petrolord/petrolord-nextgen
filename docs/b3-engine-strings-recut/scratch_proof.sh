#!/usr/bin/env bash
# =============================================================================
# B3 RECUT, LOCAL SCRATCH-DATABASE PROOF (no production access).
#
# For each LIVE course: a throwaway Postgres (the course's own scratch_db.sh,
# renamed b3-<slug>), the APPLIED ladder as OLD_REF holds it (course migration
# and the three deep seeds, which write every question row), then:
#
#   1. the recut files at NEW_REF: the rows that differ before -> after must be
#      EXACTLY the rows RECUT-<slug>.json lists, and the question ids unchanged
#      (no row deleted or re-inserted, learner attempts stay attached);
#   2. the recut again: 0 rows updated (idempotent);
#   3. every question row after the recut equals the row the banks at NEW_REF
#      generate, field for field (the recut lands exactly the committed banks);
#   4. NEGATIVE CONTROL: the ladder re-seeded, one listed row given a third text,
#      the recut run: it must RAISE, and the transaction must leave the tier
#      untouched (the tampered row still tampered, no other row recut).
#
# Usage: scratch_proof.sh [slug ...]      default: all five
#   OLD_REF (default origin/main), NEW_REF (default HEAD)
# =============================================================================
set -u
HERE=$(cd "$(dirname "$0")" && pwd)
REPO=$(cd "$HERE/../.." && pwd)
OLD_REF=${OLD_REF:-origin/main}
NEW_REF=${NEW_REF:-HEAD}
SLUGS=${*:-crude refinery supply gasvalue carbon}
declare -A STEM=([crude]=20261010_cr_crude [refinery]=20261011_rf_refinery [supply]=20261012_tds_supply [gasvalue]=20261013_gv_gasvalue [carbon]=20261014_cef_carbon)
T=$(mktemp -d /tmp/b3proof.XXXXXX)
FAIL=0

for s in $SLUGS; do
  C=b3-$s
  echo "================ $s (container $C)"
  git -C "$REPO" show "$OLD_REF:tools/course-waves/$s/scratch_db.sh" | sed -E "s/^C=.*/C=$C/" > "$T/scratch_$s.sh"
  bash "$T/scratch_$s.sh" >/dev/null 2>&1 || { echo "  scratch_db.sh failed"; FAIL=1; continue; }
  P() { docker exec -i $C psql -U postgres -v ON_ERROR_STOP=1 -q -At "$@"; }
  seed() {
    for f in course beginner_deep intermediate_deep advanced_deep; do
      git -C "$REPO" show "$OLD_REF:migrations/${STEM[$s]}_$f.sql" | P >/dev/null || { echo "  seed $f FAILED"; return 1; }
    done
  }
  seed || { FAIL=1; continue; }
  dump() {
    P -c "select coalesce(json_agg(json_build_object('id', id, 'tier', tier, 'scope', scope, 'module_key', module_key, 'ord', ord, 'prompt', prompt, 'options', options, 'answer', answer_index, 'explanation', explanation) order by tier, scope, module_key, ord), '[]') from public.academy_quiz_questions where app_slug = '$s'" > "$1"
  }
  dump "$T/$s.before.json"
  RECUTS=$(git -C "$REPO" ls-tree --name-only "$NEW_REF" migrations/ | grep "20261015_b3_recut_${s}_")
  run_recut() { for f in $RECUTS; do git -C "$REPO" show "$NEW_REF:$f" | P 2>&1; done; }
  echo "  first run:";  run_recut | sed -n 's/.*NOTICE: */    /p'
  dump "$T/$s.after.json"
  echo "  second run:"; run_recut | sed -n 's/.*NOTICE: */    /p'
  dump "$T/$s.again.json"
  git -C "$REPO" show "$NEW_REF:docs/b3-engine-strings-recut/RECUT-$s.json" > "$T/$s.recut.json"
  python3 - "$T" "$s" "$REPO" "$NEW_REF" <<'PY' || FAIL=1
import json, subprocess, sys
T, s, REPO, NEW = sys.argv[1:]
sys.argv = ['x']
before = json.load(open(f'{T}/{s}.before.json')); after = json.load(open(f'{T}/{s}.after.json'))
again = json.load(open(f'{T}/{s}.again.json')); recut = json.load(open(f'{T}/{s}.recut.json'))
key = lambda r: (r['tier'], r['scope'], r['module_key'], r['ord'])
fields = lambda r: (r['prompt'], r['options'], r['answer'], r['explanation'])
b = {key(r): r for r in before}; a = {key(r): r for r in after}
ok = True
def say(c, m):
    global ok
    print(('  PASS ' if c else '  FAIL ') + m); ok = ok and c
say(len(before) == 396 and len(after) == 396, f'396 rows before and after ({len(before)}, {len(after)})')
say(sorted(r['id'] for r in before) == sorted(r['id'] for r in after), 'question ids unchanged (no delete, no re-insert)')
moved = {k for k in b if fields(b[k]) != fields(a[k])}
listed = {(t, c['scope'], c['module_key'], c['ord']) for t, rows in recut['tiers'].items() for c in rows}
say(moved == listed, f'rows that moved == rows RECUT-{s}.json lists ({len(moved)} == {len(listed)})')
say(all(b[k]['answer'] == a[k]['answer'] for k in b), 'no answer index moved')
say(after == again, 'second run changed nothing (idempotent)')
# the recut lands exactly the banks at NEW_REF
sys.path.insert(0, f'{REPO}/docs/b3-engine-strings-recut')
import importlib.util
spec = importlib.util.spec_from_file_location('g', f'{REPO}/docs/b3-engine-strings-recut/gen_recut.py')
src = open(spec.origin).read().replace('\nmain()\n', '\n')
g = {'__file__': spec.origin}; exec(compile(src, 'gen_recut', 'exec'), g)
prefix = {c[0]: c[1] for c in g['COURSES']}[s]
want = {}
for t in g['TIERS']:
    for scope, mk, o, it in g['rows_at'](NEW, s, prefix, t):
        want[(t, scope, mk, o)] = (it['prompt'], it['options'], it['answer'], it['explanation'])
say(all(fields(a[k]) == want[k] for k in a) and set(a) == set(want), 'every row after the recut equals the banks at NEW_REF')
sys.exit(0 if ok else 1)
PY
  # NEGATIVE CONTROL
  seed >/dev/null
  pick=$(python3 -c "
import json; d=json.load(open('$T/$s.recut.json'))
t,rows=[(t,r) for t,r in d['tiers'].items() if r][0]; c=rows[0]
mk=\"'%s'\" % c['module_key'] if c['module_key'] else 'null'
print(t + '|' + c['scope'] + '|' + mk + '|' + str(c['ord']))")
  IFS='|' read -r ct cs cm co <<< "$pick"
  W="app_slug='$s' and tier='$ct' and scope='$cs' and module_key is not distinct from $cm::text and ord=$co"
  P -c "update public.academy_quiz_questions set explanation = 'TAMPERED by the negative control' where $W" >/dev/null
  dump "$T/$s.tampered.json"
  f=$(echo "$RECUTS" | grep "_${ct}.sql")
  OUT=$(git -C "$REPO" show "$NEW_REF:$f" | P 2>&1); RC=$?
  dump "$T/$s.control.json"
  if [ $RC -ne 0 ] && grep -q "matches neither" <<<"$OUT" && cmp -s "$T/$s.tampered.json" "$T/$s.control.json"; then
    echo "  PASS negative control: a third text on $ct $cs ord $co is refused and the tier is left untouched"
    echo "       ($(grep -o 'B3 recut[^"]*' <<<"$OUT" | head -1))"
  else
    echo "  FAIL negative control (rc $RC): $OUT"; FAIL=1
  fi
  docker rm -f $C >/dev/null 2>&1
done
rm -rf "$T"
[ $FAIL = 0 ] && echo "SCRATCH PROOF: ALL PASS" || { echo "SCRATCH PROOF: FAILED"; exit 1; }
