#!/usr/bin/env bash
# PROVE THE SC5 FOUNDATION LEAVES EVERY EARLIER COURSE UNCHANGED.
#
# SC5 is a PRACTICE COURSE: it vendors no engine and touches no course's kit.
# What it does change is shared platform code (a course type on the catalogue
# row, the practice badge, the certificate path for a course with no numeric
# capstone), so the proof has five parts.
#
# PART 1, THE ENGINES. packages/engines on this branch is byte-identical to
# BASE, and nothing under it is left uncommitted.
#
# PART 2, THE FULL KITS. Every full-kit course (D1 dataqc to D5 appliedai; H1
# safetystats, H3 lopa, H4 consequence, H5 qra; SC2 procurement; EC7 pia, EC8
# gsa, EC9 joa, EC10 farmout, EC11 prms), rebuilt from its COMMITTED kit copied
# to a fresh mktemp directory against this worktree's vendored engines: the
# digest, fields.json and precision.json, each compared byte for byte with the
# committed copy and with the sha256 pinned in waves.json.
#
# PART 3, THE ECONOMICS COURSES. cashflow and fiscal (cashflow.ts), fdp
# (economics goldens), decision and portfolio (lib/stats) rebuild their digests
# and fields byte-identical and match their pins.
#
# PART 4, THE FOOTPRINT. Every path that differs from BASE is on this wave's
# list (its own migration files, content, kit and the named platform files);
# every other course's content directory, kit directory and migration is
# byte-identical to BASE; waves.json differs from BASE only by the added
# contracts entry.
#
# PART 5, THE WAVE INPUTS. check-wave-inputs.mjs passes over every wave.
#
#   bash prove_prior_courses.sh     (NG=/root/wt-sc5-nextgen BASE=origin/main by default)
set -euo pipefail
NG=${NG:-${SC5_REPO:-/root/wt-sc5-nextgen}}
ENG="$NG/packages/engines"
BASE=${BASE:-origin/main}
SCR=$(mktemp -d /tmp/sc5-prior-XXXXXX); trap 'rm -rf "$SCR"' EXIT
fail=0
pin() { python3 -c "import json,sys;print(json.load(open(sys.argv[1]))[sys.argv[2]]['pins'][sys.argv[3]])" "$NG/tools/course-waves/waves.json" "$1" "$2"; }

echo "PART 1: packages/engines on this branch against $BASE"
d=$(git -C "$NG" diff --name-only "$BASE" -- packages/engines | wc -l)
[ "$d" = 0 ] && echo "  packages/engines byte-identical to $BASE" || { echo "  packages/engines DIFFERS from $BASE in $d path(s)"; fail=1; }
u=$(git -C "$NG" status --porcelain -- packages/engines | grep -v node_modules || true)
[ -z "$u" ] || { echo "  UNCOMMITTED under packages/engines:"; echo "$u"; fail=1; }

echo; echo "PART 2: the full kits, rebuilt from their committed copies in $SCR"
for spec in D1:dataqc D2:mlcore D3:facies D4:forecastml D5:appliedai H1:safetystats H3:lopa H4:consequence H5:qra SC2:procurement EC7:pia EC8:gsa EC9:joa EC10:farmout EC11:prms; do
  P=${spec%%:*}; W=${spec#*:}; src="$NG/tools/course-waves/$W"; dst="$SCR/$W"; cp -rp "$src" "$dst"
  export ${P}_WAVE_DIR="$dst" ${P}_ENGINES="$ENG" ${P}_REPO="$NG" ${P}_TOLERANCE="$NG/src/components/course/panels/$W/gradedTolerance.js"
  if (cd "$dst" && sh ./build_digest.sh > digest.tmp 2> digest.err && mv digest.tmp digest.txt && node ./make_fields.mjs > fields.log 2>&1); then
    for f in digest.txt fields.json precision.json; do
      cmp -s "$src/$f" "$dst/$f" && v=IDENTICAL || { v=DIFFERS; fail=1; }
      printf '%-4s %-12s %-15s %s  sha256 %s\n' "$P" "$W" "$f" "$v" "$(sha256sum "$dst/$f" | cut -c1-16)"
    done
    for f in digest.txt fields.json; do [ "$(pin $W $f)" = "$(sha256sum "$dst/$f" | cut -d' ' -f1)" ] || { echo "$P $W $f DOES NOT MATCH its pin"; fail=1; }; done
  else echo "$P $W: rebuild FAILED"; tail -n 3 "$dst/digest.err" "$dst/fields.log"; fail=1; fi
  unset ${P}_WAVE_DIR ${P}_ENGINES ${P}_REPO ${P}_TOLERANCE
done

echo; echo "PART 3: the economics courses on cashflow.ts and lib/stats"
for W in cashflow fiscal; do
  src="$NG/tools/course-waves/$W"; dst="$SCR/$W"; cp -rp "$src" "$dst"
  if [ $W = cashflow ]; then
    (cd "$dst" && EC1_WAVE_DIR="$dst" EC1_ENGINES="$ENG" EC1_REPO="$NG" sh ./build_digest.sh > digest.tmp 2>digest.err && mv digest.tmp digest.txt && EC1_WAVE_DIR="$dst" EC1_ENGINES="$ENG" node ./ec1_fields.mjs > fields.log 2>&1) || { echo "$W FAILED"; fail=1; continue; }
  else
    (cd "$dst" && EC2_WAVE_DIR="$dst" EC2_ENGINES="$ENG" EC2_REPO="$NG" sh ./build_digest.sh > digest.tmp 2>digest.err && mv digest.tmp digest.txt && EC2_WAVE_DIR="$dst" EC2_ENGINES="$ENG" EC2_REPO="$NG" node ./ec2_fields.mjs --json > fields.log 2>&1) || { echo "$W FAILED"; fail=1; continue; }
  fi
  for f in digest.txt fields.json; do
    cmp -s "$src/$f" "$dst/$f" && v=IDENTICAL || { v=DIFFERS; fail=1; }
    [ "$(pin $W $f)" = "$(sha256sum "$dst/$f" | cut -d' ' -f1)" ] && pv="matches its pin" || { pv="DOES NOT MATCH its pin"; fail=1; }
    printf '%-4s %-12s %-15s %s, %s\n' EC $W $f "$v" "$pv"
  done
done
src="$NG/tools/course-waves/fdp"; dst="$SCR/fdp"; cp -rp "$src" "$dst"
if (cd "$dst" && env TZ=UTC LC_ALL=C EC6_ENGINES="$ENG" node ./ec6_dump.mjs > digest.tmp 2> digest.err && mv digest.tmp digest.txt); then
  cmp -s "$src/digest.txt" "$dst/digest.txt" && v=IDENTICAL || { v=DIFFERS; fail=1; }
  [ "$(pin fdp digest.txt)" = "$(sha256sum "$dst/digest.txt" | cut -d' ' -f1)" ] && pv="matches its pin" || { pv="DOES NOT MATCH its pin"; fail=1; }
  printf '%-4s %-12s %-15s %s, %s\n' EC6 fdp digest.txt "$v" "$pv"
else echo "EC6 fdp: digest FAILED"; tail -n 3 "$dst/digest.err"; fail=1; fi
for spec in EC4:decision:ec4 EC5:portfolio:ec5; do
  P=${spec%%:*}; rest=${spec#*:}; W=${rest%%:*}; e=${rest#*:}
  src="$NG/tools/course-waves/$W"; dst="$SCR/$W"; cp -rp "$src" "$dst"
  (cd "$dst" && env TZ=UTC LC_ALL=C ${P}_ENGINES="$ENG" node "./${e}_dump.mjs" > digest.tmp 2> digest.err && mv digest.tmp digest.txt) || { echo "$W: digest FAILED"; tail -n 3 "$dst/digest.err"; fail=1; continue; }
  printf "const m = await import('%s/%s_fields.mjs');\nprocess.stdout.write(JSON.stringify(m.FIELDS, null, 1) + '\\\\n');\n" "$dst" "$e" > "$dst/fields_probe.mjs"
  (cd "$dst" && env ${P}_ENGINES="$ENG" node ./fields_probe.mjs > fields.json 2> fields.err) || { echo "$W: fields FAILED"; tail -n 3 "$dst/fields.err"; fail=1; continue; }
  for f in digest.txt fields.json; do
    cmp -s "$src/$f" "$dst/$f" && v=IDENTICAL || { v=DIFFERS; fail=1; }
    [ "$(pin $W $f)" = "$(sha256sum "$dst/$f" | cut -d' ' -f1)" ] && pv="matches its pin" || { pv="DOES NOT MATCH its pin"; fail=1; }
    printf '%-4s %-10s %-11s %s, %s\n' "$P" "$W" "$f" "$v" "$pv"
  done
done

echo; echo "PART 4: the footprint of this branch against $BASE (committed and working tree)"
ALLOWED='^(migrations/20261116_sc5_contracts_[a-z_]+\.sql|MIGRATIONS\.md|src/content/courses/contracts/.*|tools/course-waves/contracts/.*|tools/course-waves/waves\.json|tools/course-waves/check-wave-inputs\.mjs|src/lib/courseType(\.test)?\.js|src/lib/homeCatalog\.js|src/components/course/(PracticeCourseBadge|PracticeCourseNotice|PracticeCertificateCard|DeepCourseBanner)\.jsx|src/components/course/practiceCourse\.test\.jsx|src/components/course/practice/contractsWaveMirror\.test\.js|src/pages/apps/(ContractsLearningPage|PracticeCourseLearningPage)\.jsx|src/pages/(LandingPage\.jsx|LandingPage\.css|DashboardPage\.jsx|AcademyCertificatesPage\.jsx|VerifyCertificatePage\.jsx)|src/pages/course/(CourseHomePage|FinalExamPage)\.jsx|src/services/academyService\.js)$'
nchanged=0
for p in $( { git -C "$NG" diff --name-only "$BASE"; git -C "$NG" ls-files --others --exclude-standard; } | grep -v '^node_modules/' | sort -u); do
  nchanged=$((nchanged + 1))
  if echo "$p" | grep -Eq "$ALLOWED"; then :; else echo "  OUTSIDE THIS WAVE: $p"; fail=1; fi
done
echo "  $nchanged path(s) differ from $BASE, every one on this wave's list unless named above"
for dir in src/content/courses tools/course-waves tools/course-banks migrations; do
  others=$(git -C "$NG" diff --name-only "$BASE" -- "$dir" | grep -Ev '(/contracts/|20261116_sc5_contracts_|waves\.json|check-wave-inputs\.mjs)' || true)
  [ -z "$others" ] && echo "  $dir: every other course byte-identical to $BASE" || { echo "  $dir: OTHER COURSES CHANGED:"; echo "$others"; fail=1; }
done
python3 - "$NG" "$BASE" <<'PY' || fail=1
import json, subprocess, sys
ng, base = sys.argv[1:3]
old = json.loads(subprocess.check_output(['git', '-C', ng, 'show', f'{base}:tools/course-waves/waves.json'], text=True))
new = json.load(open(f'{ng}/tools/course-waves/waves.json'))
extra = sorted(set(new) - set(old)); gone = sorted(set(old) - set(new))
same = all(new[k] == old[k] for k in old if k in new)
ok = same and not gone and extra == ['contracts']
print(f"  waves.json: {'only the contracts entry is added; every other wave entry is unchanged' if ok else f'DIFFERS: added {extra}, removed {gone}, others unchanged {same}'}")
sys.exit(0 if ok else 1)
PY

echo; echo "PART 5: the committed wave inputs"
if out=$(node "$NG/tools/course-waves/check-wave-inputs.mjs" 2>&1); then echo "  $(echo "$out" | tail -1)"; else echo "$out" | grep -E 'FAIL|problem' | head -20; fail=1; fi

[ $fail = 0 ] && echo "PRIOR COURSES UNCHANGED: packages/engines byte-identical to $BASE; D1 to D5, H1, H3, H4, H5, SC2 and EC7 to EC11 digests, fields and precision rebuild byte-identical; cashflow, fiscal, fdp (digest), decision and portfolio rebuild byte-identical and match their pins; every changed path is this wave's own or a named platform file; waves.json only adds contracts; check-wave-inputs passes" || { echo "PRIOR COURSES: A DIFFERENCE"; exit 1; }
