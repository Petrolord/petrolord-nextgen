import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
TRACE=[]
def q(k,p,c,ds,e,src):
    # k the key's index (0 to 3), p the prompt, c the correct option, ds the
    # three distractors, e the explanation, src the PACK.md passage ids (P001
    # style) the key rests on: at least one, read by gate_source_trace.py and
    # never printed to a learner.
    Q.append((k,p,c,ds,e)); TRACE.append(list(src))

# SC5 Associate m01, Contract Management and Its Sources. 15 questions.
# Lessons: What contract management is; The contract lifecycle from award to close; Owners, managers and the supplier; The sources and the dates they were checked; A practice course and its written work.
# Topics: T01, T15.
# Every key rests on a PACK.md passage named in its src list; the
# explanation cites the SOURCE by name and locator (an Act and its section,
# a guidance and its paragraph), never a passage id or a pack section.
# EMPTY AT THE FOUNDATION: the bank writers fill it.

emit(Q, '/root/cat-wip-contracts/banks/sc5b_m01.json', expect_n=15)
finish()
