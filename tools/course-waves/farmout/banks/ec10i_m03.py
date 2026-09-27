import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC10 Professional m03, Deal Value to Each Side.
# A STUB written at the foundation. The bank writer replaces the question list
# below (fifteen questions, BANK_TASK.md) and keeps the emit line, whose path is
# literal because the kit's check-bank-sources reads literal paths only.

emit(Q, '/root/cat-wip-farmout/banks/ec10i_m03.json', expect_n=15)
finish()
