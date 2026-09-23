# D1 Oilfield Data Quality: the lesson writer's task

Read `BRIEF.md` first. This file is the working instruction for the 78 lesson
bodies.

## WHERE YOUR NUMBERS COME FROM

`digest.txt` in this directory, and nowhere else. Every number in this task
file is quoted from it. The engine's FINDINGS record, the oracle, the library
pins, the dataset generator's source and the engine's source comments are
PROVENANCE.

Quote a figure at the precision the digest prints it at. The digest header
declares it: every measured value, statistic, limit, fraction, score, step and
difference to SIX decimals; counts, entry numbers and days as whole numbers.

## WHAT A LESSON IS

`structure.py` is the authority on the 18 module keys, the 78 lesson keys, the
titles, the `est_minutes` and the panel tags. It self-checks and reports zero
problems. Do not add, rename or reorder a lesson: change `structure.py` and
re-run it, then `scaffold.py`.

Each lesson carries between its own minimum and 560 PROSE WORDS: 420 at 12
minutes, 460 at 13, 500 at 14. Prose words is what `lengths.py` counts: front
matter, markdown table rows and `{{panel` lines are excluded, and headings are
counted.

Every stub `scaffold.py` wrote carries the lesson title as its H1 and one
`{{panel:...}}` line per panel tag. Keep both exactly (`scaffold.py --check`
reports any drift). An opening paragraph under the H1, then short `##`
sections ending in `## Exercise`. A small table, numbers first, and an
`## Exercise` that asks the learner to DO something with a number the lesson
printed, in the panel, never to recall one.

## THE TIER LINE, AND WHY IT IS HARD

Every tier's lessons may use a lower tier's checks. **No tier's lessons may use
a higher tier's.** An Associate lesson never shows a z-score, a quartile fence
or a chart; a Professional lesson never draws a control chart or a scorecard.
The kit's `leakage.mjs` judges a reach by which digest section owns the figure:
sections 1 to 16 are Associate, 17 to 24 Professional, 25 to 31 Expert.

## ENTRIES AND DAYS

The engine counts entries from 0. The digest prints EKENE-3 by DAY (day 1 is
entry 0) and EKENE-7 by ENTRY. Section 11 shows a reason string that says
"entry 67" for day 68: say which you mean every time.

## QUOTING A FLAG: THE FIELD, NEVER THE REASON STRING

Every flag carries its figures twice: as numeric fields (`value`, `previous`,
`drop`, `statistic`, `limit`, `threshold`, `allowed` and the rest) and inside a
`reason` sentence. The reason prints each figure as the shortest decimal that
reads back to its field, so a computed statistic prints every digit (section
31 shows "z = 2.9999999999999996" beside its field, 3.000000). THE RULE:
a lesson quotes the NUMERIC FIELD at the digest's precision, six decimals, as
the digest prints it. A reason string may appear only verbatim, in quotation
marks or a blockquote, as the engine's own words, and never as the source of a
figure the lesson then reasons with. Section 11 shows the pattern: the drop is
7496.700000 from the `drop` field.

HOW THE GATE KNOWS. `numsweep_dataqc.mjs` exempts a quoted span only when its
text is EXACTLY a reason or message the digest prints: double quotation marks on
one line, or a `> ` blockquote line. A quote that differs by one character is
swept like any other text, and any figure of more than fifteen significant
figures outside such a quote fails as FLOAT NOISE even where the truth file
would resolve it.

## THE REFUSALS, BY NAME

Digest section 4 tables 23 refusals across 20 functions. **Quote the engine's
message in a blockquote.** The ones each tier must teach:

* Associate m01 l05: an infinite value, an empty series, an unlisted unit.
* Associate m02: the splice index refused by coverage.
* Professional m02 l05: a MAD of zero.
* Professional m05: too few rows, and a singular covariance.
* Expert m01: a gap in a chart series. Expert m02 l02: no target. Expert m03
  l02: no units for k and h. Expert m04: a weight missing.

## SIX SENTENCES THE DIGEST WILL LET YOU WRITE, AND THEIR FIGURES

1. **The sentinel, section 3.** EKENE-7's gamma ray with -999.25 in place reads
   a completeness of 1.000000 and 4 range failures; converted to null it reads
   0.983333 and 0.
2. **A step too long, section 6.** At a half-foot maxStep the gamma ray covers
   0.991304 of the interval, with one hole from 8474.500000 to 8475.500000 ft
   where the index skips a sample.
3. **The reporting tolerance, section 12.** At the default 1e-6 the water cut
   check fails 83 days; at one unit in the fourth decimal it fails 6, the
   planted ones.
4. **The ceiling, section 17.** At ten readings the largest possible |z| is
   2.846050, and the gauge glitch reaches 2.845783; its modified z-score is
   186.162000 (section 18).
5. **Local against global, section 21.** The gamma ray spike at entry 70 reads
   z 1.058062 and the Hampel window flags it.
6. **Which chart sees what, section 28.** From day 16 the individuals chart
   signals low on 1 day, EWMA on 11 and CUSUM on 20.

## THE DECLARED CHOICES

Every tier names the engine's choices as choices, in the digest's words:
missing is null, undefined or NaN; limits are definitional and units are never
converted; strictly beyond; the last present value; the Petrolord defaults in
section 30; the sample standard deviation and its ceiling; target and sigma
from history; no reset; no grade bands. Say what the alternative is and why the
engine did not take it.

## THE VOCABULARY

Binding. Digest section 32: "outlier" names its rule; "sigma" names its source;
a control limit is never a specification; missing is null, undefined or NaN;
no P label. No method in this course is called artificial intelligence or
machine learning.

## NO HISTORY

The course teaches none. The engine had one repair before any lesson was
written, and it is provenance. A sentence that begins "the engine used to" is a
defect anywhere in these 78 lessons. The NIST errata (section 31) are about a
published page.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive. Headings included.

## WHAT GATES YOUR WORK

`gate_copy_rule.py` over every lesson body and manifest title;
`gate_vocabulary.py` for the legislated words; the kit's `leakage.mjs` for
graded answers and cross-tier reaches; `numsweep_dataqc.mjs` (the kit's
`numsweep.mjs` against `truth-dataqc.json`, the harvest of the digest, with the
reason-quote rule above) and the kit's `litsweep.py` for literals that resolve
against nothing; `lengths.py --tier <tier>` for the prose-word band;
`gate_capstone_leak.mjs`
for any capstone field name, series, stated input or answer; and
`gate_claims.mjs` for every number in every brief. Read the counts rather than
the exit code.
