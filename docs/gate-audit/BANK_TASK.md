# The bank-writing task (one agent per batch of banks)

You write question banks for a NextGen Academy course wave. The wave directory
is given to you in your assignment as `$WAVE` (e.g. `/root/pd-wip-rodpump`).
Other agents work in the same directories. Touch ONLY the bank files you are
assigned. Do NOT commit, do NOT switch branches, do NOT edit lessons, the
digest, `fields.json` or anything under the repo worktree.

## Read first

1. `$WAVE/BRIEF.md`, the course brief. Binding.
2. `$WAVE/digest.txt`, the teaching numbers. **Every number in every question,
   option and explanation must appear in this file.** It is checked
   mechanically. Nothing else is permitted.
3. The lessons your banks examine, under
   `/opt/petrolord-studio/workspaces/dev1/projects/petrolord-nextgen/src/content/courses/<slug>/<tier>/<module>/`.
   A module bank examines ITS OWN module's lessons and nothing later.
4. One finished bank for shape and voice:
   `/root/pd-wip-gaswell/banks/pd5i_m03.py`.

## NEVER

`$WAVE/fields.json` and `$WAVE/pd*_fields.mjs` hold the GRADED CAPSTONE
ANSWERS. Do not open them, do not use them, and no number you write may be
within ten grading tolerances of one. A gate sweeps for this in three unit
shiftings and it will find it.

## Format

A bank is a python file:

```python
import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

q(2, "prompt", "the correct option", ["d1","d2","d3"], "explanation")
...
emit(Q, 'BANKPATH.json')
finish()
```

`k` is the index the correct option is to occupy, 0 to 3. `emit` assembles,
audits and REFUSES TO WRITE on a failed gate, so run the file and read what it
says. `python3 <bank>.py` is the whole loop.

Module banks hold 15 questions. A final exam holds 42.

## The gates, and what they are for

- **Answer-length rank.** Rank 0 is the longest of the four options, rank 3 the
  shortest. No rank may carry more than 40 percent of a bank or less than 12
  percent. A candidate who reads nothing and always picks the longest option
  must score at the chance line. If the gate complains, run
  `python3 /root/dc-wavekit/plan_ranks.py <bank>.py`, which prints the exact
  per-question edit. **Lengthen a distractor, do not shorten one**: you lengthen
  it by naming the mechanism it wrongly invokes, which makes it more tempting
  and improves the question. **NEVER edit the correct option to satisfy a gate.**
  Its wording is the answer.
- **Key balance and key pattern.** Roughly even across 0 to 3, and no repeating
  cycle. Fix by swapping `k`, which moves position and not text.
- **Jaccard.** No option may be a near-copy of another.
- **No positional language.** No "all of the above", no "option B".
- **No em dashes and no en dashes anywhere.** Owner rule.

## What a good question is

- It examines something the lesson EXPLAINED, not something it mentioned.
- Every distractor is a real misreading someone would make, and its wrongness
  is a mechanism, not a typo. A distractor that invokes the wrong physics by
  name is worth four that change a digit.
- The explanation says WHY, in one or two sentences, and carries a number.
- At least two questions per module bank must turn on a LIMIT, a REFUSAL or a
  MARGIN: where the engine declines to answer, where its answer rests on a
  margin no field instrument could resolve, or where a documented default
  silently decides the result.
- A final exam is not the module banks concatenated. It examines across
  modules, and at least six of its 42 must require two modules at once.

## When you are done

Run, for each bank you wrote:

    python3 <bank>.py

and report the gate line it prints. Then report, in prose, the two or three
sharpest questions you wrote and what each turns on.
