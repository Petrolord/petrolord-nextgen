import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# QI a m02: STUB. Replace the question list; keep the emit line and its literal path.

emit(Q, '/root/qi-wip-qi/banks/qia_m02.json', expect_n=15)
finish()
