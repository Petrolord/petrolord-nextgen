# Compressibility at both ends

A gas that behaved ideally would need no compressibility at all. A real one has a different z where it goes in from where it comes out, and the stage has to decide which one its head expression carries.

{{panel:fc-compressor-explorer}}

## Two ends, one average

On the SOKU stage the compressibility is 0.987732307 at suction and 0.988949105 at discharge, and the engine averages them to 0.988340706. The two ends differ by 0.001216798, and that difference is the reason the average is taken rather than the suction value carried straight through.

The order matters. The discharge z cannot be read until the discharge temperature is known, and the discharge temperature came out of the exponent. So the chain runs exponent, then discharge state, then the z at that state, then the average, and only then the head. A calculation that fixes z first and works forward has assumed the answer it was about to compute.

## Why the average and not either end

The head integral runs along the whole path from suction to discharge, so it sees every state in between. One value of z has to stand in for all of them, and the mean of the two endpoints is the ordinary engineering choice. It is a good one here because the two ends are close, and it would be a weaker one on a stage whose ends are far apart.

## The note that says where in the correlation the state sits

The SOKU suction comes back with a note rather than a warning: "Ppr 0.137 against 0.2 at 92 psia and 104 F is below the 0.2 where the DAK fit data start; the z-factor here runs toward the ideal-gas limit".

That is a note and it is not a complaint. The correlation surface runs to the ideal-gas limit as the reduced pressure goes to zero, so a low-pressure suction is an ordinary machine rather than an extrapolation. The engine says so instead of leaving a reader to wonder whether a quiet return meant the state was never checked at all.

## What the gas itself changes

Walk k across the same stage and the work moves with it. At k = 1.200000 the head is 60693.2222 ft lbf per lbm and the gas power 2175.2453 hp; at 1.240000 they are 62096.0266 and 2225.5218; at 1.280000, 63440.7448 and 2273.7165; at 1.320000, 64731.4272 and 2319.9745; at 1.400000, 67164.4557 and 2407.1743. Across those five rows the head and the power both climb with k.

## The mistake

The mistake is leaving z at one because the pressure looks low, or hardcoding a single figure for a whole train because the first stage justified it. Both put a systematic error into every downstream number, and neither shows up as anything the return will complain about. The stage is telling you both ends and the average it used, so quote them.

## Exercise

Give the compressibility at suction, at discharge and averaged on the SOKU stage, and the difference between the two ends. Explain why the discharge z cannot be read before the discharge temperature, and say what the suction note means about where that state sits in the correlation.
