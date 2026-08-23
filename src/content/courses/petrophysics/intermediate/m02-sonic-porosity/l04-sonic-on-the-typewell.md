# Sonic porosity on the typewell

You now hold two sonic transforms and, from the Associate course, the density porosity. This lesson runs all of them across the typewell and reads the comparison the way a professional does: agreement is quality control, disagreement is diagnosis.

## The zone means

Run the full well at 0.5 m sampling and average each porosity over the SAND_A interval, 2010 to 2030 m:

| Method | SAND_A mean |
| --- | --- |
| Wyllie sonic | 0.2069 |
| Raymer-Hunt-Gardner | 0.2344 |
| Density | 0.2022 |
| Neutron-density average | 0.1762 |

Read the table from the middle out. Density says 0.2022 and Wyllie says 0.2069: two independent physics agreeing within half a porosity unit, which is the signature of a clean, compacted, liquid-filled sand with correct anchors. RHG says 0.2344, high by the margin the previous lesson predicted for a compacted section. The neutron-density value of 0.1762 belongs to the next module, but note now that it sits lowest; when you meet the reason, remember that the choice among these four numbers moves the booked porosity by nearly six porosity units.

The Wyllie SAND_A mean of 0.2069 is one of the six numbers the Professional capstone grades, with a tolerance of 0.005. It is not graded because Wyllie is "the right answer" for booking; it is graded because computing it correctly proves you can drive the transform.

For contrast, SAND_B over 2050 to 2080 m gives a Wyllie mean of 0.1200. The deeper sand is visibly tighter, and every method agrees on that ranking even where they disagree on level.

## The shale tells the truth about apparent porosity

Now the shale point at 2000 m: DT reads 238.88 us/m and RHOB reads 2.55 g/cc.

Wyllie: $(238.88 - 182)/474 = 56.88/474 = 0.1200$.

Density: $(2.65 - 2.55)/1.65 = 0.0606$.

The sonic computes twice the porosity the density does, in a rock that is mostly clay. Clay minerals and their bound water slow the compressional wave, so the sonic sees "excess transit time" and dutifully converts it to porosity. But none of that apparent porosity is connected, producible pore space. Sonic porosity in shale is apparent porosity, an artefact of slow clay, and booking it as effective porosity is a classic beginner error. This is the same lesson the neutron log will teach even more dramatically in the next module, where the same shale reads NPHI of 0.30.

The practical rule: porosity transforms are calibrated for the reservoir lithology. Outside it, in shales and in shaly laminations, their outputs are diagnostic curves, not volumes. Your Vsh curve exists precisely to tell you where that boundary runs.

## The water leg agrees exactly

Drop to the water leg at 2076 m, a clean wet sand: DT is 228.452 us/m and RHOB is 2.4883 g/cc.

Wyllie: $(228.452 - 182)/474 = 46.452/474 = 0.0980$.

Density: $(2.65 - 2.4883)/1.65 = 0.1617/1.65 = 0.0980$.

Identical to four decimal places. A clean, compacted, fully water-saturated sand is the textbook domain of both transforms, and they behave accordingly. When you fit the Pickett plot in this leg two modules from now, you can carry the porosity there with confidence, and that confidence was earned here, by cross-checking methods, not by trusting any single curve.

## The professional's use of the sonic

Put the module together as doctrine:

* In good hole with a working density tool, density (or neutron-density) porosity is the primary; Wyllie sonic is the independent check. Agreement within about one porosity unit closes the QC loop.
* When the density pad fails, in washouts, rugose hole, or badly caved intervals, the sonic is the backup porosity source, because the refracted head wave tolerates hole enlargement far better than a pad tool. The caliper decides which intervals get which source.
* RHG replaces Wyllie when compaction is in doubt; in a compacted section expect it to read high and do not average it in to split the difference.
* Whatever you book, the report states the source per interval and why. "Porosity: density, except 2062 to 2066 m sonic (washout, caliper +4 in)" is one line that saves the next interpreter a day.

The capstone will ask you for the Wyllie SAND_A mean alongside the neutron-density mean, the Pickett fit and two saturation means. You have the first of the six numbers in hand.

## Exercise

Using the typewell anchors, compute the Wyllie porosity of the shale at 2000 m and of the water-leg sand at 2076 m, and compare each against its density porosity (0.0606 and 0.0980 respectively). As a self-check you should recover 0.1200 for the shale and 0.0980 for the sand. In two sentences, explain why the sonic and density agree in the wet sand but split by a factor of two in the shale, and which of the two shale numbers is closer to effective porosity.
