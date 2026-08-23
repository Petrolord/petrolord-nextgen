# The neutron log

The density log gave you one porosity. This module adds a second, from a tool built on completely different physics, and then shows why the pair together is worth more than either alone. The second tool is the neutron log, recorded on the typewell as the curve NPHI.

## What the tool does

A neutron tool carries a source that fires fast neutrons into the formation and one or more detectors that count what comes back. A fast neutron loses energy most efficiently when it collides with a nucleus of about its own mass, and the only common nucleus that qualifies is hydrogen. Every collision with hydrogen robs the neutron of a large share of its energy; collisions with heavier nuclei such as silicon, calcium or oxygen barely slow it at all.

The consequence is simple. The more hydrogen the formation contains, the faster the neutrons are slowed and captured close to the source, and the fewer survive to reach the detector. Count rates at the detector therefore fall as hydrogen content rises. The quantity the tool actually senses is called the hydrogen index, the density of hydrogen atoms relative to fresh water.

In a clean, water-filled rock, essentially all the hydrogen lives in the pore fluid. Hydrogen index then tracks porosity directly, and the tool's count rates can be converted into an apparent porosity. That is what NPHI is: not a direct pore-volume measurement, but a hydrogen measurement dressed up as porosity.

## Matrix calibration

The conversion from count rates to porosity depends on what the non-porous part of the rock does to the neutrons, so every neutron porosity is quoted against a reference matrix. Service companies calibrate in limestone-filled test pits by convention, and a log headed "limestone units" reads correct porosity only in limestone. If the rock is actually sandstone, a limestone-calibrated reading needs a shift.

The typewell NPHI is delivered on a sandstone matrix scale, in volume-fraction units (v/v). In a clean, water-filled sandstone it can be read as porosity directly, with no chart conversion. That convenience is deliberate in a teaching dataset, but on a real well the first thing a professional checks on a neutron curve is the matrix reference in the log header. Reading a limestone-scaled curve as sandstone porosity introduces an error of several porosity units, which is larger than the entire tolerance budget of most volumetric studies.

## What moves the reading besides porosity

Because the tool counts hydrogen, anything that changes the hydrogen inventory changes NPHI, whether or not pore volume changes.

Clay raises it. Clay minerals hold water in two forms that the tool cannot distinguish from pore water: water bound to the crystal structure and water adsorbed on the enormous surface area of the clay platelets. A shale can therefore read a high neutron porosity while having almost no useful pore space. On the typewell, the shale at 2000 m reads NPHI of 0.30, which is higher than any reading in the clean reservoir sand. Nobody believes that shale has 30 percent effective porosity; the tool is reporting clay-bound hydrogen.

Gas lowers it. Gas contains hydrogen, but at reservoir conditions its hydrogen density per unit volume is far below that of water or oil. A gas-filled pore therefore contributes much less hydrogen index than the same pore filled with liquid, and NPHI drops. This is the mirror image of what gas does to the density log, and the next lessons turn that opposition into a diagnostic.

## The neutron on the typewell

Three anchor readings are worth memorising, because the rest of the module keeps returning to them:

* Clean mid SAND_A, 2020 m: NPHI = 0.13. The density porosity at the same depth is 0.2100, so the two tools disagree in the clean sand and the neutron is the lower of the pair.
* Shale, 2000 m: NPHI = 0.30. The highest neutron reading of the three, in the rock with the least effective porosity. Clay-bound water at work.
* Water leg, 2076 m: NPHI = 0.098. Here the density porosity is 0.0980, and the two tools agree almost exactly in this tighter, water-filled sand.

The pattern is the whole story of the neutron log in miniature. In shale it overstates porosity badly. In clean liquid-filled rock it is a reasonable porosity tool, sometimes reading a little above the density, sometimes a little below, depending on how the actual rock differs from the calibration assumptions.

## Worked example

Convert the shale reading into a statement about hydrogen rather than porosity. At 2000 m the neutron reports 0.30 on a sandstone scale. Read literally, that claims 30 percent of the bulk volume is water-filled pore. The density log at the same depth gives a porosity of only 0.0606 (you will verify this arithmetic in the next lesson). The difference,

$$0.30 - 0.0606 = 0.2394,$$

is apparent porosity that the neutron sees and the density does not. Nearly 24 percent of the bulk volume is behaving, to a hydrogen counter, like water, while contributing almost nothing to the density deficit that free pore fluid would create. That is the signature of clay-bound water, and the size of the number is why no shaly interval can be evaluated from a neutron curve alone.

## Exercise

Using the three anchor readings, state for each depth whether NPHI is reading true effective porosity, overstating it, or approximately matching the density tool, and give the physical reason in one sentence each. As a self-check: at 2076 m the neutron and density agree within 0.0000 to four decimals (0.098 versus 0.0980); at 2020 m the neutron reads 0.08 porosity units below the density value of 0.2100; at 2000 m the neutron reads 0.2394 units above the density value. Then answer one further question: if SAND_A held gas instead of oil and water, in which direction would the 2020 m neutron reading move, and why?
