# The twelve-digit tie key

{{panel:ae-trust-explorer}}

{{panel:ae-retrieval-explorer}}

The Associate tier taught the ranking rule: documents with a score above 0 ranked by score descending; scores that agree to 12 significant digits tie, and ties go to the document id ascending. This lesson looks at why the rule is written with a key, what the key sees and what it absorbs.

## What counts as a tie

Two scores tie when they agree to 12 significant digits, compared as Number(score.toPrecision(12)).

The course stated three passages to probe the key: n2 "oil water", n1 "oil water gas" and n3 "gas", scored by BM25 for "oil" with b = 1e-7, so that length barely matters:

| rank | passage | length | tie key, 12 significant digits |
| --- | --- | --- | --- |
| 1 | n2 | 2 | 0.470003629246 |
| 2 | n1 | 3 | 0.470003616427 |

At six decimals both scores print 0.470004. They are not equal. The two scores differ by 1.28e-8, which the 12-digit key sees, so there is no tie and n2 ranks above n1 on its score. With ids alone n1 would come first.

## What the key absorbs

A score is a sum of floating-point terms. Two passages with the same text can land a few bits apart when their terms are added in a different order, and a difference in the last bits of a double is no difference in the inputs. The key absorbs that: it rounds away the last few digits, so two such scores share a key and tie. A difference the key sees is a real difference in the inputs.

The exact duplicate in the corpus shows the rule working. EKD-058 is an exact copy of EKD-046, a spill note filed twice. On Q10, "diesel spill during bunkering", both score 13.884966 by BM25 and 0.464024 by TF-IDF, the engine reports the tie as [["EKD-046","EKD-058"]], and the id ascending puts EKD-046 first.

## Why the rule uses a key

A key is transitive: two scores with the same key tie, full stop. A relative tolerance is not: a can be near b and b near c while a is not near c, which breaks a sort.

## A tie at the cutoff

When the cut at k falls inside a tie, the id alone decides which passage stays in. The engine flags it with `tieAtCutoff`. Q10 at k 1 keeps EKD-046 and drops its twin, with tieAtCutoff true. Across the 24 queries at k 5, BM25 reports a tie at the cutoff on Q01, Q06, Q17 and Q22, and TF-IDF on Q22. Q06 by BM25 ties four passages, EKD-001, EKD-003, EKD-005 and EKD-006. A metric at a cutoff that falls inside a tie depends on the id order of the tied passages, so the flag belongs beside any figure computed there.

## Exercise

Open the retrieval explorer on "BM25, read term by term". Type the three passages n2 "oil water", n1 "oil water gas" and n3 "gas", the query oil, and b 1e-7. The panel prints scores at six decimals, so both read 0.470004: note their order and that no tied group is reported. Set b to 0 and read them again: say whether the panel now reports a tied group and which id comes first. Then set k to 1 and read the tie-at-cutoff tile. Explain each result from the 12-digit key.
