# A source with no emission passed

The curve checks a claim against the emission it is given for that claim's source. When no emission is given, there is nothing to check. SECTION 21 prints that case on the invented AGBOR records, and this lesson reads it by the rule SECTION 21 prints for it.

{{panel:carbon-abatement-explorer}}

## The same claim, the flare not passed

SECTION 21's third curve keeps Flare gas recovery's claim at 9400 t a year, and this time the flare's emission is not passed to the curve:

| curve | total abatement t | target t | meetsTarget | targetBasis | over-claims |
| --- | --- | --- | --- | --- | --- |
| flare gas recovery claiming 9400 t | 18660.000 | 16830.083 | none | not assessed: claims exceed what a source emits | flare: claimed 9400.000 against 7562.133 emitted |
| the same claim, the flare's emission not passed | 18660.000 | 16830.083 | none | not assessed: no computed emission to check the claims on steam, flare, power, vents | none |

The claim is the same and the total is the same, 18660.000 t. With the flare's 7562.133 tCO2e passed, the over-claim is found and named. Without it, the over-claims column reads none.

## What that none means

SECTION 21 states the rule in one sentence: "Where a claim acts on a source whose emission is not passed, it cannot be checked, the verdict is none and the basis names the source." The none in the over-claims column says only that nothing was found. The verdict on the third row is none too, and its targetBasis names the flare among the sources whose claims could not be checked. That none in the over-claims column is no finding that the claim fits.

## Every source the curve is not given

SECTION 21 passes two sources to the curve: heaters, 34927.743 tCO2e, and flare, 7562.133 tCO2e. The acts-on column of SECTION 18 names three more: steam, power and vents. The engine lists the unchecked claims of the first row, the six measures as costed:

| measure | source | reason |
| --- | --- | --- |
| Repair failed steam traps | steam | no emission was given for the source |
| Solar for purchased power | power | no emission was given for the source |
| Vapour recovery on the storage tanks | vents | no emission was given for the source |

uncheckedSources is steam, power, vents, and the first row's targetBasis reads "not assessed: no computed emission to check the claims on steam, power, vents".

SECTION 21 then passes every source the inventory computes: power, 10988.000 tCO2e, and vents, 2622.400 tCO2e, join heaters and flare. The verdict is still none, with the basis "not assessed: no computed emission to check the claims on steam". The digest gives the reason: the Agbor inventory has no line of its own for steam.

## What the two rows share, and what they do not

Read the second and third rows as a pair. They share the claim, 9400 t, the total, 18660.000 t, the target, 16830.083 t, and a verdict of none. They differ in one input, whether the flare's emission reached the curve, and in the basis. With the emission passed, the claim is checked and named as an over-claim. Without it, the claim is unchecked, and the basis names the flare.

An empty over-claims column is therefore read with the source ids beside it. It speaks only for the sources that were passed.

## Exercise

Read the second and third SECTION 21 curves, the two source ids passed, the engine's list of unchecked claims and the curve with every computed source passed. Say which claims the curve checked on each, what each targetBasis names, and why steam stays unchecked when every source the inventory computes is passed.
