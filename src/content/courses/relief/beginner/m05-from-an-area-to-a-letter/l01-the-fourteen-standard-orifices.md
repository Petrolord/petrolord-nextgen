# The fourteen standard orifices

{{panel:fc-sizing-explorer}}

A required area is a continuous number and a valve you can buy is not. The bridge between them is a published ladder of standard orifices, each with a letter and an area, and this engine carries fourteen of them.

## The ladder

| letter | area in2 | ratio to the one below |
| --- | --- | --- |
| D | 0.110000 | n/a |
| E | 0.196000 | 1.781818 |
| F | 0.307000 | 1.566327 |
| G | 0.503000 | 1.638436 |
| H | 0.785000 | 1.560636 |
| J | 1.287000 | 1.639490 |
| K | 1.838000 | 1.428127 |
| L | 2.853000 | 1.552231 |
| M | 3.600000 | 1.261830 |
| N | 4.340000 | 1.205556 |
| P | 6.380000 | 1.470046 |
| Q | 11.050000 | 1.731975 |
| R | 16.000000 | 1.447964 |
| T | 26.000000 | 1.625000 |

## The ladder is not geometric

That third column is the reason it is printed. A reader who assumes a constant step between orifices will be wrong, and the ratios say so: the smallest printed step is 1.205556 and the largest is 1.781818, and they do not move in any tidy direction as you go up the ladder. The engine computes each of those ratios from the two areas either side of it, which is why this course is allowed to quote them. They are comparisons the lab works out.

Notice also what the letters do. Between D and T the sequence skips I, O and S. Read the exported table and count: fourteen letters are printed across a span of seventeen. Why those three are absent is not a question the engine or the course answers, and this course does not invent a reason. The letters are a convention of the published table rather than anything the engine decided.

## The table is typed, a published input

This package cannot derive a single one of those fourteen areas. They are published figures, and no route anywhere in the module computes them from a geometry or a standard bore.

What the suite checks instead is the behaviour around the table: that the smallest orifice at or above a required area is the one returned, that a required area exactly equal to a listed area takes that orifice rather than the next one up, and that anything past the largest is refused rather than served. Behaviour is checkable where the numbers are not, and checking the behaviour is what makes the selection trustworthy even though the table is taken on authority.

Nothing graded in this course is an orifice letter or a margin. That is a deliberate consequence of the table being typed: a graded answer resting on a figure nobody in the package can derive would be grading a reader's copy of a standard rather than their understanding of a method.

## Where the letter sits in the chain

Every route in this tier ends at the same place. A load and a set of conditions give a required area, the required area is looked up in this ladder, and out comes a letter and the area actually purchased. The required area is the engineering. The letter is procurement.

## Exercise

Write down the largest and the smallest ratio in the third column and say what they prove about the ladder. Then state the three behaviours the suite checks around the table, and say why none of them needs the areas themselves to be derivable.
