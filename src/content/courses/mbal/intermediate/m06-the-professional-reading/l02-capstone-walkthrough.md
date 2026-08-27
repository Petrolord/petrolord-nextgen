# The capstone walkthrough

The Professional capstone is called "Aquifers, and the cost of the wrong one". First you build a Fetkovich aquifer from the published geometry of Ahmed Example 10-10 and march it. Then you force an aquifer onto the Ekene tank, which does not have one, and report what it costs. Six numbers, graded server side.

| Field | Unit | Tolerance | Where it is derived |
|---|---|---|---|
| Fetkovich $W_{ei}$ for Ahmed 10-10 | bbl | 500000 | module 3 lesson 2 |
| Aquifer productivity index $J$ | bbl/d/psi | 0.5 | module 3 lesson 1 |
| Decay term over one 365 day step | none | 0.002 | module 3 lesson 3 |
| Cumulative $W_e$ after four steps | MMbbl | 0.4 | module 3 lesson 5 |
| Oil in place when a pot aquifer is forced on Ekene | stb | 20000 | module 2 lesson 4 |
| Fit statistic of that wrong model | none | 0.002 | module 2 lesson 4 |

This lesson does not hand you six answers. It works two of them all the way through, by panel and by hand, and points at the lesson that owns each of the rest.

## Set the aquifer panel up correctly

{{panel:mb-aquifer-explorer}}

Eleven editable fields carry the published geometry of Ahmed Example 10-10: thickness 100 ft, porosity 0.25, total compressibility 0.000007 per psi, initial pressure 2740 psia, permeability 200 md, encroachment angle 140 degrees, water viscosity 0.55 cp, reservoir radius 9200 ft, aquifer radius 46000 ft, radius ratio 5, and a 365 day step. Leave all of them where they load.

Below them is a two button toggle for the productivity index denominator. It must read `ln(reD) - 0.75  (pseudo steady state)`, the highlighted default. The other button exists so you can see the trap, and it is not valid for any graded field. The panel's note line tells you when you are at the book's own geometry, and while it does, the printed influx column applies.

## Walkthrough one: the encroachable water, by tile and by hand

$W_{ei}$ is the water the aquifer can deliver in total, drawn all the way down to zero pressure. It is the aquifer's whole account, and every step of the march is a withdrawal against it. Read it from the tile labelled `Wei`: 211934253.721285 bbl, against a tolerance of 500000 bbl. Now earn it in four steps, because this is the field where the trap lives.

**Step one, the full circle.** The aquifer occupies the ring between the two radii, over the thickness, at the porosity, converted from cubic feet to barrels:

$$W_i = \frac{\pi (r_a^2 - r_e^2) h \phi}{5.615}$$

With $r_a^2 - r_e^2 = 2031360000.00000$ ft squared that is 28413649389.1192 bbl, against a printed 28410000000 bbl: agreement to 0.0128454386453786 percent.

**Step two, the wedge.** This aquifer does not surround the reservoir. It meets it over an encroachment angle of 140 degrees, so only

$$f = \frac{140}{360} = 0.388888888888889$$

of that ring is connected, and the wedge holds 11049752540.2130 bbl. Confirm on the `Wi, full circle` and `Wi, wedge share` tiles that the ratio between them is the angle fraction.

**Step three, the trap.** The printed $W_i$ is the full circle, not the wedge, and the angle enters once, here. Apply it again when forming $W_{ei}$, the natural mistake if you assume the printed $W_i$ was already reduced, and the answer comes out 2.57142857142857 times too small at 82418876.4471665 bbl, missing the tolerance by more than two hundred times over.

**Step four, the encroachable fraction.** The aquifer cannot deliver its whole volume, only the part that expands as its pressure falls from initial to zero:

$$W_{ei} = c_t W_{i,\text{wedge}} p_i = 0.000007 \times 11049752540.2130 \times 2740 = 211934253.721285 \ \text{bbl}$$

The book prints 211900000 bbl, an agreement of 0.0161650407198692 percent.

## Walkthrough two: the cost of the wrong aquifer

{{panel:mb-tank-explorer}}

This is the only place in the course where you report a number from a deliberately wrong model.

The panel has one control, the aquifer model handed to the engine, and for the two Ekene fields it must be set to `Pot aquifer (not needed here)`. Every other number you have read here came from the `None (the truth)` setting, so change it deliberately and change it back afterwards.

With the pot aquifer selected the `OOIP from the slope` tile reads

$$N = -516449.043355256 \ \text{stb}$$

against a tolerance of 20000 stb, and the fit statistic tile beside it is the second graded field.

You cannot derive that by hand and you are not meant to. What you should understand is its shape, which module 2 lesson 4 established. The regression has a second free parameter on data that needs only one, and it spends it: the aquifer term absorbs 42890161.1573930 rb of imagined water, the water drive index reads 1.04254388249892, and the oil in place is pushed to whatever closes the books once that water has done the oil's work.

One arithmetic check shows the mechanism. Divide the reported oil in place by the Associate answer of 12139208.1074968 stb and you get -0.0425438824989180, exactly the depletion and rock and water indices added together. Add the water drive index of 1.04254388249892 and you land on 1.00000000000000. The indices close perfectly, on the same rows the Associate tier read as a textbook depletion drive. Only the model changed, and the answer moved by more than the entire tank.

## Where the other four come from

**The productivity index.** Module 3 lesson 1, and the `J` tile, whose denominator is the pseudo steady state group. Cross check it against the book's printed 116.5 bbl/d/psi, comfortably inside the 0.5 tolerance.

**The decay term.** Module 3 lesson 3, and the `Decay over one step` tile. It is $1 - \exp(-J p_i \Delta t / W_{ei})$, the fraction of the remaining drawdown the aquifer delivers in one 365 day step. The book prints 0.4229.

**The cumulative influx.** Module 3 lesson 5, and the last row of the marching table, in MMbbl. Read the engine column and the printed column beside it, which ends at the book's 37.971 MMbbl. The point is not the tolerance. It is that a table typed from a book and an engine you did not write marched the same aquifer to the same place.

**The fit statistic of the wrong model.** Module 2 lesson 4, and the `R-squared` tile with the selector on the pot setting. Read it, then read the oil in place tile again.

## Submitting

The capstone form is on the Learning Mode page. Enter the six numbers at whatever precision you carried. If a field misses, do not add decimal places: every tolerance here is far wider than any rounding you could commit. Check instead the panel toggle, the aquifer selector, whether the encroachment angle went in once or twice, and whether the marching table was still at the published geometry.

## Exercise

Before submitting, predict the effect of four setup errors on each of the six fields: switching the denominator toggle to plain $\ln(r_{eD})$; applying the encroachment angle when quoting $W_i$ as well as when forming $W_{ei}$; leaving the Ekene selector on the no aquifer setting; and using the end of step reservoir pressure instead of the midpoint.

Write which fields fail and in which direction for each, then check two of your predictions in the panels. Two of the four move $W_e$ but not $W_{ei}$, one moves $W_{ei}$ and everything downstream of it, and one touches neither. Say which is which before you look.
