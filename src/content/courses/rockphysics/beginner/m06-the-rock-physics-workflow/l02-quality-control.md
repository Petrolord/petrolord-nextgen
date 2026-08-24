# Quality control

A fluid property that is wrong looks exactly like one that is right. Both come out of the same engine, both are quoted to ten decimal places, and neither carries a warning. The defence is a fixed set of checks run in the same order every time, before anybody is allowed to use the numbers.

Six checks cover almost everything that goes wrong at this tier.

## Check 1: is every fluid quoted with its conditions

Start here, because it catches the errors the other five cannot see. Write the conditions beside the fluids and refuse to accept a value that arrives without them.

For the Ekene sand the line reads 60 degC, 25 MPa, brine salinity 0.035 by weight, gas gravity 0.6, oil stock tank density 0.85 g/cc at GOR 50 L/L. A brine density of 1017.8249875 kg/m3 is meaningless on its own, because the same brine gives 1032.1697 kg/m3 at 20 degC and 995.3571 kg/m3 at 100 degC, and the number alone will not tell you which one you have.

The most common real failure this check catches is a laboratory property set taken at surface conditions. A stock tank oil sample stands at GOR 0 and returns 820.9856 kg/m3 rather than the live 777.0630099023522 kg/m3, and nothing downstream will notice.

## Check 2: is the unit right for each modulus

This is arithmetic hygiene and it is the check people skip.

Brine and the mineral frame are quoted in GPa. Gas and the Wood mixed fluid are quoted in MPa. The reason is size. At the Ekene conditions the brine is 2.6978112899395996 GPa, which is 2697.8113 MPa, and the gas is 55.71865290286663 MPa. Put the gas in GPa and it becomes a string of leading zeros that is easy to mistype. Put the brine in MPa and it becomes a four figure number that looks like a stress.

Sanity test each value against the family it belongs to. A brine modulus should be a small number of GPa. A gas modulus should be tens or low hundreds of MPa. A mineral frame modulus should be tens of GPa, and the Ekene frame is 30.87940062475596 GPa. A value in the wrong band by a factor of a thousand is a unit error, not a physics discovery.

## Check 3: does the mixed fluid sit nearer the soft phase

Wood's equation is a harmonic average, so the mixed modulus must always lie closer to the softer end member than a linear average would put it.

At Sw 0.8 the two end members are the gas at 55.7187 MPa and the brine at 2697.8113 MPa, and the mix comes out at 257.3340919366766 MPa. That is far down at the gas end, even though gas is only a fifth of the pore fluid by volume. The compliance accounting says why. The brine term contributes 7.6 percent of the total and the gas term contributes 92.4 percent.

If your mixed modulus sits anywhere near the middle of the two end members, you have used a linear average by mistake. That is a genuine and frequent error, because linear mixing is correct for the density in the very next check and people apply it to both.

## Check 4: does the mixed density match the linear sum

Density really does mix linearly, so this check is an equality and not a judgement.

At Sw 0.8, $0.8 \times 1017.8249875 + 0.2 \times 172.66679461728904 = 848.7933489234579$ kg/m3, which is what the engine returns. If those two disagree, the saturations you typed are not the saturations the engine used.

Run checks 3 and 4 together and they cover each other. One value must be harmonic, the other must be linear, and confusing the two shows up immediately in whichever one you got wrong.

## Check 5: do the VRH values sit between their bounds

A Voigt Reuss Hill average is the mean of an upper and a lower bound, so it has to lie between them. This is a check you can run without any tolerance argument.

| property | Reuss (lower) | VRH | Voigt (upper) |
| --- | --- | --- | --- |
| K (GPa) | 29.868801 | 30.87940062475596 | 31.890000 |
| mu (GPa) | 16.939444 | 25.25472176759411 | 33.570000 |

Both rows pass. While you are there, read the spread as well as the position. The bulk modulus bounds sit about 6.8 percent apart, so that value is tightly held. The shear bounds sit nearly a factor of two apart, so the shear value is a much weaker claim and should be reported as such.

## Check 6: is the frame density exactly 2629

Density does not have bounds, because it mixes exactly. The 70/30 quartz and clay frame gives $0.7 \times 2650 + 0.3 \times 2580 = 2629$ kg/m3, and the engine returns exactly that.

An exact check is worth more than an approximate one, because it fails loudly. If the frame density is not 2629 kg/m3 the mineral fractions are not 70 and 30, and every modulus in check 5 is being computed for a different rock than the one you meant.

Try it yourself: run checks 2 through 6 against the panel below at the capstone saturation of Sw 0.8, then move the saturation and watch check 3 stay true while the numbers change.

{{panel:rp-fluid-explorer}}

## Exercise

Run the six checks on the Ekene fluids and frame and write one line for each saying what passed. Then answer in one sentence: which check would catch a mixed fluid that had been averaged linearly instead of harmonically?

As a self check: the conditions are stated as 60 degC and 25 MPa with salinity 0.035, gravity 0.6 and GOR 50 L/L; the units sit in the right bands, with brine at 2.6978112899395996 GPa, gas at 55.71865290286663 MPa and frame at 30.87940062475596 GPa; the mix at 257.3340919366766 MPa sits far down at the gas end of the range from 55.7187 to 2697.8113 MPa; the mixed density of 848.7933489234579 kg/m3 equals the linear sum; both VRH values lie inside their bounds, 30.87940062475596 between 29.868801 and 31.890000 GPa and 25.25472176759411 between 16.939444 and 33.570000 GPa; and the frame density is exactly 2629 kg/m3. Check 3 catches a linear average, because a linear mix at Sw 0.8 would land near the middle of the two end members instead of down at 257.3340919366766 MPa.
