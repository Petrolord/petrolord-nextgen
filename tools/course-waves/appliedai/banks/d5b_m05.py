import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D5 Associate m05, Ranking and Metrics at a Cutoff.
# STUB written by the foundation. The bank writer replaces this comment and
# adds 15 q(...) calls: q(key_position, prompt, correct, [three distractors],
# explanation). Every figure is quoted from digest.txt; read BANK_TASK.md.
# The emit line below writes to a LITERAL path, which the kit's
# check-bank-sources reads; keep it as it is.

emit(Q, '/root/dai-wip-appliedai/banks/d5b_m05.json', expect_n=15)
finish()
