# The lesson-writing task (one agent per half-tier), FC1

You are writing lessons for FC1 "Separation & Slug Catching" in the
Petrolord NextGen Academy. It is the first Facilities course.

**Where you work.** The repo worktree is `/root/wt-fc1-nextgen`, on branch
`feat/fc1-separation-course`.
- Do NOT commit, do NOT switch branches, and do NOT touch any file outside
  your assigned lesson paths. Other agents are writing in the same worktree
  at the same time.
- Never touch the shared `petrolord-nextgen` checkout; it is a live staging
  mount.

## Read first

1. `/root/fc-wip-separation/BRIEF.md`, the course brief. It is binding.
2. `/root/fc-wip-separation/digest.txt`, the teaching numbers.
   - **Every number you write must come from this file.** Nothing else is
     permitted, and this is checked mechanically after you finish.
   - The section map is at the end of the brief. Read the sections your
     modules draw on IN FULL before writing a word.
   - Lines starting `# App surface:` are explanation you may paraphrase.
3. Two finished lessons from earlier courses in this worktree, for shape,
   voice and heading rhythm:
   `src/content/courses/fiscal/beginner/m04-the-concession-ledger/l02-profit-oil-at-a-flat-split.md`
   and any lesson under `src/content/courses/fdp/advanced/m05-what-earned-value-refuses/`.
   - These lessons have NO front matter: a `# Title` line, a one or two
     sentence opening paragraph, the `{{panel:<id>}}` line when the manifest
     lists a panel, then `##` sections ending in `## Exercise`. Copy that
     shape exactly.
4. Your tier's `manifest.json` under
   `/root/wt-fc1-nextgen/src/content/courses/separation/<tier>/`. It already
   exists and gives every lesson its key, title, minute count and panel ids.
   Do not change it.

## What you are writing

The lesson files at
`src/content/courses/separation/<tier>/<module-key>/<lesson-key>.md`. The
directories exist and are empty. Create each file.

## The standard

- **Length.** 420 to 560 words of body prose per lesson, ranked by
  `est_minutes` so a 12 minute lesson comes in shorter than a 14 minute one.
  `est_minutes` is NOT prose reading time; it covers working the panel and
  the exercise too. Measure with `python3 /root/fc-wip-separation/lengths.py`.
- **Every claim gets its number.** Show the arithmetic where the digest
  does: an area from a level, a length from a retention volume, a margin
  from two velocities, a setback from a heat release.
- **Say what the thing refuses to do.**
  - The sizing engine sizes a vessel. What LEAVES each stage of a train is a
    flash calculation and lives in a different engine.
  - A named input that is missing or out of domain throws and names itself.
    A state the method has no answer for comes back as an `error` object.
  - The pool fire model is a point source. It computes no view factor, and
    close to the flame it under-predicts and says so.
- **Teach the mistake, not just the method.** Examples:
  - gauge pressure used as absolute, or z left at 1 or hardcoded at 0.85;
  - the standard gas rate used where the actual rate belongs;
  - half full assumed when a level was stated;
  - the gas-liquid chord used as the oil-water interface;
  - a radius from the pool centre passed as a setback from the pool edge;
  - the first row inside the L/D band taken as the preferred vessel while it
    cannot carry its gas;
  - a layout that passed because nothing in it was checked.
- **Quote whole rows where a row is the point.** A markdown table copied
  from the digest, with the columns the lesson needs and no others, is
  welcome.

## Hard rules, all mechanically checked

1. **No number that is not in the digest.** Not rounded differently, not
   rescaled, not recombined.
   - If you need a number the digest lacks, say so in your report instead of
     inventing it.
   - Vessel work prints to six decimals (ft, ft2, ft per s, lb per ft3,
     ratios); metres, kilowatts and seconds to four; counts are whole
     numbers. Quote them exactly as printed.
2. **Never mention the capstone.** Its streams are called EJULEBE, its
   sites ODEAMA and ADANGA. Nothing about them may appear: not the names,
   the pressures, the rates, the droplet sizes, the coordinates, the duties
   or the answers. The teaching streams ABANA-1, ABANA-2 and AGBAMI and the
   ERHA flow station are yours to use.
3. **The repaired engine.** Describe the sweep as reporting every row with
   its reasons and preferring the smallest FEASIBLE row inside the band;
   three-phase sizing as placing the interface at its exact height and
   returning droplet verdicts; the layout check as counting only positive
   requirements, listing what it skipped, and returning `pass` null when
   nothing was checked. What the engine and the Suite layer did before FC1-0
   is history, introduced as such.
4. **Four things are HELD FOR LITERATURE and are taught as limits, never as
   answers and never as arithmetic a learner should repeat:** the K pressure
   derating and its 0.12 floor, the horizontal use of Souders-Brown as the
   droplet settling velocity, the API 521 radiation labels, and the spacing
   table figures. Say what they are, say what is unchecked about them, and
   do not build a conclusion on them.
5. **No em dashes and no en dashes.** Owner rule. Use a comma, a colon or a
   full stop. No "X, not Y" contrastives built with a dash.
6. **No positional references.** Never "as we saw above", "in the previous
   lesson" or "the table below". Each lesson is read on its own.
7. **Units.** Field units for vessels (MMscfd, bpd, psig and psia, degF, ft,
   minutes), metres for the site, kW for heat release, kW/m2 for radiation.
   Percent is written as the word. "psig" and "psia" are never mixed.
8. **P-labels have no place in this course.** Nothing here is a percentile.
9. **The panel line** `{{panel:<id>}}` appears exactly where the fiscal
   lessons put theirs, for every panel id the manifest lists.

## Before you report

Run `python3 /root/fc-wip-separation/lengths.py` and paste the result for
your tier. Name any scratch file with your assignment in it (for example
`fc1a_m04_check.py`); agents share scratch space.

**Report:**
- the lessons you wrote and their word counts;
- any digest number you wanted and could not find;
- anything in the digest that looked wrong to you.

That last one matters: courses in this programme have found real engine
defects because a lesson writer said a number looked wrong instead of
writing around it.
