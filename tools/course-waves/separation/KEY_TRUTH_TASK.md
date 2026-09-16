# The key-truth audit (one agent per tier), FC1

## Why this exists, and why it is not optional

EC1 shipped a bank, `ec1i_m05.py`, that passed EVERY structural gate in the
wave kit and had the WRONG option keyed as correct in 11 of its 15
questions. The writer listed the four options in display order and passed
the first one as the correct answer, so `([c] + ds)[k]` made a distractor
the true answer every time, and the explanation under each question
supported the distractor. Rank, key balance, Jaccard, literal, leak and
length gates were all green, because every one of them reads STRUCTURE and
none of them reads TRUTH.

So: every bank gets a second reader for key truth before
`gen_migration.py`, and that reader is not the person who wrote it.

## Your assignment

You are the second reader for ONE tier of FC1 "Separation & Slug Catching":
seven banks, 132 questions (six module banks of 15 and a final exam of 42),
named `/root/fc-wip-separation/banks/fc1<b|i|a>_{m01..m06,exam}.json`. Your
tier letter is in your assignment.

For EVERY question, read the prompt, all four options, the keyed answer and
the explanation, against the digest and against the lesson the bank
examines. Decide one thing: **is the keyed option actually the correct
answer?**

Read, in this order:
1. `/root/fc-wip-separation/BRIEF.md`
2. `/root/fc-wip-separation/digest.txt`, the sections your tier draws on, in
   full
3. The lessons, under
   `/root/wt-fc1-nextgen/src/content/courses/separation/<tier>/`
4. Then the banks

Never open `/root/fc-wip-separation/fields.json` or
`fc1_fields_capstone.mjs`, and never write the names EJULEBE, ODEAMA or
ADANGA.

## What you are looking for, in order of how much damage it does

1. **A keyed distractor.** The explanation supports an option that is not
   the keyed one, or the keyed one is simply false against the digest.
2. **A question with two defensible answers.** The fix is to narrow a
   distractor, never to reword the key.
3. **A question with none.**
4. **An explanation that contradicts its own key**, even where the key is
   right.
5. **A claim keyed on something this wave corrects or pins.** FC1 has
   several, and a question keyed against the wrong reading is wrong:
   - **The preferred vessel is the SMALLEST FEASIBLE row inside the band**,
     not the first row inside the band. A row that cannot carry its gas, or
     whose droplet check fails, is infeasible whatever its slenderness.
   - **`preferred` is null** when there is none, and `preferredStatus` says
     whether nothing was feasible or nothing feasible was in band.
   - **The oil-water interface** is the exact depth whose circular segment
     holds the water area. The gas-liquid chord is the WIDTH of the
     gas-liquid surface and gives a smaller, wrong layer.
   - **A residence time under the proportional split is the retention time
     that was typed in.** It is an input read back, not a result.
   - **The layout check counts only positive requirements**; a zero table
     figure is counted separately, an unplaced item is skipped, and `pass`
     is null when nothing was checked.
   - **`complete` and `pass` answer different questions.** A layout can pass
     and be incomplete.
   - **Two rankings**: `worstAbsolute` in metres, `worstRelative` as a
     fraction of the requirement. Neither is "the worst" on its own.
   - **A pool fire radius is measured from the pool CENTRE**; the setback
     from the edge is smaller by half the pool diameter, and the layout
     check measures centre to centre.
   - **A missing named input throws and names itself**; a state the method
     has no answer for returns an `error` object.
- **The four HELD items** (the K derating and its 0.12 floor, the horizontal
  Souders-Brown settling velocity, the API 521 labels, the spacing table)
  may be examined for what they are and for what is unverified about them.
  A question that treats one of them as a checked publication is wrong.

## The FC1 facts a keyed answer most often gets wrong

- Absolute pressure is gauge plus 14.7, and the actual gas rate is the
  standard rate scaled by pressure, by temperature and by z. The retired app
  hardcoded z at 0.85.
- The liquid density the gas load sees is the oil and water densities
  weighted by their RATES, not averaged.
- A vertical vessel takes its diameter from the gas and its height from the
  retention volume plus the allowance. The velocity margin at the
  gas-required diameter is 1 by construction.
- In a horizontal vessel the liquid length is the retention volume over the
  LIQUID area and the gas length is the gas velocity over the settling
  velocity times the gas HEIGHT, so the gas length cannot exceed the gas
  height while the vessel carries its gas.
- A slug catcher vessel holds the slug PLUS the normal inflow during the
  hold; a finger harp is sized from the slug alone.
- A flare setback is computed from the heat release and moves when the duty
  moves. A table figure does not.
- Nothing in this course is a percentile, so no P-label belongs anywhere.

## The cheap tell, worth a glance and not a gate

A writer who keyed the first option everywhere leaves `k` doing all the
shuffling while the correct TEXT never varies in character, and the
explanation's numbers match a distractor more often than the key.

## Your second duty: the near duplicates in your tier

`python3 /root/dc-wavekit/wave_check.py /root/fc-wip-separation` lists
question pairs that are near copies. The final exams are written at the same
time as the module banks and blind to them, so an exam question that repeats
a module question is the expected collision and it is yours to resolve.
EC6 closed with 29 such pairs and every one was exam against module: budget
for it.

Rewrite the EXAM question, not the module one, unless the module question is
the weaker of the two. An exam question exists to examine ACROSS modules, so
the replacement should need two modules at once. Where two MODULE banks
collide, rewrite the one whose module owns the material less directly.

Re-run `wave_check.py` when you are done and report the count for your tier.

## How to fix

Edit the `.py`, never the `.json`, then re-run `python3 <bank>.py` so `emit`
regenerates and re-audits. Swapping which option is correct is a change to
`k` and to the option lists, and it will usually move the answer-length rank
distribution, so expect to run `python3 /root/dc-wavekit/plan_ranks.py
<bank>.py` afterwards and lengthen a distractor. Never edit the correct
option's wording to satisfy a length gate.

## Report

Per bank: how many questions you read, how many you changed, and for each
change the question number, what was keyed, what is actually correct, and
the evidence from the digest or the lesson. If a bank is clean, say so and
say what you checked, because "clean" from a reader who skimmed is worse
than no audit at all.
