# The bank-writing task (one agent per batch of banks), FC1

You write question banks for the FC1 "Separation & Slug Catching" course
wave. The wave directory is `/root/fc-wip-separation` (`$WAVE` below). Other
agents work in the same directory. Touch ONLY the bank files you are
assigned. Do NOT commit, do NOT switch branches, do NOT edit lessons, the
digest, `fields.json` or anything in a repo worktree.

## Read first

1. `$WAVE/BRIEF.md`, the course brief. Binding.
2. `$WAVE/digest.txt`, the teaching numbers. **Every number in every
   question, option and explanation must appear in this file.** It is
   checked mechanically. Nothing else is permitted.
3. The lessons your banks examine, under
   `/root/wt-fc1-nextgen/src/content/courses/separation/<tier>/<module>/`.
   A module bank examines ITS OWN module's lessons and nothing later.
4. One finished bank for shape and voice:
   `/root/ec-wip-fdp/banks/ec6a_m05.py` (EC6, the most recent wave).

## NEVER

`$WAVE/fields.json` and `$WAVE/fc1_fields_capstone.mjs` hold the GRADED
CAPSTONE ANSWERS. Do not open them, do not use them, never name EJULEBE,
ODEAMA or ADANGA, and no number you write may be within ten grading
tolerances of one. A gate sweeps for this in three unit shiftings and it
will find it.

## Format

A bank is a python file named `$WAVE/banks/fc1<b|i|a>_<m01..m06|exam>.py`:

```python
import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

q(2, "prompt", "the correct option", ["d1","d2","d3"], "explanation")
...
emit(Q, '/root/fc-wip-separation/banks/fc1b_m01.json')
finish()
```

`k` is the index the correct option is to occupy, 0 to 3. `emit` assembles,
audits and REFUSES TO WRITE on a failed gate, so run the file and read what
it says. `python3 <bank>.py` is the whole loop.

Module banks hold 15 questions. A final exam holds 42.

## The gates, and what they are for

- **Answer-length rank.** Rank 0 is the longest of the four options, rank 3
  the shortest. No rank may carry more than the cap or less than the floor.
  A candidate who reads nothing and always picks the longest, or the
  second-longest, option must score at the chance line. If the gate
  complains, run `python3 /root/dc-wavekit/plan_ranks.py <bank>.py`.
  **Lengthen a distractor, do not shorten one**, by naming the mechanism it
  wrongly invokes. **NEVER edit the correct option to satisfy a gate.**
- **Key balance and key pattern.** Roughly even across 0 to 3, no repeating
  cycle. Fix by swapping `k`, which moves position and not text.
- **Jaccard.** No option may be a near-copy of another.
- **No positional language.** No "all of the above", no "option B".
- **No em dashes and no en dashes anywhere.** Owner rule.

## The FC1 corrections (checked by the key-truth reader)

- The engine is REPAIRED (FC1-0, engines #188). The L/D sweep reports every
  row with `feasible`, `inRange` and `reasons`, and `preferred` is the
  SMALLEST FEASIBLE row inside the band, null when there is none, with
  `preferredStatus` saying which of `selected`, `none-in-band` and
  `none-feasible` applies. Three-phase sizing places the oil-water interface
  at the exact depth whose circular segment holds the water area, and
  returns both droplet verdicts. A three-phase row whose droplet check fails
  is infeasible. The layout check counts only comparisons with a positive
  requirement, reports `skipped`, `unknownPairs`, `complete`, `pass` (null
  when nothing was checked) and TWO rankings, `worstAbsolute` and
  `worstRelative`. The pool fire reports a radius from the pool CENTRE and a
  setback from the pool EDGE, with `setbackStatus`.
- What the code did before FC1-0 is history and may be examined AS history:
  a preferred diameter chosen without looking at gas capacity, an interface
  height taken from the gas-liquid chord, droplet checks that returned false
  when an input was missing, a layout that passed with nothing checked, one
  ranking called the worst, and a pool setback measured from the edge while
  the check measured centre to centre. A question may ask what the repair
  changed; it may never present the retired behaviour as current.
- **Four HELD items may be examined for WHAT THEY ARE and never for a
  number a learner should trust:** the K derating and its 0.12 floor, the
  horizontal Souders-Brown settling velocity, the API 521 labels, and the
  spacing table. A question may ask what is unverified about them.
- ABANA-1 (a vertical test separator), ABANA-2 (the horizontal production
  separator on the same stream) and AGBAMI (a three-phase separator) are
  different vessels: never mix their numbers unless mixing them is the
  mistake examined, and the explanation says so.

## What a good question is

- It examines something the lesson EXPLAINED, not something it mentioned.
- Every distractor is a real misreading someone would make, and its
  wrongness is a mechanism: gauge read as absolute, z left at 1, the
  standard rate used as the actual rate, the whole cross-section used as the
  gas area, the chord used as the interface, a residence time read back as
  an answer when it is the retention time that was typed in, the first
  in-band row preferred over the first feasible one, a pool radius passed as
  a setback, a table figure treated as a calculation, `pass` true read as a
  layout that was checked.
- The explanation says WHY, in one or two sentences, and carries a number.
- At least two questions per module bank turn on a LIMIT, a REFUSAL or a
  MARGIN: where the engine declines to answer, where a held assumption
  decides the result, or where a verdict used to fail open.
- A final exam is not the module banks concatenated. It examines across
  modules, and at least six of its 42 require two modules at once.

## Keys are audited after you

Every bank is read afterwards by a second agent whose only job is to check
that the option marked correct IS correct (EC1 shipped seventeen mis-keyed
questions that every structural gate passed). Before you run a file, re-read
each `q(...)` and confirm the second argument is the true answer and `k` is
where you want it.

## Scratch files

Name every scratch file with your assignment in it (for example
`fc1a_m04_check.py`), never a generic `check.py`.

## When you are done

Run, for each bank you wrote, `python3 <bank>.py`, and report the gate line
it prints. Then report, in prose, the two or three sharpest questions you
wrote and what each turns on.
