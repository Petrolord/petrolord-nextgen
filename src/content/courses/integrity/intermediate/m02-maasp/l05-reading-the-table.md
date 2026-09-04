# Reading the table

Four things in order, and the number you were asked for is not the first of them.

{{panel:wi-annulus-explorer}}

## First, the governing name

Before the value, read which element governs. The name tells you what would fail, where it is and what kind of failure it would be, and that is the part of the answer an operator can act on.

On the published annulus it is the 4-1/2 tubing collapse. The limit is set by an inner string being squeezed, not by a casing being burst, so the mitigation is pressure inside the tubing rather than anything about the casing. Quote the number without the name and you have handed over a limit with no consequence attached.

## Second, the gap to the runner-up

The published governing row allows 11905664.170969129 Pa and the next strictest allows 17606905.05541501 Pa, a margin of 5701240.88444588 Pa.

That is a wide gap, and it means the identity of the governing element is robust. Small revisions to a rating, a depth or a backup density will move the number without changing who governs.

A narrow gap says the opposite. Two elements close together means your answer depends on which of two inputs you trust more, and it means a modest change of fluid can hand the limit to a different piece of hardware with a different failure mode.

## Third, the two terms inside the governing row

Split the row and see which half is doing the work. The governing row here is a factor of 0.75 on a 25000000 Pa collapse rating, at 997.0400302755012 m vertical with 500 kg/m3 on the far side.

The factor takes a quarter off the rating, and the standing columns then take away a large part of what is left, because the annulus fluid is heavy and the far side is light. On a row like that the fluids are as much of the answer as the pipe is.

## Fourth, the flag and the depths

Check whether `negative` is raised and whether the reported limit is zero, together. A zero with the flag is a design finding, not an operating limit.

Then check the depths are vertical. A measured depth in a deviated well's table overstates every head and understates every allowable, an error in the safe direction and therefore one nobody chases.

## Exercise

Read the published table and write the one line you would send to a supervisor: the governing element, the limit, and the margin to the next.

Then change the annulus fluid until a different element governs, and note the density at which the handover happens.
