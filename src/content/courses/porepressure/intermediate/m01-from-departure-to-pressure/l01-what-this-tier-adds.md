# What this tier adds

The Associate tier built a frame. A hydrostatic column of 41.408579625 MPa at 4000 m below mudline, an overburden of 91.12306695073282 MPa at the same depth, a Gardner fallback for missing density, and a compaction trend with an exact least-squares fit through twelve shale picks. At the end of it you could put a sonic log beside a trend and say where the log leaves it.

None of that is a pore pressure. The frame tells you what is normal and where the well stops being normal. It does not tell you what the pressure is at any depth where the answer matters. This tier closes that gap: it converts the departure you learned to see into a pressure in megapascals at every one of the well's 401 samples.

## The method

The conversion is Eaton's method, published in 1975 and still the most used pore pressure relation in the industry. It takes three inputs you already own: the overburden $S$, the hydrostatic $P_h$, and the ratio between the transit time the trend expects and the transit time the log reads. It returns a pore pressure:

$$PP = S - (S - P_h) \left( \frac{\Delta t_n}{\Delta t} \right)^n$$

One line. Everything in this tier is inside that line: what the ratio means, what the exponent does, why the subtraction runs from the overburden downward, and what happens when the trend feeding the ratio is wrong.

## The well is the same one

The golden well returns unchanged: 401 samples from the mudline to 4000 m below it, 100 m of water, seawater at 1025 kg/m3, pore fluid at 1030 kg/m3, gravity at 9.80665 m/s2. Its sonic was built on a normal-compaction trend of 656 us/m at the mudline decaying at 0.6 per km toward a matrix time of 220 us/m, and below 2500 m a pressure ramp of 4 kPa per metre was encoded into the transit times.

That last sentence is why this well can teach the method honestly. The overpressure in this well is not a matter of opinion. It was put there, deliberately, at a known rate, from a known depth. The Associate tier's onward lesson already told you the headline: the prognosis recovers an overpressure at total depth of exactly 6 MPa, which is 4 kPa per metre acting over the 1500 m below 2500 m. This tier is where you run that prognosis yourself and watch the loop close.

## What is graded

The capstone runs the full pipeline on the well's own trend with $n = 3$ and grades six numbers: the overpressure onset depth the detection rule reports, the normal-trend transit time at total depth, the pore pressure at 3000 m and at total depth, the overpressure at total depth, and the fracture pressure at total depth.

Two of those six deserve a flag now.

The onset is graded with a tolerance of zero, and the answer is not the 2500 m the ramp actually starts at. The detection rule flags the first sample more than 0.05 MPa above hydrostatic on a 10 m grid, and that sample is at 2520 m. Module 3 spends a full lesson on why that is the correct answer to the question the rule asks, and why the distinction matters on a real well.

The fracture pressure is new. The Associate tier named it and deliberately did not compute it, because it stands on a pore pressure estimate that did not exist yet. Module 5 builds it from the coefficient form with a Poisson's ratio of 0.4.

## What you will be able to do

Run a full Eaton prognosis and read it: onset, curve, values at the depths that matter. Decompose any point of it into a stress budget and a recovered fraction, so the answer is arithmetic you can defend rather than a curve a machine drew. Say what the exponent does and what it does not. Demonstrate, with this well's own numbers, that the trend you feed the method is worth more than every other choice combined. And attach a fracture pressure to the prognosis, which is the half of the mud window this tier contributes.

One boundary, stated plainly: this tier produces pressures in megapascals. Turning them into the driller's numbers, the equivalent mud weights and the window between them, is the Expert tier, along with the Bowers cross-check and the calibration question. The Associate tier's bracket of 1029.878049 to 2266.333384 kg/m3 at total depth stays where it is until then.

## Worked example

One number is worth computing before anything else, because the whole tier hangs off it. The gap between the overburden and the hydrostatic at total depth:

$$S - P_h = 91.12306695073282 - 41.408579625 = 49.714487325732826 \ \mathrm{MPa}$$

That gap is the entire budget the method has to work with. Every pore pressure Eaton can return at that depth sits between the hydrostatic (ratio 1, nothing handed to the fluid) and the overburden (ratio 0, the whole budget handed over). The graded overpressure of 6 MPa is 12.07 percent of that budget. Keep that framing: the method never invents pressure, it allocates a gap the frame already measured.

## Exercise

From the Associate tier's numbers at 3000 m, the overburden is 66.831143 MPa and the hydrostatic is 31.307730 MPa. State the stress budget at that depth, and then, given that the encoded ramp implies exactly 2 MPa of overpressure at 3000 m, state what fraction of the budget the method must hand to the fluid there.

Self check: the budget is 66.831143 minus 31.307730, which is 35.523413 MPa. Handing the fluid 2 MPa of it is 5.63 percent. At total depth the budget is 49.714487 MPa and the handover is 6 MPa, which is 12.07 percent. Both numbers come from the same machinery you are about to build, and both are small fractions: this is a mildly overpressured well, not a crisis, which is exactly why it is a good place to learn the arithmetic.
