# Viscosity moves the curve

The Ekene oil is light, 1.8 cp against water's 0.5 cp, and the last three lessons have shown the flood behaving well because of it: a mobility ratio of 1.2 and an S-curve that keeps water below half the stream through the middle of the mobile range. This lesson asks the what-if that every screening study asks. Same rock, same endpoints, same exponents, heavier oil. What does the curve do, and what does it cost?

## Three oils, one rock

The engine was run three times with the Ekene relative permeability curves untouched, changing only the oil viscosity. The table reports the mobility ratio and, from the module 4 machinery, the front saturation, the fractional flow at the front, the pore volumes injected at breakthrough, and the displacement efficiency at breakthrough. You have not yet built the theory behind the last four columns; for now read them the way you would read a scoreboard before learning the rules, because the direction of every number is the lesson.

| $\mu_o$ (cp) | $M$ | $S_{wf}$ | $f_{wf}$ | $Q_{iBt}$ (PV) | $E_{DBt}$ |
| --- | --- | --- | --- | --- | --- |
| 1.8 | 1.2 | 0.6372 | 0.8682763300877854 | 0.33077027444818546 | 0.5088773453049006 |
| 5 | 3.3333333333333335 | 0.574 | 0.8016100406142702 | 0.27943761760812 | 0.4299040270894154 |
| 10 | 6.666666666666667 | 0.5327999999999999 | 0.761465730809439 | 0.24006333128830806 | 0.3693282019820123 |

Every column tells the same story in its own units. Raising $\mu_o$ from 1.8 to 10 cp multiplies $M$ by the same factor the viscosity grew by, from 1.2 to 6.666666666666667, because lesson 2 showed $M$ is directly proportional to $\mu_o$ when nothing else changes. The front saturation slides backward from 0.6372 to 0.5327999999999999: the water front now arrives carrying less water saturation behind it. Breakthrough comes earlier, at 0.24006333128830806 pore volumes instead of 0.33077027444818546. And the displacement efficiency at breakthrough, the fraction of the oil initially in the swept element that has been displaced, falls from about 51 percent to about 37 percent.

## What actually moved

Go back to the equation. Oil viscosity appears in exactly one place, the denominator term $k_{ro}\mu_w / k_{rw}\mu_o$, so multiplying $\mu_o$ by a factor shrinks that term by the same factor at every saturation. The whole S-curve shifts up and to the left: at any given $S_w$, the stream is now more water than it was. The pins do not move, because the endpoint saturations never entered the viscosity term; $f_w$ is still exactly zero at 0.35 and one at 0.75.

An up-and-left curve is bad news through the geometry of module 4. The steep band that lesson 3 located between roughly 0.50 and 0.62 slides toward lower saturations, and the tangent construction that finds the front lands earlier on the curve. You do not need the construction yet to see the consequence in the table: every measure of early performance degrades monotonically as the oil gets heavier.

## What did not move

Look at the rightmost thing the table does not show: the ultimate ceiling. The maximum displacement efficiency is set by endpoints alone, and it is 0.6153846153846154 for all three rows, because $S_{wc}$ and $S_{or}$ never changed. Module 5 owns that number and will derive it. Here it anchors the honest reading of the table: viscosity decides how quickly and how cheaply you approach the ceiling, never where the ceiling is. A heavy-oil flood on this rock is not chasing less oil. It is chasing the same oil with more water, over more years.

## See it in the panel

{{panel:sc-displacement-explorer}}

Drag the oil viscosity slider from 1.8 up through 5 to 10 and watch three things at once: the $f_w$ curve standing up and shifting left, the mobility ratio tile climbing in proportion, and the breakthrough tiles falling. Then drag it back down below 1.8 and notice the curve settle right: lighter oil, later breakthrough. The slider is doing to the curve exactly what the table did in three snapshots.

## The misconception to avoid

The trap in this lesson is reading falling $E_{DBt}$ as lost reserves. Breakthrough efficiency is a milestone, not a total. After breakthrough the flood keeps producing oil at rising water cut, and given enough throughput each of the three floods above approaches the same endpoint-set ceiling. What heavy oil costs is time, water handling, and money, which is often decisive, but it is an economic loss, not a reservoir one. Keep "how much oil is movable" and "how hard the movable oil is to get" in separate mental columns.

## Exercise

First, using the proportionality from lesson 2, compute the mobility ratio this rock would have at $\mu_o = 3.6$ cp, and place it between the correct two rows of the table.

Second, in words: the muO 10 row has the lowest $f_{wf}$ of the three, 0.761465730809439, even though its curve sits highest at any fixed saturation. Explain how the front can carry a lower fractional flow while the curve as a whole moved up. (Hint: the front saturation moved too. Module 4 will make this precise.)