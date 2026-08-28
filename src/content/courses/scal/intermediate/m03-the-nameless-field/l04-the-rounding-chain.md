# The rounding chain

Lesson 3 rebuilt reservoir Pc from the J column as printed. This lesson runs the identical chain a second time, starting from the full-precision J column instead, and measures the gap between the two answers. The gap is small. It is also larger than the capstone tolerance, which makes it the sharpest lesson in the module: at grading precision, WHICH CHAIN YOU RAN is part of the answer.

## The two chains at Sw 0.2

Chain one, the book's: printed J of 0.169, times the reservoir factor.

$$0.169 \times 9.191758209219469 = 1.5534071373580902 \ \text{psi}$$

Chain two, full precision end to end: the engine's J of 0.16939891980544033, times the same factor.

$$0.16939891980544033 \times 9.191758209219469 = 1.5570739117545667 \ \text{psi}$$

The difference is 0.0037 psi, which is 0.24 percent of the value. The capstone field `res_pc_sw02` is graded at a tolerance of 0.002 psi against the PRINTED chain, so the full-precision answer, correct arithmetic on correct inputs, FAILS the field. That is by design, and the design is teaching you something real: a published table is a specific computational object, and reproducing it means reproducing its inputs, rounding included.

## The gap is not even one-directional

Run both chains at every saturation and compare:

| $S_w$ | printed chain (psi) | full chain (psi) | full minus printed |
|---|---|---|---|
| 0.2 | 1.5534071373580902 | 1.5570739117545667 | +0.0037 |
| 0.4 | 0.9375593373403855 | 0.93424434705274 | negative |
| 0.6 | 0.6709983492730213 | 0.6673173907519572 | negative |
| 0.8 | 0.5331219761347291 | 0.5338539126015657 | positive |
| 1.0 | 0.4412043940425345 | 0.44487826050130475 | positive |

At 0.2 the print rounded J down (0.16939... to 0.169), so the printed chain runs low. At 0.6 the print rounded UP (0.07259... to 0.073), so the printed chain runs high. Rounding error has no preferred direction; it is a coin flip taken at the third decimal, and each row flips its own coin. Anyone who "corrects" a printed table by shifting it uniformly has misunderstood what rounding does.

## The general rule

A value derived from a printed number carries the print's rounding forever. It does not average out, it does not wash through, and no downstream precision can remove it. The full value can regenerate the print at any time; the print can never regenerate the full value. So the professional habit is one sentence long: EVERY derived number names its chain. "1.5534 psi, from the printed J column times 9.192" and "1.5571 psi, full precision end to end" are both defensible entries in a report. "About 1.55 psi" with no provenance is how two engineers end up defending two different numbers in the same meeting, each correctly.

The Material Balance course met the same rule from the other side, matching the engine against Ahmed's printed Fetkovich march: expect agreement to about one unit in the last printed place, and never assert tighter. Here you are on the producing end of that rule rather than the checking end.

## The misconception to avoid

The instinct that full precision is always the right answer. It is not. Full precision is the right answer to the question "what does the model give from these inputs". When the question is "reproduce Ahmed's Example 4-7", the printed intermediates ARE the inputs, and gold-plating them with recovered digits changes the question you are answering. Precision is not a virtue in itself; it is a claim about provenance, and the claim has to be true.

## Worked example: predicting the gap without running it

You can bound the chain gap before computing anything. The print holds three decimals, so the largest rounding in J is half a unit in the third place, 0.0005. Multiplied by the reservoir factor of about 9.19, that is at most about 0.0046 psi on any row. The observed gaps, 0.0037 psi at the worst, all sit inside that bound. This thirty-second estimate is worth doing whenever you inherit a printed table: it tells you in advance how much disagreement is explainable by rounding alone, so anything larger must be a real discrepancy.

## Exercise

First, compute the full-minus-printed gap at $S_w = 0.4$ from the two table values above, express it as a percentage of the printed-chain value, and state which way the print rounded J on that row.

Second, the capstone grades `j_at_sw02` at a tolerance of 0.0005 and `res_pc_sw02` at 0.002. Using the half-unit bound above, explain in two sentences why the printed 0.169 passes the first field while the full-precision chain fails the second: what is different about where the rounding sits in each case?
