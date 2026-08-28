# When it does not collapse

The previous lesson showed the collapse working perfectly. This one breaks it on purpose, because the J-function's second job, after transferring curves between rocks, is diagnosis: a plug that refuses to join the cloud is telling you something specific, and the geometry of HOW it misses tells you what.

## An error that scales is an error you can read

Every quantity in the scaling enters $J$ as a clean multiplier:

$$J = 0.21645 \; \frac{P_c}{\sigma \cos\theta} \sqrt{\frac{k}{\phi}}$$

Mistype any one of $\sigma$, $\theta$, $k$ or $\phi$ and the plug's entire J curve moves by one constant factor at every saturation. It does not bend, it does not cross the others, it RIDES, parallel to the cloud on a log axis. That signature, a parallel offset with the shape intact, is the fingerprint of a scaling error as opposed to genuinely different pore geometry, which changes the shape itself.

## The classic: a permeability typo

{{panel:sc-jfunction-explorer}}

Take plug EK1-P, whose true permeability is 420 md, and suppose an analyst keys it in as 1680 md, a factor of four high. Rebuild the J table from the same lab pressures with the wrong k and compare against the correct curve in the panel: the bad curve rides exactly 2 times above the truth at every row.

The factor is exact and predictable because k enters under a square root:

$$\frac{J_{wrong}}{J_{true}} = \sqrt{\frac{k_{wrong}}{k_{true}}} = \sqrt{4} = 2$$

The engine's own test suite pins this case: a 4x permeability error rides 2.000000000 above the cloud. Run it in the panel and watch that the two curves never converge and never cross; the offset is saturation-independent.

The square root also sets the sensitivity budget. A 20 percent error in k moves J by about 10 percent; a factor-of-two error moves it 41 percent. Permeability is the input you know worst, often only to within a factor, and the square root is the only mercy you get.

## A porosity typo rides the other way

Suppose instead the porosity of EK1-P, truly 0.23, is keyed as 0.32, a plausible transposition. Porosity sits under the square root in the denominator, so the wrong curve rides LOW:

$$\frac{J_{wrong}}{J_{true}} = \sqrt{\frac{\phi_{true}}{\phi_{wrong}}} = \sqrt{\frac{0.23}{0.32}} = 0.8477912478906585$$

A 15 percent depression at every saturation. Direction is information: a plug riding high has an overstated k or an understated $\phi$ or an understated $\sigma \cos\theta$; a plug riding low has the reverse. You cannot tell WHICH input is wrong from the offset alone, but you know it is a scaling input and not the rock, and you know which direction to check first.

## Offset arithmetic works backwards

Because the offset is a pure ratio, you can invert it. If a plug rides a factor $r$ above the cloud and you suspect the permeability, the implied true permeability is $k_{entered} / r^2$. Ride factor 2 with k entered as 1680 implies 420 md, which is where the error was planted. On real data this inversion is a hypothesis generator, not a verdict; confirm against the core report before editing anyone's database.

## When the shape itself disagrees

All of the above assumes the misfit is a parallel ride. If a plug's J curve CROSSES the others, steeper at low saturation or flatter at the plateau, no scaling error explains it: scaling cannot change shape. Then you are looking at genuinely different pore geometry, a different rock type, a damaged plug, or a measurement artifact that varies with saturation, and the honest move is to exclude the sample from the family rather than force it in with a fudge factor. The collapse failing in shape is the J-function doing its job as a rock-typing tool.

## The misconception to avoid

"The curve is off by a constant factor, so I will just shift it onto the cloud and carry on." Shifting the curve hides the error without finding it, and the SAME wrong k or $\phi$ that spoiled the J scaling is usually feeding other calculations, permeability into flow models, porosity into volumetrics, where nothing will flag it. The offset is a symptom; treat the record, not the plot. Find which input is wrong, fix it at the source, and the plug rejoins the cloud on its own.

## Exercise

First, a plug rides a factor of 1.5 BELOW the cloud. Its entered permeability is 200 md and you suspect only the permeability. Compute the implied true value, and state the check you would run before believing it.

Second, a colleague proposes rescuing a plug that rides 2x high by doubling its $\sigma \cos\theta$ entry, arguing the result is indistinguishable from halving nothing since the curve lands on the cloud either way. Give the two reasons this is worse than finding the actual error, one about this plug's record and one about every other place that entry is used.
