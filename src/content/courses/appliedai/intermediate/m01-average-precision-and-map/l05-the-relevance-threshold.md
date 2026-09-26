# The relevance threshold

{{panel:ae-scoring-explorer}}

Every Ekene judgment is a grade on a four-grade scale: 3 answers the query, 2 relevant, 1 related, 0 judged not relevant. Average precision, precision, recall and MRR are binary scores. Before any of them is computed, each grade is turned into relevant or not relevant at a threshold, `relevantGrade`. The engine's default is 1, so a passage graded 1, related, counts as relevant. This lesson moves the threshold to 2 and shows that the winner moves with it.

## The same runs at two thresholds

At k 5, over the 23 included queries, with the same runs and the same judgments:

| mean at 5 | A, grade 1 | A, grade 2 | B, grade 1 | B, grade 2 |
| --- | --- | --- | --- | --- |
| queries in the means | 23 | 23 | 23 | 23 |
| precision | 0.443478 | 0.252174 | 0.434783 | 0.252174 |
| recall | 0.673188 | 0.869565 | 0.658696 | 0.833333 |
| MRR | 0.880435 | 0.840580 | 0.923913 | 0.873188 |
| MAP | 0.600278 | 0.750362 | 0.593007 | 0.771014 |
| nDCG | 0.762753 | 0.762753 | 0.764137 | 0.764137 |

At grade 1 system A has the higher MAP, 0.600278 against 0.593007. At grade 2 system B does, 0.771014 against 0.750362. Nothing about either system changed. The question changed: at grade 2 the score asks how well each system ranks the passages that answer or are relevant, and ignores the merely related ones.

## Why precision falls and recall rises

Raising the threshold removes relevant passages from both sides of the calculation. Fewer of the top 5 count as relevant, so precision at 5 falls for both systems. Fewer passages are relevant in the judgments too, so there are fewer to find, and recall rises for both. The course checked this direction for both systems. MAP rises for both on these runs, and it rises further for B, which is how the order of the two systems flips.

## nDCG does not move

The last row is identical in both columns. nDCG uses the grade itself as its gain, 3, 2, 1 or 0, and the threshold does not apply to it. A grade 1 passage still carries gain at `relevantGrade` 2. The next module builds nDCG, and this row is the first reason it exists: it scores the grades the judges gave, with no threshold to argue over.

## The threshold is stated with every figure

The course's word "relevant" always carries its threshold. A MAP quoted without one is two different numbers here, and a comparison quoted without one can name either system the winner. The default, grade 1, is trec_eval's default; state it anyway.

The threshold must be a whole grade from 1 to 10. A threshold of 0 would make every passage relevant, judged or not, and the engine refuses it:

> relevantGrade must be a whole number from 1 to 10

The judged grades themselves are checked the same way. A grade of 2.5, or of 11, is refused by name:

> judgments.EKD-018 must be a whole-number grade from 0 to 10

## Exercise

Open the view for MAP and nDCG with system A's runs, k 5, linear gain and relevant at grade 1, and read MAP and mean nDCG. Set relevant at grade 2 and read both again. Load system B's runs from the groundedness view and repeat both readings. Write two sentences, each stating k and the threshold: which system has the higher MAP at each threshold, and what happened to mean nDCG. Then set relevant at grade 0 and read the refusal.
