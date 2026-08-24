# Quality control

A pressure frame that is wrong looks exactly like one that is right. Both come out of the same engine, both are quoted to ten decimal places, and neither carries a warning. What separates them is whether somebody ran a fixed set of checks before the frame was allowed out of the office.

This lesson is that pass, written the way a reviewer would run it. The sanity checks in module five were the ones you run on your own working. These are the ones somebody else runs on you, in the order they would ask the questions, before a prognosis or a mud programme is built on your frame.

## Check 1: is the depth reference stated on every curve

The reviewer's first question is not about physics. It is what the depths mean.

Every curve in this frame is indexed in metres below mudline, with 100 m of water above the mudline and total depth at 4000 m below mudline. If a submitted frame does not say that on its face, the reviewer cannot tell whether a value at 3000 m is 3000 m of rock or 2900 m of rock under 100 m of sea.

Reject anything that arrives without it, because this is the cheapest check on the list and it catches the most expensive error.

## Check 2: does the hydrostatic column have both parts

The hydrostatic on this well is the only number in the frame that is exactly hand checkable, so a reviewer checks it by hand.

Seawater to the mudline is 1025 x 9.80665 x 100 = 1005181.625 Pa. Pore fluid below it is 1030 x 9.80665 x 4000 = 40403398 Pa. The total is 41408579.625 Pa, which is 41.408579625 MPa at 4000 m below mudline, and the same column read at the mudline is 1.005182 MPa.

Two failures show up here. A hydrostatic of zero at the mudline means the seawater term was dropped. A hydrostatic at 4000 m that is short by about a million pascals means the same thing further down.

## Check 3: is gravity the value the engine uses

Ask which value of g the frame was built with, and expect the answer 9.80665 m/s2.

This is a reviewer question rather than a footnote because of the tolerance. Against a 0.01 MPa window at 4000 m below mudline, a g of 9.81 returns 41.422725000 MPa and a g of 9.8 returns 41.380500000 MPa, so both rounded values fail against the graded 41.408579625 MPa. Record the constant with the frame.

## Check 4: are the units right in each place

Four unit families run through this workflow and each has one correct home.

| quantity | unit on the report |
| --- | --- |
| pressure | MPa, with a depth attached |
| depth | m below mudline |
| density | kg/m3 |
| transit time | us/m |
| compaction constant | per km |

Engines work in pascals internally and the report works in MPa, so a reviewer looks for one conversion at the boundary. The compaction constant is the one people get wrong most often, because the same trend can be written two ways: the well's own constant is 0.0006 per m and 0.6 per km, and the two forms differ by a factor of a thousand while both look like plausible numbers.

## Check 5: do the two pressure curves behave

The reviewer reads three things off the pressure track without doing any arithmetic.

The curves meet at the mudline, both at 1.005182 MPa. The overburden leads everywhere below, reaching 91.12306695073282 MPa at 4000 m below mudline against a hydrostatic of 41.408579625 MPa at the same depth. Both climb at every step, with no dip anywhere.

Then one conversion as a reasonableness test. Referenced to sea level, the hydrostatic at total depth is an equivalent mud weight of 1029.878049 kg/m3 and the overburden is 2266.333384 kg/m3. The first sits just under the 1030 kg/m3 pore fluid density, which is correct because the seawater part of the column is slightly lighter. Those two bracket every pressure this well can hold, and any pore pressure a later tier reports must land between them.

## Check 6: are the fitted trend parameters reported with their picks

A fitted trend without its picks is an assertion. A reviewer asks to see both.

On this well the fit through the twelve shale picks returns a mudline transit time of 650.0000000000014 us/m and a compaction constant of 0.7000000000000015 per km, and the picks themselves span 200 m to 3500 m with the matrix transit time fixed at 220 us/m. The well header separately labels its own trend 656 us/m and 0.6 per km.

A reviewer who sees only the fitted numbers has no way to tell a shale trend from a sand trend, or a well constrained fit from one squeezed into a 300 m window. Reported together, the two are checkable: the trend should pass through the picks, the mudline value should sit well above the matrix, the constant should be positive and of order one per km, and any disagreement with a header label should be explained rather than hidden.

## Check 7: is the departure depth identified

Last, the reviewer asks what the frame is for. State the depth at which the log leaves the trend and describe the shape of the departure.

On this well the log sits on the trend down to 2500 m, where both read 317.2847498247154 us/m, and stands above it below that, reaching 270.92263512383806 us/m against a trend of 259.553028 us/m at 4000 m. The gap widens steadily with depth, which is the shape of a pressure ramp rather than a sealed compartment.

A frame handed on without that statement is half a deliverable, because the reading is what somebody downstream actually needs.

Try it yourself: step the panel below down the well and run checks 5, 6 and 7 at each depth you stop at.

{{panel:pp-frame-explorer}}

## Exercise

Run the seven checks against the golden well frame and write one line for each saying what passed. Then answer in one sentence: which check catches a compaction constant that was entered in per m when the field wanted per km?

As a self check: depths are stated as metres below mudline with 100 m of water; the hydrostatic column contains both parts, 1005181.625 Pa and 40403398 Pa summing to 41408579.625 Pa; gravity is 9.80665 m/s2; units sit in their right homes; the curves meet at 1.005182 MPa, the overburden leads to 91.12306695073282 MPa against 41.408579625 MPa at total depth, and the equivalent mud weights of 1029.878049 and 2266.333384 kg/m3 bracket the well; the fit returns 650.0000000000014 us/m and 0.7000000000000015 per km alongside twelve picks spanning 200 m to 3500 m; and the departure begins at 2500 m and widens downward. Check 4 catches the per m entry, because a constant written per m is a thousand times smaller than the same constant written per km, as the well's own 0.0006 per m and 0.6 per km show, and only the per km form belongs in a field labelled per km.
