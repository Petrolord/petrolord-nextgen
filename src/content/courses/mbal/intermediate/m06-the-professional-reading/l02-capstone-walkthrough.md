# The capstone walkthrough

The Professional capstone is called "Aquifers, and the cost of the wrong one". First you build a Fetkovich aquifer from the published geometry of Ahmed Example 10-10 and march it. Then you force an aquifer onto the Ekene tank, which does not have one, and report what it costs. Six numbers, graded server side.

| Field | Unit | Tolerance | Where it is derived |
|---|---|---|---|
| Fetkovich $W_{ei}$ for Ahmed 10-10 | bbl | 500000 | module 3 lesson 2 |
| Aquifer productivity index $J$ | bbl/d/psi | 0.5 | module 3 lesson 1 |
| Decay term over one 365 day step | none | 0.002 | module 3 lesson 3 |
| Cumulative $W_e$ after four steps | MMbbl | 0.4 | module 3 lesson 5 |
| Oil in place when a pot aquifer is forced on Ekene | stb | 20000 | module 2 lesson 4 |
| Fit statistic of that wrong model | none | 0.0001 | module 2 lesson 4 |

This lesson does not hand you six answers. It works the method of each on the worked examples the modules used, and points at the lesson that owns it. The six values themselves are yours to produce.

## Set the aquifer panel up correctly

{{panel:mb-aquifer-explorer}}

The panel opens on module 3's teaching aquifer. Type the published geometry of Ahmed Example 10-10 into its eleven fields: thickness 100 ft, porosity 0.25, total compressibility 0.000007 per psi, initial pressure 2740 psia, permeability 200 md, encroachment angle 140 degrees, water viscosity 0.55 cp, reservoir radius 9200 ft, aquifer radius 46000 ft, radius ratio 5, and a 365 day step. The note line tells you when you are at the book's own geometry, and only then does the printed influx column appear beside the engine's.

Below the fields is a two button toggle for the productivity index denominator. It must read `ln(reD) - 0.75  (pseudo steady state)`, the highlighted default. The other button exists so you can see the trap, and it is not valid for any graded field.

## Worked example one: the encroachable water, by tile and by hand

$W_{ei}$ is the water the aquifer can deliver in total, drawn all the way down to zero pressure. It is the aquifer's whole account, and every step of the march is a withdrawal against it. It is read from the tile labelled `Wei`, against a tolerance of 500000 bbl. Earn it in four steps, because this is the field where the trap lives; here they are on the teaching aquifer.

**Step one, the full circle.** The aquifer occupies the ring between the two radii, over the thickness, at the porosity, converted from cubic feet to barrels:

$$W_i = \frac{\pi (r_a^2 - r_e^2) h \phi}{5.615}$$

With $r_a^2 - r_e^2 = 1269600000$ ft squared that is 12502005731.212427 bbl on the teaching aquifer.

**Step two, the wedge.** An aquifer that does not surround the reservoir meets it over an encroachment angle, so only $f = \theta/360$ of that ring is connected: half of it on the teaching aquifer, a wedge of 6251002865.606214 bbl. Confirm on the `Wi, full circle` and `Wi, wedge share` tiles that the ratio between them is the angle fraction.

**Step three, the trap.** A published $W_i$ is the full circle, and the angle enters once, here. Apply it again when forming $W_{ei}$, the natural mistake if you assume the quoted $W_i$ was already reduced, and the answer comes out $360/\theta$ times too small, far outside the tolerance.

**Step four, the encroachable fraction.** The aquifer cannot deliver its whole volume, only the part that expands as its pressure falls from initial to zero:

$$W_{ei} = c_t W_{i,\text{wedge}} p_i = 0.000006 \times 6251002865.606214 \times 2740 = 102766487.11056614 \ \text{bbl}$$

on the teaching aquifer. Run the same four steps on the published geometry for the capstone.

## Worked example two: the cost of the wrong aquifer

{{panel:mb-tank-explorer}}

This is the only place in the course where you report a number from a deliberately wrong model.

For the two Ekene fields the tank explorer's aquifer control must be set to `Pot aquifer (not needed here)`. Every other number you read from it came from the `None (the truth)` setting, so change it deliberately and change it back afterwards. With the pot aquifer selected, the `OOIP from the slope` tile is the first field and the fit statistic tile beside it is the second.

You cannot derive that oil in place by hand and you are not meant to. What you should understand is its shape, which module 2 lesson 4 established. The regression has a second free parameter on data that needs only one, and it spends it: the aquifer term absorbs 42890161.1573930 rb of imagined water, the water drive index reads 1.04254388249892, and the oil in place is pushed to whatever closes the books once that water has done the oil's work.

One arithmetic check shows the mechanism, and it works on your own reading. Divide the oil in place you read by the Associate answer of 12139208.1074968 stb: the result is the depletion and rock and water indices added together. Add the water drive index and you land on exactly 1. The indices close perfectly, on the same rows the Associate tier read as a textbook depletion drive. Only the model changed, and the answer moved by more than the entire tank.

## Where the other four come from

**The productivity index.** Module 3 lesson 1, and the `J` tile, whose denominator is the pseudo steady state group. Cross check it against the value the book prints, which the 0.5 tolerance comfortably covers.

**The decay term.** Module 3 lesson 3, and the `Decay over one step` tile. It is $1 - \exp(-J p_i \Delta t / W_{ei})$, the fraction of the remaining drawdown the aquifer delivers in one 365 day step, and the book prints it to four figures.

**The cumulative influx.** Module 3 lesson 5, and the last row of the marching table, in MMbbl. Read the engine column and, at the published geometry, the printed column beside it. The point is not the tolerance. It is that a table typed from a book and an engine you did not write marched the same aquifer to the same place.

**The fit statistic of the wrong model.** Module 2 lesson 4, and the `R-squared` tile with the selector on the pot setting. Read it, then read the oil in place tile again.

## Submitting

The capstone form is on the Learning Mode page. Enter the six numbers at whatever precision you carried. If a field misses, do not add decimal places: every tolerance here is far wider than any rounding you could commit. Check instead the panel toggle, the aquifer selector, whether the encroachment angle went in once or twice, and whether the marching table was still at the published geometry.

## Exercise

Before submitting, predict the effect of four setup errors on each of the six fields: switching the denominator toggle to plain $\ln(r_{eD})$; applying the encroachment angle when quoting $W_i$ as well as when forming $W_{ei}$; leaving the Ekene selector on the no aquifer setting; and using the end of step reservoir pressure instead of the midpoint.

Write which fields fail and in which direction for each, then check two of your predictions in the panels. Two of the four move $W_e$ but not $W_{ei}$, one moves $W_{ei}$ and everything downstream of it, and one touches neither. Say which is which before you look.
