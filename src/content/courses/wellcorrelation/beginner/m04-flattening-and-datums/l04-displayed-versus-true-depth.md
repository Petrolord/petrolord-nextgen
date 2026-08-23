# Displayed versus true depth

Flattening buys you a clearer picture and charges you a discipline in return: from the moment you set a datum, every well has two depths for every surface, and you must always know which one you are quoting.

True measured depth is a property of the wellbore. It is what the logging tool recorded, what the tops table stores, and what anyone drilling or completing that well works in. Displayed depth is a position on a panel whose vertical axis you redefined when you chose a datum. It exists only inside that view, and it changes the moment you change the datum.

## The two numbers, side by side

Under the capstone datum, TOP_SAND at 1500 m, Ekene-1's shift is $-48$. Its TOP_B sits at a true 1640 m and therefore displays at $1640 - 48 = 1592$ m. That 1592 is one of the six graded capstone numbers, and the pair is the point: 1640 is where the surface is, 1592 is where it draws. Similarly, Ekene-4's BASE_SAND is truly at 1615 m and displays at 1525 m under a shift of $-90$.

Neither pair of numbers is more correct than the other. They answer different questions. Confusing them is what causes trouble.

## The full displayed picture

Here is the whole Ekene section under the capstone datum. True depths on the left of each pair, displayed on the right.

| Well | Shift | TOP_A | TOP_SAND | BASE_SAND | TOP_B |
| --- | --- | --- | --- | --- | --- |
| Ekene-1 | $-48$ | 1500 / 1452 | 1548 / 1500 | 1580 / 1532 | 1640 / 1592 |
| Ekene-2 | $-65$ | 1512 / 1447 | 1565 / 1500 | 1601 / 1536 | 1662 / 1597 |
| Ekene-3 | $-41$ | 1495 / 1454 | 1541 / 1500 | 1570 / 1529 | 1628 / 1587 |
| Ekene-4 | $-90$ | 1530 / 1440 | 1590 / 1500 | 1615 / 1525 | none |

Three things to check in that table before you trust it. The TOP_SAND display column is 1500 four times, which is the construction guarantee from lesson two. Every displayed number in a row is its true depth plus that row's single shift, with no exceptions. And the sand thicknesses read off the displayed columns are $1532 - 1500 = 32$, $1536 - 1500 = 36$, $1529 - 1500 = 29$ and $1525 - 1500 = 25$ m, matching the true thicknesses exactly.

Read down the displayed TOP_B column and you get the payoff of the whole exercise: 1592, 1597 and 1587 m, a spread of 10 m. In true depth those same picks spread from 1628 to 1662 m, a spread of 34 m. Most of what looked like variation on TOP_B was the structure of the sand carrying it, and once that is removed the interval below the sand is far more uniform than the structural section suggested.

## The rules

**Never report a displayed depth as a well depth.** "TOP_B in Ekene-1 is at 1592" is simply false. The correct statement is "TOP_B in Ekene-1 is at 1640 m MD, displaying at 1592 m on the section flattened on TOP_SAND at 1500 m."

**Never hand a displayed depth to a driller.** Or to a completion engineer, a perforation design, a casing programme, or a volumetric calculation. Anything that touches the physical well takes true measured depth. A displayed depth in an operational document is a real and expensive error, and 1525 m looks just as much like a depth as 1615 m does.

**Always state the datum alongside any flattened reading.** A displayed depth without its datum is meaningless, because the same surface displays at different numbers under different datums. Ekene-1's TOP_SAND displays at 1500 m under the capstone datum and at 1498 m under the TOP_A datum. The number alone cannot tell you which view produced it.

## The section range moves too

The auto-fit range of the panel is computed from displayed depths, so it changes with the datum as well. Structurally, the Ekene tops run from 1495 m, Ekene-3's TOP_A, down to 1662 m, Ekene-2's TOP_B: a span of 167 m. Flattened on TOP_SAND at 1500, they run from 1440 m, now Ekene-4's TOP_A, down to 1597 m, still Ekene-2's TOP_B: a span of 157 m.

Notice that removing 49 m of relief on TOP_SAND did not shrink the panel by 49 m. It shrank it by 10 m, and the shallowest well changed identity along the way. The extremes of a flattened panel are set by the intervals above and below the datum, not by the datum surface itself. This is a small thing, but it is the kind of small thing that tells you whether you have understood what the shift actually did.

Try it yourself: the panel below draws the Ekene section from the same engine, with the datum under your control.

{{panel:wc-section-explorer}}

## Exercise

Under the capstone datum, Ekene-2's TOP_A displays at 1447 m. Give its true depth, then give the displayed depth of the same surface under the TOP_A datum at 1450 m, and say in one sentence why the two displayed numbers differ.

Self-check: the true depth is $1447 + 65 = 1512$ m. Under the TOP_A datum, Ekene-2's shift is $1450 - 1512 = -62$, so TOP_A displays at $1512 - 62 = 1450$ m, the datum, by construction. They differ because the displayed depth is a property of the chosen datum and not of the well, while the true 1512 m is the same in both views.
