# One stream, from the rate to the cut size

Everything in this tier has been one link of a chain. This lesson runs the whole chain on one stream, in the order the engine runs it, so that each number can be seen consuming the one before it.

## The stream

UZERE is 28000 bwpd of 650 ppm oil at 41 C and 62000 ppm TDS, the crude is 24 API, and the droplets arrive at a median of 26 micron with a sigma of 0.8. Those inputs are the whole specification of the problem, and every figure below comes out of them.

| step | what the engine was asked | answer |
| --- | --- | --- |
| 1 | the flow, from the rate | 0.051523660393 m3/s |
| 2 | the water viscosity | 0.000710553998 Pa.s, from 0.000639217342 fresh times a salinity factor of 1.111600 |
| 3 | the brine density | 1035.261174 kg/m3, from 991.861174 fresh |
| 4 | the crude density | 892.869375 kg/m3, at a specific gravity of 0.909968 |
| 5 | the density difference | 142.391799 kg/m3 |
| 6 | how fast the median droplet rises | 0.000073804485 m/s at Reynolds 0.002796, inside the band |
| 7 | the basin surface loading | 0.001981679246 m/s |
| 8 | the basin cut size | 165.003927 micron |
| 9 | what the basin removes from this water | 3.284882 percent |
| 10 | the plate pack cut size | 86.549597 micron, on an effective area of 63.000000 m2 |

## The rate becomes a flow

Step one is bookkeeping and it is worth naming anyway. A production rate in barrels of water per day becomes a volumetric flow in cubic metres per second before any physics happens, using the exact barrel, and every device answer downstream is in those units.

## The fluids come before the equipment

Steps two to five are the whole of the second module of this tier, arriving in order. Temperature and salinity give a viscosity. Temperature and salinity give a brine density. API gravity and temperature give a crude density. The subtraction gives the driving force. No dimension of any vessel has been mentioned yet. The fluid properties are settled before any equipment is chosen, which is why an engineer can tell how hard a duty is going to be before opening a catalogue, and why a change of temperature upstream changes every device answer downstream of it.

## The droplet, then the geometry

Step six is the rise velocity of the median droplet, reported with the Reynolds number that says whether to believe it. Steps seven and eight are the basin: the flow divided by the plan area, then the balance inverted at the allowance to give a cut size. Step nine turns that cut size into a removal by integrating the grade curve against the droplet distribution, which is the first step in the chain where the droplets and the equipment finally meet. Step ten does the equipment half again for a different device on the same water, and it reaches a finer cut size on the same stream because the plate pack divides the flow by a far larger settling area than the basin footprint provides.

## What the chain is for

Read down the table and notice that every number is an input to the one below it. A wrong temperature at step two produces a confidently wrong cut size at step eight, and every figure in between prints normally on the way down. That is the ordinary failure of a chained calculation, and the only defence is being able to read the chain. Nothing in the output flags it, because nothing in the output is wrong in the sense the engine can detect: each step did exactly what it was asked with what it was given.

{{panel:pw-water-explorer}}

## Exercise

Take the table and mark which steps depend only on the fluids and which need a dimension of a vessel. Then say which single input, typed wrong, would move the most rows of the table, and name the first row where the mistake would become visible.
