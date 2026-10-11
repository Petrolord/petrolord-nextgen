#!/usr/bin/env bash
# =============================================================================
# SCRATCH-ONLY STAND-IN DEEP SEEDS, so the WHOLE QI ladder (three structures,
# 396 questions, three capstones) can be dry-run and the go-live proved to pass
# every check on a complete ladder while the Professional and Expert banks are
# still being finalised. Builds a throwaway directory holding the committed
# QI migrations at REF plus, for every tier whose deep seed is not committed,
# a stand-in seed: the tier's real structure from its manifest and 132
# placeholder questions (four options, keyed), under the reserved name.
# NOTHING HERE IS EVER COMMITTED OR APPLIED: the directory lives in /tmp and
# dryrun_qi.sh reads it only with REF=WORKTREE on the scratch database.
#   standin_seeds.sh <outdir> [ref|WORKTREE]
# =============================================================================
set -eu
OUT=$1; REF=${2:-HEAD}
HERE=$(cd "$(dirname "$0")" && pwd)
REPO=${REPO:-/root/wt-qi-nextgen}
rm -rf "$OUT"; mkdir -p "$OUT/migrations" "$OUT/wave/banks"
if [ "$REF" = WORKTREE ]; then
  cp "$REPO"/migrations/*_qi_*.sql "$OUT/migrations/"
else
  for f in $(git -C "$REPO" ls-tree --name-only "$REF" migrations/ | grep -E '_qi_[a-z_]+\.sql$'); do
    git -C "$REPO" show "$REF:$f" > "$OUT/$f"
  done
fi
python3 -c "import json; c=json.load(open('$HERE/wave.json')); c['repo']='$REPO'; json.dump(c, open('$OUT/wave/wave.json','w'))"
for tier in intermediate advanced; do
  n=$(python3 -c "import json; print(json.load(open('$HERE/ship_names.json'))['${tier}_deep'])")
  [ -f "$OUT/migrations/$n.sql" ] && continue
  L=$(case $tier in intermediate) echo i;; advanced) echo a;; esac)
  python3 - "$OUT/wave/banks" "$L" <<'PY'
import json, sys
d, L = sys.argv[1:]
def q(i, part):
    return {'prompt': f'Stand-in question {i} of {part} (scratch only).',
            'options': ['Stand-in option one.', 'Stand-in option two.', 'Stand-in option three.', 'Stand-in option four.'],
            'answer': i % 4, 'explanation': 'A scratch stand-in; never committed.'}
for part in ['m01', 'm02', 'm03', 'm04', 'm05', 'm06']:
    json.dump([q(i, part) for i in range(15)], open(f'{d}/qi{L}_{part}.json', 'w'))
json.dump([q(i, 'exam') for i in range(42)], open(f'{d}/qi{L}_exam.json', 'w'))
PY
  printf -- '-- SCRATCH STAND-IN DEEP SEED (%s): real structure, placeholder questions. Never committed or applied.\n' "$tier" > "$OUT/hdr.txt"
  python3 /root/dc-wavekit/gen_migration.py "$tier" "$OUT/hdr.txt" "$OUT/migrations/$n.sql" "$OUT/wave" | sed 's/^/  stand-in: /'
done
ls "$OUT/migrations"
