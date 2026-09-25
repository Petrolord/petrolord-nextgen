# D5 Applied AI and Language Models: the key-truth writer's task

Read `BRIEF.md` first. Every number here is quoted from `digest.txt`, the only
teaching truth for this course. The engine's FINDINGS record, the oracle, the
library pins, the fixture README and writer, and the engine's source comments
are PROVENANCE.

## TWO JOBS

1. **The key truths.** One sentence a learner should be able to say afterwards,
   with the number that makes it checkable.
2. **The second reader of every bank, before `gen_migration.py`.** Read prompt,
   options, explanation, digest and lesson for every question, one tier at a
   time, and CALL THE ENGINE (through the lab or the panel, or node on the
   vendored `packages/engines/engines/dataai/evaluate.js`) for every keyed
   figure. Swap roles where the explanation supports a distractor.

## THE DEFECT CLASSES TO READ FOR, from the FC, H, D1 to D4 audits

1. **A distractor that became true.** The engine returns the distractor's
   number under some stated setting the question did not rule out (another
   cutoff, another threshold, another gain, the stop list on, sublinear tf,
   another k1 or b, the retrieved lists ignored, a numericRelTol above 0,
   another seed, replicate count or level, unpaired, another bin count).
2. **A wrong failure-mode gloss.** "Refused" said of a metric the engine
   returns as null with its reason (recall and AP on a query with no relevant
   passage, nDCG with an ideal DCG of 0, kappa when both raters used one
   label); "hallucination" said of a claim that is supported; "grounded" said
   to mean correct.
3. **A false superlative.** "the better system", "always", "never" where the
   digest shows one set of queries at one setting. The MAP order of the two
   systems reverses with the threshold.
4. **An exam question that near-duplicates a module question** (audit at
   Jaccard 0.45).
5. **A sentence characterising a relationship nobody computed.** Every "worse",
   "more", "higher" rests on two printed figures.
6. **The answer printed before the work** in the prompt or a table above it.
7. **A capstone name, id, query, answer or value** in any prompt, option or
   explanation.
8. **The answer-length tell**, and the D1 tell: three distractors opening the
   same way while the key does not.
9. **Printed alike keyed as equal.** Two figures equal at six decimals are
   equal only where the digest says the engine returns them equal.
10. **A boundary stated globally.** Each rule draws its own (section 21): a
    grade equal to the threshold is relevant, a tolerance is inclusive, an
    interior edge opens the upper bin, a replicate exactly 0 counts as at or
    below 0, the bootstrap needs 2 values.
11. **A message quoted inexactly.** A refusal, a reason or a basis is quoted
    verbatim or not at all.
12. **A digest section number in learner-visible text.** Say "the course".
13. **A model credited with a score.** No score in this course comes from a
    language model; the engine runs none.

## THE KEY TRUTHS THIS COURSE OWES ITS LEARNERS

### Associate

1. A hyphen, a decimal point and a comma all split a token: the stated text
   "Ekene-3 flowed 1.25 MMscf/d; Top WELL at 1548 m TVD." gives 13 tokens, and
   the stop list removes 3 of them.
2. The smoothed TF-IDF idf never reaches 0: oil in 2 of the 5 hand-set passages
   has idf 1.693147.
3. A BM25 score is the sum of its terms: d1 scores 2.191027 for "oil rate", and
   1.750937 at k1 = 0, where each matched term scores its idf.
4. BM25 matches words: for Q02 the drilling report EKD-043 ranks first at
   5.129851 and the answering passage EKD-003 fourth at 4.084216.
5. Identical text ties and the id decides: EKD-046 and EKD-058 both score
   13.884966 for Q10 and EKD-046 ranks first.
6. Precision at 5 divides by 5: Q10 has 2 passages ranked and precision
   0.400000.
7. An unsupported claim names where its figure is: system A supports 47 of 49
   claims, 0.959184, and its Q06 oil column is in EKD-007, neither cited nor
   retrieved.

### Professional

8. Average precision divides by every relevant judged passage: the stated
   ranking scores 0.400000.
9. A query nothing answers is excluded and listed: scoring Q24 as 0 lowers
   system A's MAP to 0.575266.
10. The threshold changes the winner: MAP 0.600278 against 0.593007 at grade 1,
    0.750362 against 0.771014 at grade 2.
11. The ideal ranking counts passages nobody retrieved: the stated ranking's
    nDCG is 0.551774 linear and 0.563164 exponential.
12. SQuAD matching is strict: system A matches 20 of 24 short answers exactly,
    and its "45 percent" scores F1 0.500000 against "45.0 percent".
13. Accuracy counts empty cells: system A's micro accuracy is 0.972222, and 73
    of its 175 correct cells are correct because both sides are empty.
14. Grounded is not correct: system B supports 30 of 41 claims, 0.731707, and
    its Q05 date is supported and wrong.
15. A difference inside its interval is not a finding: the paired nDCG interval
    runs from -0.068015 to 0.058726 on seed 7 and 2000 replicates.

### Expert

16. Kappa rescales agreement by chance: observed 0.721311 against expected
    0.336708 gives 0.579841; linear weights give 0.675940 and quadratic
    0.771549.
17. ECE averages, MCE finds the worst bin: the Ekene rows score Brier 0.168382,
    ECE 0.209300 and MCE 0.723333.
18. The Murphy identity closes only with the within-bin terms: the closure is
    -8.33e-17, and the three classic terms alone give 0.169362.
19. The bin-edge rule is a choice: REL is 0.080032 by the engine's rule and
    0.078849 by the library's.
20. Unjudged is not irrelevant: BM25 at k 10 retrieves 80 unjudged passages,
    each scored as grade 0.
21. Annotators can outweigh a system difference: on the second annotator's
    grades system A leads on mean nDCG, 0.718064 against 0.701037.
22. A leaked key scores perfectly: each reference answer against itself is an
    exact match on all 24 queries.
23. A bootstrap bound is a parameter percentile: at level 0.95 the labels read
    "2.5th percentile of the bootstrap mean" and "97.5th percentile of the
    bootstrap mean".

## THE RULES

Digest section 24's vocabulary is binding. No em dashes, no en dashes, no "X,
not Y" contrastive. No key truth may carry a capstone name, id, query, answer,
stated seed or graded answer at any precision.
