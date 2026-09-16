# The trim shortfall, ideal beside real

Cutting an impeller down is the other way to move a pump curve, and the affinity laws do not describe it. The engine returns what the laws would have given and what it actually gives, on the same row, so that neither can be quoted as the other.

{{panel:fc-suction-explorer}}

## A trim on the OKONO duty

| trim ratio | trim percent | ideal flow gpm | real flow gpm | ideal head ft | real head ft | shortfall percent | brake hp | warning |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1.000000 | 0.000000 | 1234.452969 | 1234.452969 | 417.801018 | 417.801018 | 0.000000 | 183.041884 | null |
| 0.980000 | 2.000000 | 1209.763910 | 1209.763910 | 401.256098 | 401.256098 | 0.000000 | 172.277556 | null |
| 0.950000 | 5.000000 | 1172.730321 | 1172.730321 | 377.065419 | 377.065419 | 0.000000 | 156.935535 | null |
| 0.920000 | 8.000000 | 1135.696732 | 1125.475461 | 353.626782 | 347.261500 | 1.800000 | 142.532518 | null |
| 0.880000 | 12.000000 | 1086.318613 | 1063.505922 | 323.545108 | 309.956214 | 4.200000 | 124.737918 | null |
| 0.840000 | 16.000000 | 1036.940494 | 1002.721458 | 294.800398 | 275.343572 | 6.600000 | 108.489657 | null |
| 0.800000 | 20.000000 | 987.562375 | 943.122068 | 267.392652 | 243.327313 | 9.000000 | 93.717444 | null |
| 0.760000 | 24.000000 | 938.184257 | 884.707754 | 241.321868 | 213.811175 | 11.400000 | 80.350994 | set |
| 0.700000 | 30.000000 | 864.117078 | 812.270054 | 204.722499 | 180.155799 | 12.000000 | 62.783366 | set |

The ideal columns are the affinity laws applied to a diameter ratio. The real columns are those figures de-rated by a shortfall. On the first three rows they agree, and from a trim percent of 8.000000 onward they do not.

## What the shortfall model is

It is zero at or under five percent of trim, then 0.006 per further percent, capped at 0.12, and it is applied whole to the head and half to the flow.

That is the whole model, and it is held for the literature. The engine's comment calls it "the published shortfall" and names no publication, so no graded value in this course is a trimmed flow, head or shortfall. The speed law is on a different footing: it is the affinity law and it is exact.

## Why both columns are returned

A single de-rated answer would carry no evidence of the de-rating. Returning both puts the model on the page: a reader can see which rows the shortfall touched, how far it moved them, and that the first three rows were untouched because the trim sat inside the range the model leaves alone.

It also keeps the two mechanisms apart. The ideal column is the affinity laws, which are exact. The real column is those laws plus an unsourced correction. Printing them together is the difference between a result and a result with its provenance attached.

## The warning, and where it starts

At a trim ratio of 0.799900 the engine says:

"a 20.0 percent trim is beyond what most casings tolerate: efficiency falls away and the vendor limit usually sits near 20 percent"

At a trim ratio of 0.550000 it says the same thing about a 45.0 percent trim.

At a trim ratio of 0.800000, a trim percent of 20.000000, the warning is null. The threshold is exclusive, so the vendor limit itself does not warn.

## The mistake

The mistake is taking an ideal column for an answer. At a trim ratio of 0.840000 the ideal flow is 1036.940494 gpm and the real flow is 1002.721458 gpm, and the ideal figure is on the return so a reader can see the size of the de-rating. Quoting it as the trimmed duty reports a machine that was never modelled.

The second mistake is the reverse, assuming a trim behaves like a speed change because both are ratios on a curve. A speed ratio of 0.800000 gives 987.562375 gpm and a trim ratio of 0.800000 gives a real flow of 943.122068 gpm. Different changes to different hardware.

## Exercise

Give the ideal and real flow and head at trim ratios of 0.920000 and 0.700000 with the shortfall percent on each row. Then state the trim percent at which the warning first appears, quote it, and say why a trimmed head is not a graded answer in this course.
