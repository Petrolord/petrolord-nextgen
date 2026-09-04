# Gas against casing pressure

The gas a plunger cycle needs is never measured. It is an expansion computed between two pressures, and one of them is the casing.

{{panel:pd-remedy-explorer}}

## The two ends of the expansion

`screenPlungerLift` builds the gas per cycle as an expansion from the casing pressure down to the pressure still needed at the top of the rise. That second pressure is the static force balance. On the teaching well OGUTA-2, an 8200.0 ft plunger candidate on 2.441 in tubing that no oracle has ever checked, it comes to 248.1897322873 psia: 145.0000000000 psi of line, 73.4368000000 psi of slug hydrostatic under a 160.0 ft slug of 1.060 SG liquid, 1.7522191087 psi of plunger weight, 28.0007131786 psi of gas column and 0.0000000000 psi of friction. The casing is 720.0 psia, which exceeds it by 471.8102677127 psi.

## The average is the whole of it

`gasPerCycleScf` takes the two ends and averages them. At 720.0 psia of casing against a requirement of 248.1897322873 psia the average is 484.09486614 psia, and the cycle needs 8854.756635640 scf. The same cycle brings up 0.9261160790 bbl, so the required gas-liquid ratio is 9561.17363265 scf/bbl, against a well making 5900.0 scf/bbl. The screen returns pressureOk = true, glrOk = false, feasible = false, and one warning: "A cycle needs 9,561.2 scf of gas per barrel and the well makes 5,900.0. There is not enough gas to drive the plunger at this slug size."

## The published case, both routes

| Quantity | Engine | Oracle |
| --- | --- | --- |
| Required lift pressure, psia | 225.8581556122 | 225.9658011080 |
| Gas per cycle, scf | 5452.924357073 | 5453.635111991 |
| Liquid per cycle, bbl | 1.1576450988 | 1.1576450988 |
| Required gas-liquid ratio, scf/bbl | 4710.35929989 | 4710.97326605 |

Those are 6000.0 ft of 2.441 in tubing, a 200.0 ft slug of 1.02 SG liquid, 120.0 psia of line, 600.0 psia of casing, a 6.0 lb plunger, gas gravity 0.65 at 580.0 degR and z 0.90. The engine gas per cycle differs from the oracle by -0.710754919 scf because the two routes part on the slug, and the liquid volume, which carries no gradient at all, agrees exactly.

## What the screen refuses

Hand it a zero plunger weight and it returns ok = false with "The plunger needs a weight." A zero slug gives "A cycle lifts a slug, so it needs a slug length." A zero tubing diameter, a zero average temperature and a slug longer than the tubing are each refused by name.

## The check that is not on that list

`gasPerCycleScf` never asks whether the expansion runs the right way. At 720.0 psia the casing stands 471.81026771 psi above the requirement and it does run the right way, but nothing in the function established that. The averaging happens either way, and a number comes back either way.

## Exercise

Rebuild the 248.1897322873 psia requirement from its printed terms and confirm the sum.

Then subtract the requirement from the casing pressure and say in one sentence what the sign of that subtraction has to be before the 9561.17363265 scf/bbl is worth reading.
