# When there is no answer

Three ways the problem has no solution, and what each one means.

{{panel:hy-cleaning-explorer}}

## One: the target is unreachable

The solver returns null. No flow rate up to its maximum reaches the target transport ratio.

That happens with a wide annulus, a thin mud and a high target. It is a statement that the annulus geometry cannot deliver that cleaning standard with that mud, whatever the pump does.

The response is a different mud, a smaller annulus, or a lower standard.

## Two: the pump cannot supply it

The flow rate exists and the pressure it needs is beyond the rig.

This is the common one. It is not a modelling failure: the solver returns a perfectly good flow rate and it is not achievable.

The response is a string with a bigger bore, larger nozzles, a thinner mud, or a bigger pump.

## Three: the formation cannot take it

The flow rate exists, the pump can supply it, and the equivalent circulating density it produces exceeds the fracture gradient.

This is the serious one, because the alternatives are all expensive: managed pressure drilling, a different hole size, a casing point moved, or a lower cleaning standard accepted with the risk that goes with it.

## Why the third is different in kind

Because the first two are engineering problems with equipment answers and the third is a rock problem.

You can buy a bigger pump. You cannot buy a higher fracture gradient.

## What a narrow window looks like

Pore pressure and fracture pressure close together, so the mud weight has almost no room, and the equivalent circulating density uplift eats what room there is.

On a well where the window is 60 kg/m3 wide and the circulating uplift is 58 kg/m3, circulating at all takes the well to the fracture gradient.

That is a real situation on depleted reservoirs and in deep water, and it is what managed pressure drilling exists for.

## The honest answer when there is none

Say so. A hydraulics report that produces a flow rate for a well where no flow rate works has hidden the finding.

The right output is the three constraints, the range each one allows, and the statement that they do not overlap.

## Exercise

Construct a case where the three constraints do not overlap: pick a target transport ratio, find the rate, and pick a pump limit and a fracture gradient that both fail.

Then say which of the four responses in this lesson you would try first, and why.
