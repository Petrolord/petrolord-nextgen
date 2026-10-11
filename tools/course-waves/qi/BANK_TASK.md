# QI Quantitative Interpretation: the bank writer's task

Read `BRIEF.md` and `LESSON_TASK.md` first, then the kit's
`/root/dc-wavekit/BANK_TASK.md` (format, gates, key-truth rule), which binds
here in full. Every number you write is quoted from `digest.txt`, the only
teaching truth for this course.

## THE SHAPE

132 questions a tier: 6 module banks of 15, plus a 42 question exam. Four
options each, one correct, and an explanation that says WHY the key is right
and why the wrong ones are wrong, carrying a number. Banks live in
`/root/qi-wip-qi/banks/` as `qi<b|i|a>_<m01..m06|exam>.py`; each stub already
writes its JSON to its LITERAL path with its `expect_n`. Replace the stub's
question list and keep its emit line. Run `python3 <bank>.py`: it refuses to
write on a failed gate.

Touch ONLY the bank files you are assigned. Do not edit lessons, the digest,
`fields.json`, gates or anything in the NextGen worktree. Do not commit.

## NEVER

The capstone cases and `fields.json` hold graded answers and their inputs. Do
not open them, `qi_capstone*.mjs` or `qi_cases*.mjs`. No number you write may
be within ten tolerances of a graded value; `bankleak.py` and
`gate_capstone_leak.mjs --banks` sweep for it.

## THE ANSWER-LENGTH RULE

Every length rank (0 longest to 3 shortest) carries at least 12 and at most 40
percent of a bank's keys, so a candidate who reads nothing scores near the 25
percent chance line. `python3 /root/dc-wavekit/plan_ranks.py <bank>.py`
prints the per-question edit; `python3 /root/dc-wavekit/lengthtails.py
/root/qi-wip-qi/banks --prefix qi<b|i|a>` checks both tails across your tier.
**Lengthen a distractor by naming the mechanism it wrongly invokes; never
shorten a distractor's substance; never edit the correct option to pass a
gate.** Vary the openings of all four options.

## EVERY KEY RESTS ON A LINE THE DIGEST PRINTS

For each question, hand back the digest line (number and text) its key rests
on. A key that rests only on a lesson sentence goes. Every distractor must be
provably false by a printed line. No "why" key unless the digest prints the
reason. Signs as printed.

## WHAT MAKES A GOOD QI QUESTION

The engines' own distinctions, all in the digest; a good distractor is a real
wrong method with its real number read from the wrong place:

1. **one trace against the mean spectrum** (section 10): a single trace's
   -6 dB band hugs its peak.
2. **the taper, the window and the lag are stated choices** (sections 10, 11).
3. **a footprint is called only by the stated rule** (section 12): share,
   prominence and cycles together.
4. **Greenberg-Castagna against the measured shear** (section 13) and the
   oil leg's larger ratio, and why.
5. **the prediction interval against the fit's scatter**, the level and the
   extrapolated flag (section 14).
6. **AI and Vp/Vs before and after substitution**, and why the substituted oil
   leg is not the water leg (sections 15, 17).
7. **Wood against a stiffer mix**, and the pore fluid near the softer phase
   (section 16).
8. **the fitted wet trend against the published line** (sections 18, 19):
   which line a distance is read from changes the distance.
9. **the class does not separate oil from brine here** (section 20).

At least two questions a module bank turn on a LIMIT, a REFUSAL or a MARGIN
(an engine refusal from section 5, a NaN result, an extrapolated prediction,
the clamp on signal to noise, a stated cut-off that decides a selection). A
final exam is not the module banks concatenated: at least six of its 42 need
two modules at once.

## NO FORWARD REACH

An Associate question never needs a tie, a gather, an angle, an inversion or a
property transform; a Professional question never needs an inversion.

## PRINTED ALIKE IS NOT EQUAL

Two figures that agree at six decimals are never keyed as equal unless the
digest says the engine returns them equal.

## THE VOCABULARY AND THE COPY RULE

Digest section 60 binds every prompt, option and explanation. No em dashes,
no en dashes, no "X, not Y" contrastive, no "rather than", no ", never", no
"instead of", no "and not", no "and never". Quote an engine message verbatim
and say it is the engine's own words. Never cite a digest section number in a
question or an explanation; say "the course".

## WHEN YOU ARE DONE

Run every bank you wrote and report its gate line; run `lengthtails.py` and
`python3 /root/dc-wavekit/dupaxes.py /root/qi-wip-qi/banks --prefix qi<t>
--threshold 0.45` for your tier; report the two or three sharpest questions,
and for every question the digest line its key rests on.
