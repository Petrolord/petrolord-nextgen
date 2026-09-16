# General Flow, and its iteration

General Flow reads 73861363.0502 scfd on the SOKU trunk, 1.117335 against Weymouth, and it is the only one of the four that returns a friction factor. On this trunk it settled on 0.0112132010.

{{panel:fc-gasline-explorer}}

## The form that has to be solved

The other three forms are evaluated. Their inputs go in and a rate comes out in one pass. General Flow cannot work that way, because the rate it is computing and the friction factor it needs depend on each other: the friction factor belongs to the flow, and the flow is what the friction factor is there to find. So the form is iterated until the two agree, and the friction factor it settled on is returned beside the rate rather than discarded.

That returned factor is the only statement any of these four forms makes about the surface of the pipe, and it is why a Weymouth answer cannot be asked what pipe it assumed.

## Why the other three cannot iterate

An iteration needs something to iterate about. The other three forms say nothing about the roughness of the pipe, so there is no friction factor inside them to refine and nothing for a rate to be reconciled against. General Flow is the only one of the four carrying a description of the pipe surface, and carrying it is exactly what obliges it to solve.

## Where it sits among the four

| form | rate scfd | against Weymouth |
| --- | --- | --- |
| weymouth | 66104956.1404 | 1.000000 |
| general | 73861363.0502 | 1.117335 |
| panhandleA | 86864172.0167 | 1.314034 |
| panhandleB | 88369202.2673 | 1.336801 |

General Flow is the second lowest of the four on this line, closer to Weymouth than to either Panhandle.

## The efficiency, and the published cases

| efficiency | rate scfd |
| --- | --- |
| 0.850000 | 62616519.4059 |
| 0.900000 | 66364215.5127 |
| 0.950000 | 70112523.9958 |
| 1.000000 | 73861363.0502 |

That column is not the efficiency times the rate at 1.000000. General Flow re-solves its friction factor at the rate it settles on, so at an efficiency of 0.850000 its rate is 0.847757431221 of the full one while the other three read exactly 0.850000.

| bore in | length miles | rise ft | engine scfd | golden scfd |
| --- | --- | --- | --- | --- |
| 12.000000 | 50.000000 | 0.000000 | 78870925.0881 | 78870158.2684 |
| 6.065000 | 10.000000 | 0.000000 | 29438691.4770 | 29439020.5777 |
| 16.000000 | 80.000000 | 0.000000 | 42244687.4717 | 42240040.1716 |
| 8.000000 | 25.000000 | 800.000000 | 40692276.6248 | 40691505.0476 |
| 8.000000 | 25.000000 | -800.000000 | 42552177.2793 | 42552833.2696 |

The engine value and the golden are printed side by side on all five cases, so an iterated form is checked case by case.

## Reading the friction factor it returns

The friction factor is a result rather than an input, so it is the one figure on a General Flow answer that can be checked against expectation. A value of 0.0112132010 on a 11.938000 in trunk is a report about the flow the form settled on, and quoting the rate while dropping it throws away the only self-description the answer had.

A reviewer who knows what a friction factor should look like on a trunk of this size can read 0.0112132010 and form a view at once, and no Weymouth or Panhandle answer offers that.

## The mistake

The mistake is treating the returned friction factor as an input that was supplied. It was solved for, and it moves when the line moves.

The second mistake is assuming the extra machinery makes General Flow the right answer. It is one of four, and it sits second lowest here.

## Exercise

Give the General Flow rate on the SOKU trunk, its position among the four, and the friction factor it settled on. Explain why this form has to iterate while the other three do not. Then say what the other three forms can and cannot tell you about the roughness of the pipe.
