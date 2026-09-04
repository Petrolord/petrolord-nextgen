# What throughput cannot tell you

Every charged valve on deepHighPressure passes its target and four of the six are open when the well is on production. Passing and closing are different questions and only one of them is a throughput.

{{panel:pd-valve-explorer}}

## Two columns that do not talk to each other

| deepHighPressure valve | Throughput, Mscf/d | Passes 250.0 Mscf/d | Shut at 1314.7 psia |
| --- | --- | --- | --- |
| 1 | 458.686749156 | true | true |
| 2 | 458.732684169 | true | true |
| 3 | 452.337571206 | true | false |
| 4 | 427.875440704 | true | false |
| 5 | 390.896868568 | true | false |
| 6 | 346.816063893 | true | false |

The pass column is a comparison against the design gas rate. The shut column comes from the dome, the temperature at depth and a gas column inverted to surface. They share the port size and nothing else, and a valve can be comfortable in one and wrong in the other.

## What it is not a measurement of

It is not a well rate. There is no inflow relation in this module and no multiphase outflow, so nothing here knows what the formation will give or what the tubing will carry. The flowing traverse is passed in from outside precisely so that the module does not have to invent one.

It is not a flowing casing pressure either. The annulus column is static: no friction, no velocity, no injection rate. The upstream pressure in the equation is a shut in gas column read at valve depth.

And it is an upper bound. The equation is an orifice, and a real valve throttles on its stem before it is fully open.

## The mistake

Opening the port up because a throughput looks tight. The port is not a free parameter: it sets R, which sets the dome the balance demands, which sets the closing pressure and the interval the valve stays open across. Take every valve of midDecrementKnifeEdge from a 0.25 in port to a 0.3125 in port and the stage 5 surface margin on valve 4 goes from 0.124769727 to 15.249903355 psi and the string gains a multipointing stage. The throughput column was improved. The design was changed.

## What to record instead

The rate, the regime and the differential it was computed at, together. A rate on its own cannot be checked by anyone, cannot be compared with another valve, and hides which branch of the equation produced it.

## Exercise

Record the throughput, the pass flag and the shut flag for every valve of deepHighPressure.

Then name the valve where the two flags first disagree, and say which of the two you would put in front of a reviewer first.
