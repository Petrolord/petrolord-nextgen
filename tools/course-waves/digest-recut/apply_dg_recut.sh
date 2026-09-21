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
# Likewise the B3 engine-strings recut (20261015_b3_recut_*, PR #184) goes
# first: for the rows it touches in crude, refinery, supply, gasvalue and
# carbon, this recut's published text IS B3's recut text, so without it those
# files refuse and nothing moves. The file names sort after b3 for that reason.
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
    20261015_dg_recut_carbon          ) echo 1feaa0c59a6fdcf33580cf7a440408e0dda9c48db236296de9fb1340cc395671 ;;
    20261015_dg_recut_cashflow        ) echo 22be3f8d5173102f2def4bc684746cc913f02eebf929af9d25d585dafa12f0eb ;;
    20261015_dg_recut_compliance      ) echo 29faf363b731f49a49aeb97feb1e7f39fe84d3eca29a5d215606322492079a9e ;;
    20261015_dg_recut_corrosion       ) echo 46bfd8dc7152c3beccaab31c452837408124815a8a53a0487c8ad2b9afaa4eac ;;
    20261015_dg_recut_crude           ) echo e0a89e94337b454094e69b30309089be30bad644f9d86b08ad38d8ebb2497551 ;;
    20261015_dg_recut_gasprocessing   ) echo 637626818a63107a023db210e3dd91cf1ac649f22b129b50fbce6c75fd768180 ;;
    20261015_dg_recut_gasvalue        ) echo ff809eda82b82636964cb1094fe5ecfa84e4fa95164987f7a907cbf5eeda11b5 ;;
    20261015_dg_recut_heattransfer    ) echo 3720db67dc62939c5c27389111b445f46a9c09f4370ebe760baf581607b6b6e4 ;;
    20261015_dg_recut_integrity       ) echo e750061a2f5d502ed8fda97af71c0df3f1d6a4f7e7dfbaa9d173e0b58f8d1359 ;;
    20261015_dg_recut_intervention    ) echo aa5f48afc59f5527a9976e9ab6d3987e8c3d867c15af5b7781faf9929dc8081c ;;
    20261015_dg_recut_linesizing      ) echo 25e1adc384cb23bd32fbd2537121fd86c3cebe338a83707c99aea33505d7b1ca ;;
    20261015_dg_recut_metering        ) echo e8d3530a37d3c265cc01a20138fbff646e3db28c6f74d476a054b37afb1d79e3 ;;
    20261015_dg_recut_network         ) echo 5e2760608ad7e2a439c8a5db3a1e2cf6dd370422f90eed08cd48dada79a2db71 ;;
    20261015_dg_recut_portfolio       ) echo baa22a37b3678063eb7f714ea9efd820892663ecd0cc85786249ad3647ab27f1 ;;
    20261015_dg_recut_producedwater   ) echo e095c996aab76a622d2daed2c41dc0d57739100963e3260524fe4555ce9e41f3 ;;
    20261015_dg_recut_refinery        ) echo 8339a142ffb8b7b48648d1d6acdd2d7c58c1c93d8844e16290a18604c02313bd ;;
    20261015_dg_recut_relief          ) echo 610da67ff86119e9963a2b201ac20c1477957a787c372a0382674d32dd8cbb2c ;;
    20261015_dg_recut_riskchange      ) echo b450fd87dbd6ede191d33844b5f8cb3025112ffeacaf0fbd328d78c3b878aa7f ;;
    20261015_dg_recut_rotating        ) echo 961087d77fa6d1744c78218e5da57e6b744e87c43d60e90169cfdac4bd1ae4ef ;;
    20261015_dg_recut_sim             ) echo 9e157c341d90f0fc738c86d88a18b49b563398e52d45f2f5e1f22abca8192a4c ;;
    20261015_dg_recut_stimulation     ) echo b713c65ecfb44de6c0fc6df7ece1ea2b705b34ceb7cd15da46241dc8b04aa255 ;;
    20261015_dg_recut_supply          ) echo dcbe21d5d7bdc3212928b94af4812c14a88b4fa8aa39bd3070df874390002444 ;;
    20261015_dg_recut_surveillance    ) echo c8365d83fd5be3a107601c3a08c2e5a06a6e76990c523aee03d1d07f43fc0974 ;;
    20261015_dg_recut_uncertainty     ) echo 846581059a21682c93cb1d314d70c373cc96fe9e23d96059002444035560f4d7 ;;
    20261015_dg_recut_waterflood      ) echo 9eea90b5e27b2a9ef6a445513b6989073626ad5a382309d860701ac0f534c290 ;;
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
