#!/usr/bin/env bash
# PROVE THE COURSES THAT SHARE THE VENDORED ENGINES ARE UNCHANGED.
#
# Since the EC4/EC5 recut (fix/decision-portfolio-recut) the joa course's engine
# closure sits on the canonical packages/engines paths at petrolord-engines
# fb5a363, and the proof that every course sharing those files rebuilds its
# digest, fields and precision byte-identical (and that the vendored tree differs
# from origin/main only by the recut's ledgered paths) lives in one place:
# tools/course-waves/ec45-recut/prove_prior_courses.sh. This gate runs it.
# The joa-only proof it replaced (the tree at its own vendoring commit) is in git
# history.
set -euo pipefail
NG=${NG:-${EC9_REPO:-/root/wt-ec45-recut}}
exec env NG="$NG" bash "$NG/tools/course-waves/ec45-recut/prove_prior_courses.sh"
