# D5 Applied AI and Language Models: the lesson writer's task

Read `BRIEF.md` first. This file is the working instruction for the 78 lesson
bodies.

## WHERE YOUR NUMBERS COME FROM

`digest.txt` in this directory, and nowhere else. Every number in this task
file is quoted from it. The engine's FINDINGS record, the oracle, the library
pins, the fixture README and writer, and the engine's source comments are
PROVENANCE.

Quote a figure at the precision the digest prints it at. The digest header
declares it: every score, idf, weight, cosine, term contribution, average
length, metric and mean, F1, accuracy, fraction, agreement, kappa,
probability, Brier score and each of its terms, calibration error, log loss,
and bootstrap mean, bound, difference, share and standard error to SIX
decimals; counts, ranks, grades, lengths, seeds, replicates and bins as whole
numbers; the tie key at twelve significant digits where the tie rule is shown;
very small magnitudes in exponent form; an engine message verbatim, figures
and all.

## WHAT A LESSON IS

`structure.py` is the authority on the 18 module keys, the 78 lesson keys, the
titles, the `est_minutes` and the panel tags. It self-checks and reports zero
problems. Do not add, rename or reorder a lesson: change `structure.py` and
re-run it, then `scaffold.py`.

Each lesson carries between its own minimum and 560 PROSE WORDS: 420 at 12
minutes, 460 at 13, 500 at 14. Prose words is what `lengths.py` counts: front
matter, markdown table rows and `{{panel` lines are excluded, and headings are
counted. Run `python3 lengths.py --tier <tier>` on your own tier only.

Every stub `scaffold.py` wrote carries the lesson title as its H1 and one
`{{panel:...}}` line per panel tag. Keep both exactly (`scaffold.py --check`
reports any drift). An opening paragraph under the H1, then short `##`
sections ending in `## Exercise`. A small table, numbers first, and an
`## Exercise` that asks the learner to DO something in the panel with the
Ekene documents or their own, never to recall a number.

## THE TIER LINE, AND WHY IT IS HARD

Every tier's lessons may use a lower tier's methods. **No tier's lessons may use
a higher tier's.** An Associate lesson never shows an average precision, a MAP,
an nDCG, an exact match, an extraction outcome, system B's groundedness or a
bootstrap; a Professional lesson never shows a kappa, a Brier score, a
calibration table, the Murphy terms, the pooling runs or a size cap. The kit's
`leakage.mjs` judges a reach by which digest section owns the figure: sections
1 to 10 are Associate, 11 to 16 Professional, 17 to 23 Expert.

An Associate lesson may say that precision, recall, hit and MRR are the first
of several scores and that average precision is the Professional tier's
question; the Professional tier may name that two annotators disagree, and
kappa itself is Expert (section 17).

## IDS, RANKS, CUTOFFS AND SEEDS

A passage is named by its id (EKD-001 to EKD-060) and a query by its id (Q01 to
Q24) with its text in quotation marks. Ranks count from 1. Every retrieval
metric is quoted with its cutoff, its threshold and, for nDCG, its gain: the
teaching setting is k 5, grade 1 or more, linear gain. A bootstrap figure is
quoted WITH its seed, its replicate count and its level: the teaching bootstrap
is seed 7, 2000 replicates, level 0.95.

## QUOTING A RESULT: THE FIELD, NEVER THE MESSAGE

Every refusal, note and reason carries figures inside a sentence, printed as
the shortest decimal that reads back to the number. THE RULE: a lesson quotes a
NUMERIC FIELD at the digest's precision, as the digest prints it. A message, a
reason or a basis string may appear only verbatim, in double quotation marks, a
`> ` blockquote, a backtick span or a four-space indented block, exactly as the
digest prints it, and never as the source of a figure the lesson then reasons
with.

HOW THE GATE KNOWS. `numsweep_appliedai.mjs` exempts a quoted span only when
its text is EXACTLY a message or a basis the digest prints. A quote that
differs by one character is swept like any other text, and any figure of more
than fifteen significant figures outside such a quote fails as FLOAT NOISE
(the digest prints the extraction reason "64.7 differs from 64.6 by
0.10000000000000853, above the tolerance 0.05" verbatim; a lesson that needs
the difference says it is just over the tolerance and quotes the reason whole).

## THE REFUSALS, BY NAME

Digest section 3 tables 76 refusals across 16 functions. **Quote the engine's
message in a blockquote.** The ones each tier must teach:

* Associate m01 l05: no documents, a repeated passage id, a query that is not
  text, a method the engine does not offer.
* Associate m02 to m05: a stop list switch that is not true or false, a k
  outside 1 to 1000, a k1 below 0, a b outside 0 to 1, a corpus with no token.
* Professional m01 and m02: a passage ranked twice, a grade that is not a whole
  number from 0 to 10, a relevantGrade of 0, a gain or a noRelevant rule the
  engine does not offer, a judged query with no ranking.
* Professional m03 to m06: an answer that is not text, a field type the engine
  does not offer, a tolerance on a text field, a prediction for an unlabelled
  record, citations that are not a list, a numericRelTol of 1, two answers to
  one query, no seed, a level outside the four accepted.
* Expert m01 to m03: no ratings, rater lists of different lengths, weighted
  kappa on words with no label order, an outcome of 2, a probability above 1, a
  bin count outside 1 to 100, an eps passed to the machine learning engine.

**A result with a note is not a refusal.** Recall and average precision on Q24,
nDCG with an ideal DCG of 0, an answer with no checkable claim and kappa when
both raters used one label return null with the reason. Say "returned as null,
with the reason", never "refused".

## SIX SENTENCES THE DIGEST WILL LET YOU WRITE, AND THEIR FIGURES

1. **BM25 matches words and knows nothing of meaning, section 7.** For Q02 "initial oil rate of
   Ekene-3" BM25 ranks the drilling report EKD-043 first (5.129851) on the
   words rate and of, and the answering passage EKD-003 fourth (4.084216).
2. **Two scores that print alike are not a tie, section 8.** The near-tie
   passages both print 0.470004 at six decimals and differ by 1.28e-8, which
   the 12-digit key sees, so the engine ranks them by score.
3. **The threshold changes the winner, section 11.** At grade 1 system A's MAP
   is 0.600278 against system B's 0.593007; at grade 2 it is 0.750362 against
   0.771014.
4. **Grounded is not correct, section 15.** System B's Q05 date is supported by
   the passage it cites, which is about another well, and its short answer
   scores exact match 0.
5. **A small difference is not a finding, section 16.** The paired nDCG
   interval, seed 7 and 2000 replicates, runs from -0.068015 to 0.058726; the
   unpaired one is wider, from -0.133554 to 0.128297.
6. **The bin count moves MCE, section 18.** ECE is 0.209300 at 5, 10 and 15
   bins on the Ekene rows, because every bin is over-confident; MCE is
   0.660556, 0.723333 and 0.750000.

## THE DECLARED CHOICES

Every tier names the engine's choices as choices, in the digest's words (the
table is section 23): the tokeniser, the stop list off, scikit-learn's TF-IDF,
the Lucene BM25 idf with the (k1 + 1) numerator, a repeated query word counted
once, the 12-digit tie key, the grade 1 threshold, precision divided by k,
average precision divided by every relevant judged passage, the ideal DCG from
every judged grade, the no-relevant rule, SQuAD normalisation, cited and
retrieved support with numericRelTol 0, the bin-edge rule, ECE over non-empty
bins weighted by rows, and the bootstrap's quantile and labels. Say what the
alternative is and why the engine did not take it.

## HONESTY ABOUT THE SYNTHETIC DATA AND THE SYSTEMS

The Ekene documents are synthetic, and section 2 says so. The two systems'
answers are fixture text, written to carry the planted defects section 2
tables; a lesson that leans on a defect says it was planted. No lesson says a
real copilot produced them, and no lesson says any score here came from a
model.

## THE VOCABULARY

Binding. Digest section 24: "relevant" names its threshold; "hallucination" is
an unsupported claim with its reason; "grounded" is never true; "accuracy"
names its denominator; "score" is a BM25 score or a TF-IDF cosine and never a
probability; "AI" names the system being evaluated and never a method this
engine runs. No P label anywhere: a bootstrap bound is a parameter percentile.

## NO HISTORY

The course teaches none. A sentence that begins "the engine used to" is a
defect anywhere in these 78 lessons.

## THE COPY RULE

No em dashes, no en dashes, no "X, not Y" contrastive. Headings included. Never
cite a digest section number in learner-visible text: say "the course".

## WHAT GATES YOUR WORK

`gate_copy_rule.py` over every lesson body and manifest title;
`gate_vocabulary.py` for the legislated words; the kit's `leakage.mjs` for
graded answers and cross-tier reaches; `numsweep_appliedai.mjs` (the kit's
`numsweep.mjs` against `truth-appliedai.json`, the harvest of the digest, with
the quoting rule above) and the kit's `litsweep.py` for literals that resolve
against nothing; `lengths.py --tier <tier>` for the prose-word band;
`gate_capstone_leak.mjs` for any capstone name, id, query, answer or value; and
`gate_claims.mjs` for every number in every brief. Read the counts rather than
the exit code.
