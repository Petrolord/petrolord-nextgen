# What the model warns about

Three messages, and what each one means.

{{panel:hy-cleaning-explorer}}

## "Hole geometry does not cover the full string"

The string extends into a depth range the geometry list does not describe. Those annulus spans are SKIPPED entirely.

Not treated as zero-friction: skipped, so their length contributes nothing to the annulus loss at all.

**What it means.** The annulus loss and the equivalent circulating density are both understated, and by an unknown amount. It is a setup error and the run is not usable.

## A low transport ratio

The engine flags the worst transport ratio. Below about 0.5 the cuttings are travelling at less than half the mud's speed.

**What it means.** The annulus is filling faster than it is emptying, at the assumed rate of penetration. The concentration will keep rising until something changes.

**What it does not mean.** That the hole is dirty right now. It is a rate statement rather than a state statement.

## A high cuttings concentration

Above a few percent by volume the annulus contains enough rock that its bulk density is noticeably above the mud's, and the risk of bridging rises.

**What it means.** The equivalent circulating density is higher than the pressure calculation says, by roughly 11.6 kg/m3 per percent on this mud, and a pack-off is more likely.

## What the model does NOT warn about

**A pack-off**, because it has no mechanism for one.

**Losses**, because it has no fracture gradient.

**A kick**, because it has no pore pressure.

All three of those need a limit the model was not given. The engine computes pressures and the comparison against limits is the user's.

## The general shape of it

This engine is a calculator with a small number of internal consistency checks. It is not a monitoring system and it does not know what a safe answer is.

That is the right division: the limits belong to the well and the calculation belongs to the software, and a tool that hard-coded a fracture gradient would be worse than one that asks for it.

## The one warning that is a real finding

The geometry coverage warning, because it means an input is incomplete and the answer is wrong rather than merely unqualified.

The other two are statements about the result, and both need a threshold the user supplies.

## Exercise

Set up a case where the geometry does not cover the string and read what the engine returns.

Then say how you would detect the same problem from the output if the warning did not exist.
