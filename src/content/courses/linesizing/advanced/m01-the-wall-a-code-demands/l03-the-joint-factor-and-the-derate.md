# The joint factor and the derate

Two more factors sit in the denominator beside the design factor, and neither of them is strength. One is confidence in the seam. The other is confidence in the steel when it is hot.

{{panel:fc-wall-pig-explorer}}

## One at a time, at Class 1

| joint factor | pressure wall in | temperature derate | pressure wall in |
| --- | --- | --- | --- |
| 0.600000 | 0.340545 | 0.867000 | 0.235671 |
| 0.800000 | 0.255409 | 0.900000 | 0.227030 |
| 1.000000 | 0.204327 | 0.967000 | 0.211300 |

Both columns run the same way. The factor falls, the wall thickens, because both of them divide.

## What each one is saying

The longitudinal joint factor is about the seam. A seamless pipe or a fully radiographed weld earns 1.000000 and the form leaves the wall alone. A seam the code credits less earns less, and the wall grows to cover what the seam is not being credited with holding.

The temperature derate is about the metal. Steel loses yield as it warms, so a line running hot is not structurally the same pipe that was rolled. A derate of 0.967000 says the code will credit 0.967000 of the specified minimum yield at the temperature this line runs at.

Neither factor changed the steel. Both changed what the code will credit the steel with, which is why both belong beside the design factor rather than beside the yield.

## The published case that carries one

B31.8 Class 4, 720.000000 psig on 6.625000 in at 35000.000000 psi, with a joint factor of 1.000000, a derate of 0.967000 and an allowance of 0.050000 in, gives a design factor of 0.400000 and a required wall of 0.2261707785 in. The rating reads back 720.000000 psig.

Three of the code's levers are in play on that one row: the class, the derate and the allowance.

## Neither may be zero

A joint factor of zero and a derate of zero are both refused, in words: "the longitudinal joint factor must be greater than 0 and at most 1" and "the temperature derating factor must be greater than 0 and at most 1". A zero in that denominator leaves no wall to return at all, so the engine declines rather than answering.

The same messages bound the other end at 1.000000, which is the code crediting the full yield and the perfect seam. Nothing above that is available to be credited.

## The mistake

The mistake is leaving both at 1.000000 because the form still runs. They default to the most generous reading available, a perfect seam in cold steel, and nothing in the returned wall records that the assumption was made.

The second mistake is treating the derate as margin to be spent. It is a correction for a temperature the line will actually run at, so removing it on a hot line does not recover margin. It removes a correction.

## Exercise

Give the pressure wall at joint factors of 0.600000 and 1.000000 and at derates of 0.867000 and 0.967000, and say why both columns thicken as the factor falls. Then state what each factor is confidence in, and give the two refusal messages the engine returns when either is set to zero.
