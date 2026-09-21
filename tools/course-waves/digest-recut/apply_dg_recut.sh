#!/usr/bin/env bash
# =============================================================================
# DIGEST-COPY RECUT OF THE LIVE QUESTION BANKS, content-addressed.
#
# 25 migrations, one per live course, each a guarded text-only UPDATE of the
# question rows whose prompt, options or explanation named the authors'
# internal digest, a numbered SECTION of it, or their generator. Every row is
# addressed by (app_slug, tier, scope, module_key, ord), must carry its
# published text or the recut text, and nothing else moves: no answer index,
# no option order, no row count. The OLD and NEW of every row are in
# docs/digest-recut/RECUT-<slug>.json.
#
# This script never reads a working tree. It resolves each file out of the
# git object store at REF (origin/main by default) and REFUSES unless every
# file's sha256 matches the digest pinned below. File content survives a
# squash merge, so the pins stay right after the merge; re-run `verify`
# against origin/main after it and record the result.
#
# ORDER. The corrosion file expects FC9's own recut (20260926_fc9_recut_*,
# PR #181) to be in place first: three rows are touched by both, and this
# recut's published text for them is FC9's recut text. Run against a database
# without it, the corrosion file refuses and nothing moves.
#
#   verify            resolve and check the pins. Touches no database.
#   pin <ref>         reprint the digest table at <ref>.
#   dryrun            run all 25 in ONE transaction and ROLL BACK.
#   apply             run all 25 in ONE transaction and COMMIT.
#
#   TARGET=scratch (default for dryrun) runs against the local docker
#   container ${SCRATCH:-digest-scratch}; TARGET=linked runs against the linked
#   project with `supabase db query --linked`, which IS PRODUCTION. `apply`
#   refuses unless TARGET is set explicitly.
#
#   REF=<ref>    the ref to resolve the SQL from. Default origin/main.
#   REPO=<path>  a clone of petrolord-nextgen. Default: this script's own repo.
#   LINKED=<dir> the linked checkout. Default the dev1 petrolord-nextgen.
# EXIT CODES. 0 did the thing. 2 REFUSED.
# =============================================================================
set -u
REF=${REF:-origin/main}
LINKED=${LINKED:-/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen}
HERE=$(cd "$(dirname "$0")" && pwd)
RUN=$(mktemp -d /tmp/dgrecut.XXXXXX)
refuse() { echo; echo "REFUSED: $*"; echo "Nothing was applied."; exit 2; }
FILES="
20261015_dg_recut_carbon
20261015_dg_recut_cashflow
20261015_dg_recut_compliance
20261015_dg_recut_corrosion
20261015_dg_recut_crude
20261015_dg_recut_gasprocessing
20261015_dg_recut_gasvalue
20261015_dg_recut_heattransfer
20261015_dg_recut_integrity
20261015_dg_recut_intervention
20261015_dg_recut_linesizing
20261015_dg_recut_metering
20261015_dg_recut_network
20261015_dg_recut_portfolio
20261015_dg_recut_producedwater
20261015_dg_recut_refinery
20261015_dg_recut_relief
20261015_dg_recut_riskchange
20261015_dg_recut_rotating
20261015_dg_recut_sim
20261015_dg_recut_stimulation
20261015_dg_recut_supply
20261015_dg_recut_surveillance
20261015_dg_recut_uncertainty
20261015_dg_recut_waterflood
"
digest_for() {
  case $1 in
    20261015_dg_recut_carbon          ) echo a2060e39227370b344a1ca2633d056eef2eca5b33fbb94fa8ab5479237c584df ;;
    20261015_dg_recut_cashflow        ) echo 85c02e7448c1625971737d6c9b3772d4065ad51a39143e22e119c4b43d3b2382 ;;
    20261015_dg_recut_compliance      ) echo 917ce9be29b92bcebd9ee6468aa89b100a9efd493cd0da69486a99ac3e59ba25 ;;
    20261015_dg_recut_corrosion       ) echo 6826ee985b9da1b9082ccf7bceef003172c8ae531c39e06638d2de00f6fbb81f ;;
    20261015_dg_recut_crude           ) echo 272b3abb6bbb228540af49a6dd1697f3fec11d1d14aa557a670584c2130a17a3 ;;
    20261015_dg_recut_gasprocessing   ) echo 1aeec6fada48c84cfd8f425223dd32a44341c5e255d92ee6224d8529c73ab0e1 ;;
    20261015_dg_recut_gasvalue        ) echo 994d84f3979cb4b40bafdb67439e1c036a3859adcf4f947fa794638f09578012 ;;
    20261015_dg_recut_heattransfer    ) echo da9e97131d824ae8e7dbc986d10e917a6dbd9b34a45bcf360793b4365ba455da ;;
    20261015_dg_recut_integrity       ) echo 4e87db522317fa4943a2de2b8e3e432ee9d136d6427f971171dd78d9e89214ce ;;
    20261015_dg_recut_intervention    ) echo ec977738d0988dc60c6bf7cb87403b27d2ffcfd109d74324e9e46ba0cbf7fb9e ;;
    20261015_dg_recut_linesizing      ) echo 2f11fc9da19e2a3b0afc7a853ca1010a1de7ee5fe085593c1775873c399dfb93 ;;
    20261015_dg_recut_metering        ) echo ee74b81e3fb8994aaa19fd4e1525c4c6510cc1c219d09a5f6e1f184260f129b4 ;;
    20261015_dg_recut_network         ) echo 70b0447b187dbd17863c607cefcdc740b072c17aaa1d354458a402a2627fd9e8 ;;
    20261015_dg_recut_portfolio       ) echo 091eaadaa15dfa914088eb09cdcbe6fde7b22e28dcef009d2f166761f1bb67fb ;;
    20261015_dg_recut_producedwater   ) echo db0a4b8e3d56bde1fbf5cc40a5c2eefa98b8be892babfd11713e673a6efd88c5 ;;
    20261015_dg_recut_refinery        ) echo c6cf0381fa6b7c1dcdccbd733c7794da3298d1430a6a13d5a4c270abf26f3465 ;;
    20261015_dg_recut_relief          ) echo 2af9b44fe59f1a0606f3f4dc8aaa89a1874bb65c268aeaa8ec022a59c68afaa7 ;;
    20261015_dg_recut_riskchange      ) echo 42bccae032a37b14f677333add9d8d8183c52ad55b7c0fc36b228f2b8e4d43fc ;;
    20261015_dg_recut_rotating        ) echo 2985d8a8be8a6ed2a4896c56aa449017b7e0699766b1f63e406658c7ac13471d ;;
    20261015_dg_recut_sim             ) echo f8494dcf52dca076a287f2a44dd044c4b651a3928f342ce9c56a6679802533e1 ;;
    20261015_dg_recut_stimulation     ) echo 814d23c272e786d08256850ddff64aea66f642d45632dd746840c6f2c1fd8e2a ;;
    20261015_dg_recut_supply          ) echo a6266870219b12789cb03ac102f683c5224152217dea5bdda1ab6aef1460eb84 ;;
    20261015_dg_recut_surveillance    ) echo 23f7b1d7612d15a96d027eab1434004a27d8a851aff6633fecc056cbfad1c9b3 ;;
    20261015_dg_recut_uncertainty     ) echo d7ebc3743eb5d0285d46f6eb5f3ca4651e1d8029ebbecc4869c74648dffcdd8d ;;
    20261015_dg_recut_waterflood      ) echo 4f651ecf1532a266214c9c8676a07d27610f47b6a9c0d250866d96e1b2a61262 ;;
    *) echo UNPINNED ;;
  esac
}
find_repo() {
  if [ -n "${REPO:-}" ]; then echo "$REPO"; return; fi
  up=$(cd "$HERE/../../.." 2>/dev/null && pwd)
  if [ -n "$up" ] && { [ -d "$up/.git" ] || [ -f "$up/.git" ]; }; then echo "$up"; return; fi
  echo "$LINKED"
}
resolve() {
  R=$(find_repo)
  git -C "$R" rev-parse --git-dir >/dev/null 2>&1 || refuse "$R is not a git repository"
  git -C "$R" fetch --quiet origin 2>/dev/null || echo "  (fetch failed, using the objects already present)"
  SHA=$(git -C "$R" rev-parse --verify --quiet "$REF^{commit}") || refuse "$REF does not resolve in $R"
  echo "repo:    $R"; echo "ref:     $REF ($SHA)"; echo
  bad=0; n=0
  for f in $FILES; do
    want=$(digest_for "$f"); [ "$want" != UNPINNED ] || refuse "$f has no pinned digest"
    if ! git -C "$R" show "$SHA:migrations/$f.sql" > "$RUN/$f.sql" 2>/dev/null; then
      echo "  MISSING   $f.sql is not in $REF"; bad=1; continue
    fi
    got=$(sha256sum "$RUN/$f.sql" | cut -d' ' -f1)
    if [ "$got" = "$want" ]; then printf "  ok        %-34s %s\n" "$f" "${got:0:12}"; n=$((n + 1))
    else printf "  STALE     %-34s\n              expected %s\n              found    %s\n" "$f" "$want" "$got"; bad=1; fi
  done
  [ "$bad" = 0 ] || refuse "the SQL at $REF is not the content this ladder was pinned to. If a later PR legitimately moved it, re-pin with: $0 pin $REF"
  echo; echo "All $n files match the pinned content."
}
bundle() {  # one transaction around all 25, ending in $1 (rollback|commit)
  { echo "begin;"; for f in $FILES; do cat "$RUN/$f.sql"; echo; done
    cat <<'SQL'
select 'left with internal wording (all live courses): ' || count(*)
  from public.academy_quiz_questions q join public.academy_apps a on a.slug = q.app_slug
 where a.status = 'available' and (
       (q.prompt || q.options::text || coalesce(q.explanation,'')) ~* 'digest'
    or (q.prompt || q.options::text || coalesce(q.explanation,'')) ~ '\mSECTIONS? [0-9]'
    or (q.prompt || q.options::text || coalesce(q.explanation,'')) ~ '\((SECTIONS?|[Ss]ections?) [0-9]+((,| and| or| to) [0-9]+)*\)'
    or (q.prompt || q.options::text || coalesce(q.explanation,'')) ~* '\m(the|a) generator (now )?(asserts|types|holds|measures|built while)\M|(course''s|capstone) generator|generator behind (this|the) course|the generator''s own');
SQL
    echo "$1;"; } > "$RUN/bundle.sql"
}
runsql() {
  if [ "${TARGET:-scratch}" = linked ]; then ( cd "$LINKED" && supabase db query --linked -f "$1" 2>&1 )
  else docker exec -i "${SCRATCH:-digest-scratch}" psql -U postgres -v ON_ERROR_STOP=1 -At < "$1" 2>&1; fi
}
case "${1:-verify}" in
  verify) resolve; echo; echo "VERIFY ONLY. No database was touched." ;;
  pin)
    [ $# -ge 2 ] || { echo "usage: $0 pin <ref>"; exit 2; }
    R=$(find_repo)
    for f in $FILES; do git -C "$R" show "$2:migrations/$f.sql" | sha256sum | awk -v n="$f" '{printf "    %-34s) echo %s ;;\n", n, $1}'; done ;;
  dryrun|apply)
    [ "$1" = apply ] && [ -z "${TARGET:-}" ] && refuse "apply needs TARGET=scratch or TARGET=linked set explicitly"
    resolve; echo; echo "TARGET: ${TARGET:-scratch}  MODE: $1"
    bundle "$([ "$1" = apply ] && echo commit || echo rollback)"
    OUT=$(runsql "$RUN/bundle.sql"); RC=$?
    echo "$OUT" | grep -E 'digest-copy recut|left with internal wording|ERROR' | sed 's/^.*NOTICE: *//'
    if [ $RC -ne 0 ] || grep -q 'ERROR' <<<"$OUT"; then echo; echo "FAILED: the transaction rolled back and nothing moved."; exit 2; fi
    [ "$1" = apply ] && echo "APPLIED: all 25 committed in one transaction." || echo "DRY RUN: rolled back, nothing moved." ;;
  *) echo "usage: $0 verify|pin <ref>|dryrun|apply"; exit 2 ;;
esac
