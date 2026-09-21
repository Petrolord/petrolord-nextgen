# Two fields answering two questions

{{panel:fc-inhibitor-integrity-explorer}}

The remaining-life door returns `requiredAllowanceMm` and a shortfall side by side, and they read like a quantity and its gap. They are two answers to two questions, and the way to keep them apart is to know precisely what each one is compared against.

## The definitions, stated flatly

`requiredAllowanceMm` is the rate times the design life. Nothing else is in it. It does not know the allowance the line has, and it does not know what has been consumed.

The shortfall compares that required allowance against what is left, which means it does know the consumed depth. So one field is a property of the rate and the design life alone, and the other is a property of the whole case.

The worked example makes the arithmetic visible. At a stated 0.250000 mm/yr, a 4 mm allowance, 1.2 mm gone and a 20 year design life: `requiredAllowanceMm` is 5.000000 mm, the remaining allowance is 2.800000 mm and the shortfall is 2.200000 mm. None of those three is the allowance a reinstatement would have to specify, which is the point of keeping them apart.

## Reading the teaching streams

The lab's teaching streams show the same distinction on the five that return a life. Etelebou runs at 1.676428 mm/yr with 2.775000 mm remaining, so `requiredAllowanceMm` is 33.528563 mm and the shortfall is 30.753563 mm. Tunu runs at 17.138674 mm/yr, so the required allowance is 342.773473 mm against a shortfall of 339.998473 mm.

Opukushi is the instructive one. At 0.076842 mm/yr the required allowance is 1.536848 mm and the shortfall is 0.000000 mm, because the remaining allowance covers it and `meetsDesignLife` is true. Angiama sits the same way at 0.014444 mm/yr, with 0.288877 mm required and a shortfall of 0.000000 mm. A shortfall of zero is a pass on this comparison and it is silent about everything else.

## How to tell two fields apart in general

The technique generalises well beyond this door, and it is worth practising here because the cost is low. Do not read the field name and do not read the comment above the function. Vary one input and watch which fields move.

Set the consumed depth to zero and `requiredAllowanceMm` stays exactly where it was while the shortfall changes on any case that was short. That single sweep separates the two definitively, and it takes one run. Do it again with the design life left out and `requiredAllowanceMm` comes back null while the remaining years still arrive, which tells you which of the two the design life belongs to.

The habit behind that is the general lesson of this tier. Read what a function returns rather than what its name suggests it returns, and find out by moving an input rather than by reasoning about the label.

## Exercise

Take one stream and record its rate, allowance, consumed depth, remaining allowance, required allowance and shortfall. Then set the consumed depth to zero and record all six again. Say which fields moved, which did not, and what each one is therefore a function of.
