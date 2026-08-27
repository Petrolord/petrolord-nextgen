# Why finite matters

You now know what the two solution families are, where each is valid, and how to read the gap between them. This lesson closes the module by following that gap through to the only thing a reserves engineer is actually paid for: the number of barrels of oil.

## The direction, stated carefully

Everything turns on one sentence that is easy to get backwards. $p_D$ is a dimensionless pressure drop, and water influx moves inversely with it. A larger $p_D$ at a given dimensionless time means the aquifer is charging you more pressure for the same delivery, so you get less water per psi of drawdown.

Chain it forward. A bounded aquifer in pseudo steady state has a $p_D$ that climbs linearly, while the unbounded solution flattens into a logarithm. So at late time the finite aquifer has the larger $p_D$ and therefore delivers less water. If you model a genuinely finite aquifer with the infinite acting solution you will overstate late influx.

Now push it one step further, into the material balance. The Havlena and Odeh statement of a water drive tank is that underground withdrawal is met by expansion plus imported water. Give the regression more water than the field actually received and the expansion term has less work left to do, so the oil in place that the regression needs in order to close the books comes out smaller. An overstated $W_e$ understates the OOIP. Water that was never there is doing work the oil would otherwise have had to do.

That is the reasoning. Here is the measurement.

## The same benchmark, four aquifers

Dake Exercise 9.2 is a ten year history on a wedge reservoir with a mapped aquifer of $r_{eD}$ 5, worked in module 2. Dake's own answer for the oil in place is 312 MMSTB. Running the engine's Carter-Tracy path over the identical production table and changing nothing except the aquifer radius ratio handed to it gives this.

| aquifer | OOIP MMSTB | cumulative We MMrb | R squared | drive mechanism |
|---|---|---|---|---|
| reD 3 | 455.567695625077 | 32.6766485440868 | 0.999964546937325 | depletion_drive |
| reD 5 (mapped) | 307.221409553720 | 88.0645883139400 | 0.999975248425736 | water_drive_with_depletion |
| reD 10 | 151.201390735163 | 149.513710896043 | 0.850365415264398 | strong_water_drive |
| infinite acting | 156.177551848366 | 148.248060002236 | 0.863239485188882 | strong_water_drive |

The mapped aquifer lands 1.53159950201266 percent below Dake. Drop the outer boundary altogether and the influx rises to 148.248060002236 MMrb, which is 68.3401499292193 percent more water than the finite run produced, and the oil in place collapses to 156.177551848366 MMSTB, 49.9430923562930 percent below Dake. Half the field, gone, purely from an assumption about how far away the far edge of the aquifer is.

The direction is exactly as argued: more water, less oil. It is worth noticing how much leverage the water has here. The extra 60.1834716882960 MMrb of influx removed 151.043857705354 MMSTB of booked oil, which is 2.50972324241521 stock tank barrels of booking lost for every reservoir barrel of imaginary water, because the oil is being asked to expand by a very small fraction of its volume and each barrel of imported water therefore displaces a large number of barrels of oil from the balance.

## The failure that shows and the failure that hides

Look at the R squared column, because it does not behave the way you might hope.

The two over-large aquifers announce themselves. At $r_{eD}$ 10 the fit falls to 0.850365415264398 and the infinite acting run to 0.863239485188882. A history that has genuinely felt its outer boundary cannot be reproduced by a model that has none, and the regression cannot hide it. If you see a water drive fit sitting in the mid eighties, an under sized aquifer is not the first thing to suspect.

The under-sized aquifer says nothing. At $r_{eD}$ 3 the fit is 0.999964546937325, essentially as good as the correct run, and the answer is 46.0152870593195 percent too high. Deny the field enough water and the regression simply books more oil to make up the difference, along a line that is every bit as straight. The Associate tier taught that a straight line does not validate your constants. This is the finite aquifer instance of it, and the asymmetry is the new part: too much aquifer breaks the fit, too little does not.

The drive mechanism label moves with the assumption too. The same eleven rows of production data are classified as depletion drive at $r_{eD}$ 3, as water drive with depletion at $r_{eD}$ 5 and as strong water drive at $r_{eD}$ 10. That is not a diagnostic reading the data. It is a consequence of what you told the engine about a boundary you cannot see, and it will end up in a development plan as a sentence about how the field is being pushed.

For completeness, deleting the aquifer entirely gives 532.588241588393 MMSTB at an R squared of 0.999317934436751, which is 70.7013594834594 percent above Dake with a fit that still looks respectable.

## Worked example: the two sided sensitivity

Take the mapped case as the base and ask what a mapping error costs in each direction.

Reducing the aquifer radius ratio from 5 to 3 moves the booking from 307.221409553720 to 455.567695625077 MMSTB, an increase of 48.2864414582466 percent, with the fit quality unchanged and the drive story rewritten as depletion. Doubling it from 5 to 10 moves the booking to 151.201390735163 MMSTB, a decrease of 50.7842272598114 percent, with the fit quality visibly broken.

So the sensitivity is comparable in magnitude in the two directions and completely asymmetric in detectability. The practical rule that follows is this: an aquifer radius ratio is not a fitting parameter you may quietly adjust to improve a match, because in one direction it improves nothing and in the other it improves the answer by breaking it. It is a mapped quantity, and it should arrive from the same subsurface work that produced the reservoir outline, with its own uncertainty range carried through to the reserves case rather than absorbed into a single number.

## Exercise

Using the four row table above, prepare the aquifer sensitivity section of a reserves memo. Write it out properly.

First, state the base case and its OOIP, and say in one sentence what the aquifer radius ratio is and where it came from. Second, give the low and high OOIP that follow from moving the radius ratio to 3 and to 10, express each as a percentage of the base case, and say plainly that the range is not symmetric in what it does to the fit. Third, and this is the part that separates a memo from a table, state which of the two directions your quality checks would have caught and which they would not, and name the one piece of evidence outside the material balance that could rule out the under sized case. Finish with a single sentence recommending what the subsurface team should deliver before the booking is finalised.
