#!/usr/bin/env python3
# SHIP PHASE, NOT YET D4. Carried from D3 (tools/course-waves/facies) at the D4
# foundation with names rewritten only; its D3 content (fields, prompts, case
# files, dates) is rewritten for D4 at the ship phase. Do not run it for D4 yet.
"""Cut named check blocks out of the go-live on stdin, for dryrun_d2.sh's
negative controls only. `ledger` is the engine-ledger block, `route` the second
route in SQL. A block runs from its section banner to the next banner, and the
script refuses if a named banner is absent, so a control can never pass
because the cut silently removed nothing."""
import sys
BANNERS = {'ledger': '-- ------------------------------------------ 1. against the engine ledger',
           'route': '-- ----------------------------------------------- 2. the second route in SQL'}
sql = sys.stdin.read()
for name in sys.argv[1:]:
    b = BANNERS[name]
    i = sql.find(b)
    if i < 0:
        sys.exit(f'cut_block: no {name} banner in the go-live')
    j = sql.find('  -- -----', i + len(b))
    if j < 0:
        sys.exit(f'cut_block: the {name} block has no following banner')
    sql = sql[:i] + f'-- ({name} block cut for a negative control)\n' + sql[j:]
sys.stdout.write(sql)
