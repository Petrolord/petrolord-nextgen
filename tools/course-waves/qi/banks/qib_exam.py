import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# QI b exam: STUB. Replace the question list; keep the emit line and its literal path.

emit(Q, '/root/qi-wip-qi/banks/qib_exam.json', expect_n=42)
finish()
