# D5 Applied AI and Language Models: the bank writer's task

Read `BRIEF.md` and `LESSON_TASK.md` first. Every number in this file is quoted
from `digest.txt`, which is the only teaching truth for this course. The
engine's FINDINGS record, the oracle, the library pins, the fixture README and
writer, and the engine's source comments are PROVENANCE.

## THE SHAPE

132 questions a tier: 6 module banks of 15, plus a 42 question exam. Four
options each, one correct, and an explanation that says WHY the wrong ones are
wrong. Banks live in `banks/` as `d5<b|i|a>_<m01..m06|exam>.py` and `.json`.
**Every bank `.py` writes its JSON to a LITERAL path** in this directory
(`/root/dai-wip-appliedai/banks/d5b_m01.json`,
`/root/dai-wip-appliedai/banks/d5i_exam.json`,
`/root/dai-wip-appliedai/banks/d5a_m06.json` and so on, never a path built
from a variable), because the kit's check-bank-sources reads literal paths
only. `banks/` holds one stub per bank already, each writing to its literal
path; replace the stub's question list and keep its emit line.

## THE ANSWER-LENGTH DEFECT

A shipped bank was passable without reading the question, because the
second-longest option scored about four answers in five. **Balance the option
lengths.** The correct option must not be the longest and must not be the
second-longest more often than chance. `lengthtails.py` measures it. Lengthen
distractors; never edit the correct option to satisfy the gate.

## THE OPENING DEFECT

A D1 bank showed a new tell: all three distractors opening the same way while
the key did not. **Vary the openings** of every option, the key's included.

## NO KEY RESTS ON A MODEL

Every key is a return value of the engine on stated inputs, or a rule the
digest states. No question asks what a language model would answer, and no key
depends on one.

## WHAT MAKES A GOOD D5 QUESTION

The engine's own distinctions, all of them in the digest, and a good distractor
is a real wrong method with its real number:

1. **precision against recall.** The stated ranking c, a, x, b, d at k 5:
   precision 0.600000, recall 0.750000, reciprocal rank 0.500000.
2. **every relevant passage against the retrieved ones.** Its average precision
   is 0.400000; dividing by the 3 relevant passages retrieved would give
   0.533333, which the engine does not compute.
3. **the BM25 idf against the TF-IDF idf.** On the hand set, oil has TF-IDF idf
   1.693147 and BM25 idf 0.875469.
4. **a BM25 score against a cosine.** For "oil rate" on the hand set d1 scores
   2.191027 by BM25 and 0.715911 by TF-IDF cosine; at k1 = 0 its BM25 score is
   1.750937, the sum of its matched terms' idf.
5. **grade 1 against grade 2.** System A's MAP at 5 is 0.600278 at grade 1 and
   0.750362 at grade 2.
6. **linear against exponential gain.** System A's mean nDCG at 5 is 0.762753
   linear and 0.786456 exponential.
7. **MRR against MAP.** System B has the higher MRR (0.923913 against
   0.880435); system A has the higher MAP at grade 1.
8. **exact match against token F1.** System A's Q13 "45 percent" against the
   reference "45.0 percent": exact 0, F1 0.500000.
9. **accuracy against precision on filled cells.** System A's micro accuracy is
   0.972222 and its precision on filled cells 0.962264; its micro F1 is
   0.966825 and its macro F1 0.942735.
10. **pooled against per-answer groundedness.** System B's pooled supported
    fraction is 0.731707 and the mean of its per-answer fractions 0.687500.
11. **numericRelTol 0 against 0.002.** System B's pooled fraction rises from
    0.731707 to 0.756098 when a rounded figure may stand.
12. **paired against unpaired.** Seed 7, 2000 replicates: the paired nDCG
    interval is 0.126741 wide, the unpaired 0.261851.
13. **agreement against kappa.** The annotators agree on 0.721311 of the pairs;
    kappa is 0.579841 unweighted and 0.771549 quadratic.
14. **the engine's bin rule against the library's.** At 10 bins REL is 0.080032
    by the engine and 0.078849 by the library rule; ECE agrees on this set.
15. **with and without the within-bin terms.** The Brier score is 0.168382;
    REL - RES + UNC alone gives 0.169362.

## THE CAPSTONES ARE NOT YOURS

The three capstones live in `d5_capstone.mjs` and NOTHING ABOUT THEM IS IN
`digest.txt`: no name, no passage id, no query, no answer, no stated seed, no
graded value. A question that wants the capstone's subject teaches the METHOD
with the digest's own Ekene documents. `gate_capstone_leak.mjs --banks banks`
sweeps every prompt, option and explanation for every capstone name, id,
query, answer, probability run, seed and graded answer at four renderings.

## NO FORWARD REACH

An Associate question never needs an average precision, a MAP, an nDCG, an
exact match, an extraction outcome or a bootstrap; a Professional question
never needs a kappa, a Brier score, a calibration table, the Murphy terms, the
pooling runs or a size cap.

## PRINTED ALIKE IS NOT EQUAL

Two figures that agree at six decimals are never keyed as equal unless the
digest says the engine returns them equal. Section 8 shows the pattern: the two
near-tie scores both print 0.470004 and are not equal, and the engine does not
tie them. Section 14 is the other side: macro and micro accuracy print alike,
and the digest prints their difference and the reason they are equal by
construction before it calls them equal.

## THE VOCABULARY AND THE COPY RULE

Digest section 24 is binding on every prompt, option and explanation. No em
dashes, no en dashes, no "X, not Y" contrastive. When you quote an engine
message, quote it verbatim and say it is the engine's own words. Never cite a
digest section number in a question or an explanation.
