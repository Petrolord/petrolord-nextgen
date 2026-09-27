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

# SC5 Expert final exam: THE WRITTEN-CASE BANK. 42 scenario questions, seven
# drawn from the material of each module, each set in one of the synthetic
# Ekene contracts the pack registers: a short case (the facts, the clause or
# the record, what has happened) and a question on what the sources support.
# Auto-graded multiple choice, no numeric field. It replaces the capstone of
# an app or engine course and issues the Expert certificate at the existing
# final exam pass mark.
# Topics: T01, T03, T05, T07, T09, T10, T11, T12, T13, T14, T15, T16.
# Every key rests on a PACK.md passage named in its src list; the
# explanation cites the SOURCE by name and locator (an Act and its section,
# a guidance and its paragraph), never a passage id or a pack section.
# EMPTY AT THE FOUNDATION: the bank writers fill it.

emit(Q, '/root/cat-wip-contracts/banks/sc5a_exam.json', expect_n=42)
finish()
