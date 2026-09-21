# H4 Consequence Modelling: the bank writer's task

Read `BRIEF.md` and `LESSON_TASK.md` first. Every number in this file is quoted
from `digest.txt`, which is the only teaching truth for this course. The engine's
FINDINGS record, the oracle and the engine's source comments are PROVENANCE.

## THE SHAPE

132 questions a tier: 6 module banks of 15, plus a 42 question exam. Four
options each, one correct, and an explanation that says WHY the wrong ones are
wrong. Banks live in `banks/` as `h4<b|i|a>_<m01..m06|exam>.py` and `.json`.

## THE ANSWER-LENGTH DEFECT

A shipped bank was passable without reading the question, because the
second-longest option scored about four answers in five. **Balance the option
lengths.** `lengthtails.py` measures it. Lengthen distractors; never edit the
correct option to satisfy the gate.

## WHAT MAKES A GOOD H4 QUESTION

The engine's own distinctions, all of them in the digest, and a good distractor
is a real wrong method with its real number:

1. **the head alone.** The AMENAM line at an ambient ullage gives 11.225132 kg/s
   against 19.354651 kg/s with its blanket pressure.
2. **the inferred ratio.** The Yellow Book hydrogen case reproduces 15.31 kg/s
   only at 1.405; 1.4 gives 15.292930.
3. **the thickness.** Halving a stated thickness raises the diameter by 1.414214.
4. **the misprint.** Class D at 1000 m has a sigma_z of 37.947332 m; the
   misprinted coefficient would give 55.950288.
5. **the wind form.** ERHA's flame is 35.746382 m by Thomas with wind at no wind
   and 37.101102 m by the still air form.
6. **the overhang.** A target under a tilted flame is refused; the closed form's
   Fv there would read 0.394516 where the surface integral gives 0.401252.
7. **cube root scaling.** Eight times the charge at twice the distance gives the
   same 7457.699887 Pa.
8. **the preset.** 20000 W/m2 for 20 s is 0.022455 under Eisenberg and 0.537647
   under Tsao and Perry.

## THE CAPSTONES ARE NOT YOURS

The three capstone facilities live in `h4_capstone.mjs` and NOTHING ABOUT THEM IS
IN `digest.txt`: no facility name, no distinctive input, no answer. A question
that wants the capstone's subject teaches the METHOD with the digest's own
streams. `gate_capstone_leak.mjs --banks banks` sweeps every prompt, option and
explanation.

## NO FORWARD REACH, AND NO SEAM GRADED

An Associate question never computes a heat flux or a probit; a Professional
question never computes an overpressure or a probit. No question grades a point
source heat radiation level, a setback, a frequency, a risk measure, a matrix
band or an emission; the seam may be named only in the banks `gate_vocabulary.py`
lists (intermediate m05, advanced m05 and advanced m06).

## THE VOCABULARY AND THE COPY RULE

Digest section 34 is binding on every prompt, option and explanation. No em
dashes, no en dashes, no "X, not Y" contrastive. When you quote an engine message,
quote it verbatim and say it is the engine's own words.
