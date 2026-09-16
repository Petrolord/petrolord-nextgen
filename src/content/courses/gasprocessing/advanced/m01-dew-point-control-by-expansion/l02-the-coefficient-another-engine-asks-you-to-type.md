# The coefficient another engine asks you to type

The Joule-Thomson coefficient, and the product of it with a pressure drop, belong to the Production module Flow Assurance course, which owns them over a whole module. This lesson does not re-derive either of them. It answers a different question, which no other course in the catalogue can answer.

{{panel:fc-coldend-explorer}}

## The seam

The flowline thermal engine takes a Joule-Thomson coefficient as a typed input from its caller and never forms one. This is the only engine in the package that computes one. So a learner standing in front of that flowline input box has to get a number from somewhere, and this section is where it comes from.

That makes Gas Processing the course that tells you what to type into another app.

## The number, at a state

On AGBADA at 1180.000000 psia and 96.000000 degF, with a gravity of 0.680000 and a heat capacity of 9.800000 Btu per lbmol per degF, the coefficient is 0.061607962 degF per psi. In the unit a field engineer quotes, that is 6.160796 degF per 100 psi.

## Which of the three you type

A coefficient is a slope, so it changes as the pressure walks down. The march across a finite let-down reports three of them and they are three different numbers. On the same stream from 1180.000000 psia to 640.000000 psia the inlet coefficient is 0.061607962, the coefficient at the last half step is 0.071833233, and the mean the cooling actually delivered is 0.067252747.

The inlet coefficient is 0.916066108 times the mean. So an inlet coefficient printed beside a marched arrival temperature is not the number the answer was built from, and quoting it there understates the slope the march used.

The mean is the cooling over the pressure drop. That is the one that belongs beside an arrival temperature, and it is the one to carry across to a caller that multiplies a coefficient by a pressure drop.

## Why one number cannot cover a let-down

The reason the three differ is that the coefficient is a property of a state rather than of a stream. Every step down the pressure ladder is a slightly different gas, and the slope it offers is a slightly different slope. A single typed coefficient is therefore a screening figure by construction, and it is honest only over an interval narrow enough that the slope has not moved much across it.

A flowline model cannot check that for you, because it was handed the number rather than forming it. The check has to happen on this side of the seam.

## What travels with it

A coefficient alone is not portable. It was formed at a state, from a gravity and a heat capacity, over a pressure interval. Hand it on with those and the receiving engine can at least tell whether its own conditions are close.

## Exercise

Record the coefficient at the AGBADA inlet in degF per psi and in degF per 100 psi. Then record the three coefficients the march reports across the let-down to 640.000000 psia, and the figure the digest prints for the inlet against the mean. Say which of the three you would type into a flowline thermal model and what else you would have to state alongside it.
