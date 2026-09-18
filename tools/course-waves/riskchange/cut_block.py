#!/usr/bin/env python3
"""Cut named check blocks out of the go-live on stdin, for dryrun_asrc.sh's
negative controls only. `ledger` is the engine-ledger block, `route` the second
route in SQL. A block runs from its section banner to the next banner, and the
script refuses if a named banner is absent, so a control can never pass
because the cut silently removed nothing."""
import sys
BANNERS = {'ledger': '-- ------------------------------------ 1. against the engine call ledger',
           'route': '-- ----------------------------------------------- 2. the second route in SQL'}
sql = sys.stdin.read()
for name in sys.argv[1:]:
    b = BANNERS[name]
    i = sql.find(b)
    if i < 0:
        sys.exit(f'cut_block: no {name} banner in the go-live')
    j = sql.find('  -- -----', i + len(b))
    sql = sql[:i] + f'-- ({name} block cut for a negative control)\n' + sql[j:]
sys.stdout.write(sql)
