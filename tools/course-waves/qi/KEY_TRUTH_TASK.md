# QI Quantitative Interpretation: the key-truth auditor's task

Read `BRIEF.md` first. You are the SECOND READER of one tier's 132 questions
and 26 lessons, before the migrations. The kit README section 10 is why: a
bank can pass every structural gate and grade the wrong answer as right.

## THE JOB

For every question: read the prompt, the four options, the explanation, the
digest line the key should rest on and the lesson it examines, and CALL THE
ENGINE for every keyed figure (node through `/root/qi-wip-qi/qi_engine.mjs`,
which loads the teaching lab `qiLab.js` and the vendored engines, or the
tier's lab file). Never verify a figure by restating its formula: the call
must go through the shipped function. Swap roles where the explanation
supports a distractor. Fix banks only (the `.py` source, then re-run it so the
JSON is regenerated); list lesson defects for a separate pass.

Write your record to `/root/qi-wip-qi/AUDIT-<tier>.md`: for every question
its verdict, the digest line, and the engine call that confirmed the key.

## THE DEFECT CLASSES TO READ FOR

1. A distractor that became true under an input the question did not rule
   out (another taper, window, lag, selection, cut-off, block length, line,
   level or form).
2. A stated choice keyed as a fact about the field.
3. A wrong failure-mode gloss: "refused" said of a NaN result, or a result
   said of a refusal.
4. A false superlative ("always", "every well") where the digest shows one
   case.
5. An exam question that near-duplicates a module question (Jaccard 0.45 on
   prompt, key or explanation).
6. A sentence characterising a relationship nobody computed.
7. The answer printed before the work in the prompt.
8. A capstone name, input or value anywhere.
9. The answer-length tell, and three distractors opening alike.
10. Printed alike keyed as equal.
11. A message quoted inexactly.
12. A digest section number or the word "digest" in learner-visible text.
13. Repair history.
14. A video figure, or a kit truth-file figure, used as a key.
15. A sign stripped or invented.

## WHEN YOU ARE DONE

Re-run every bank you changed, `lengthtails.py`, `dupaxes.py` and
`bankleak.py`, and hand back: defects found and fixed per class, wrong keys
found (if any) with the engine call that settled each, lesson defects routed,
and the audit file path.
