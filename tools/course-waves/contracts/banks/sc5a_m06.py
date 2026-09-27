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

# SC5 Expert m06, Integrity, Governance and the Written Case. 15 questions.
# Lessons: Conflicts of interest and gifts; Fraud and corruption in execution; Governance and assurance of the contract portfolio; Reading the sources as they change; The written case brief.
# Topics: T01, T10, T11, T12, T14, T15, T16.
# Every key rests on a PACK.md passage named in its src list; the
# explanation cites the SOURCE by name and locator (an Act and its section,
# a guidance and its paragraph), never a passage id or a pack section.
# EMPTY AT THE FOUNDATION: the bank writers fill it.

emit(Q, '/root/cat-wip-contracts/banks/sc5a_m06.json', expect_n=15)
finish()
