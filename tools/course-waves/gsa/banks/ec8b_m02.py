import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC8 Associate m02, Volume to Energy.
# STUB written by the foundation. The bank writer replaces this comment and
# adds 15 q(...) calls: q(key_position, prompt, correct, [three distractors],
# explanation). Every figure is quoted from digest.txt; read BANK_TASK.md.
# The emit line below writes to a LITERAL path, which the kit's
# check-bank-sources reads; keep it as it is.

emit(Q, '/root/cat-wip-gsa/banks/ec8b_m02.json', expect_n=15)
finish()
