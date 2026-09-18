# Reading a stage removal

A stage removal is the number most often lifted out of a train report and quoted on its own. It is also the number that travels worst, because it is a fact about a device and a water together.

{{panel:pw-train-explorer}}

## Four stages, four arguments, four waters

The OGBOTOBO train runs 1800 ppm at d50 14 micron and sigma 0.95 through four unlike devices.

| stage | cut micron | sharpness | removal percent | outlet ppm | outlet median micron |
| --- | --- | --- | --- | --- | --- |
| API 421 basin | 112.300216 | 3 | 3.237437 | 1741.726140 | 13.476136 |
| Hydrocyclone bank | 4.246743 | 3 | 85.209861 | 257.603712 | 3.972384 |
| Induced gas flotation | 7.446595 | 2 | 27.278164 | 187.334148 | 3.415699 |
| Walnut shell filter | 9.930885 | 2 | 14.382082 | 160.391597 | 3.185598 |

Four of 4 stages ran, the train reports complete, and 0 stages were skipped. Overall the train removes 91.089356 percent over every stage in it.

## Three things to read off a row

First, the CUT SIZE, which comes from that device's own geometry and the fluid it is in. Second, the SHARPNESS, which is 3 for the basin and the liner bank and 2 for the two interception devices. That changes the shape of the grade curve, and it is worth real percentage points of removal.

Third, the WATER, which is not in the row at all. Its only trace is the outlet median of the row above. The basin hands over water at 13.476136 micron and the liner bank hands over water at 3.972384 micron, so the last two devices work on a distribution whose median sits below every cut size in the plant.

## What the removal is a fraction of

The engine states the basis on every return: the removal is a fraction of the OIL, so it is dimensionless, and the outlet concentration comes back on whatever basis the inlet was given on. Feed it ppm by mass and you get ppm by mass out. Comparing the result with a figure written in mg per litre is a conversion the caller must make, and this module states no limit of its own.

## The sharpness is part of the reading

The two sharpnesses in that table are not a style choice. Three is DECLARED for the gravity and centrifugal devices. Two is DERIVED for the two interception devices, because both of them capture by interception, whose rate goes as the SQUARE of the droplet diameter, so the grade curve follows from the physics rather than from a preference.

A reader who quotes a removal without knowing which curve produced it has thrown away half the row.

## A removal you cannot move

None of the four percentages above is transferable. Put the same walnut shell filter first and it reports 60.582215 percent. Nothing about the bed changed. The water did.

So when a stage removal is quoted at you, ask what reached that stage and what the distribution looked like when it did. Without both, the number is an anecdote.

## Exercise

Run the OGBOTOBO train in the panel and write down, for each stage, the cut size, the sharpness and the outlet median of the stage before it.

Then take the walnut shell filter, which reports 14.382082 percent at the back of the train, and say in one sentence whether that is a statement about the device or about the water it was given. Move it to the front of the train and check your answer.
