# The Ekene sand on paper

Every number in this course comes from one committed dataset: the Ekene SCAL fixture, the same teaching field the geoscience ladder mapped and booked and the earlier reservoir courses produced and balanced. This lesson lays out the full design table, because from here on every worked example assumes you know these values and where each one enters the machinery.

## The design table

| property | symbol | value |
|---|---|---|
| connate water saturation | $S_{wc}$ | 0.35 |
| residual oil saturation | $S_{or}$ | 0.25 |
| water endpoint relative permeability | $k_{rw,max}$ | 0.3 |
| oil endpoint relative permeability | $k_{ro,max}$ | 0.9 |
| water Corey exponent | $n_w$ | 2.5 |
| oil Corey exponent | $n_o$ | 2.0 |
| water viscosity | $\mu_w$ | 0.5 cp |
| oil viscosity | $\mu_o$ | 1.8 cp |
| pore volume | $PV$ | 22410845.5314109 bbl |

The first two rows you met in the last lesson; they fence the mobile window at 0.35 to 0.75 and set the movable fraction at 0.4.

The next four rows describe the relative permeability curves, and module 2 builds them from exactly these six numbers using the Corey model. For now, read them as a preview. The endpoints $k_{rw,max}$ and $k_{ro,max}$ say how freely each fluid flows when it has the mobile window to itself: oil at connate water flows at ninety percent of the rock's full capacity, while water at residual oil manages only thirty percent. The exponents $n_w$ and $n_o$ say how quickly each fluid's mobility builds as its saturation grows. None of the four is exotic; this is an ordinary water-wet sandstone curve set.

The viscosities are the fluid half of the story. The oil is a light 32 API crude at flood-era conditions, 1.8 cp, only 3.6 times as viscous as the 0.5 cp injection water. Module 3 combines that ratio with the endpoint permeabilities into a single number that summarizes whether this flood is easy or hard, and for Ekene the answer will be: favorable.

## Where the pore volume comes from

The pore volume row is not a new measurement. It is the locked NG5 booking from the geoscience ladder, 3563045.809312045 cubic metres of pore space, converted to barrels at the exact factor this fixture family always uses:

$$PV = 3563045.809312045 \times 6.2898 = 22410845.5314109 \text{ bbl}$$

Do the multiplication yourself once, and notice that the course quotes the full-precision product rather than a rounded one. The habit matters: the grading engine works at machine precision, and a value you re-round and re-multiply drifts in the last figures. When a lesson hands you a number, use the number as printed.

That pore volume carries 12.139208107496763 million stock tank barrels of oil in the booking, at the initial water saturation of 0.35 that the previous lesson placed at exactly the connate value. The volumetric courses counted that oil and the material balance course watched its pressure support; this course is where it finally gets pushed.

## What this course does with the table

The six curve and fluid numbers flow through the tier in a strict order, and it helps to see the assembly line before entering it:

1. Module 2 turns $S_{wc}$, $S_{or}$, the two endpoints, and the two exponents into relative permeability curves $k_{rw}(S_w)$ and $k_{ro}(S_w)$.
2. Module 3 combines those curves with $\mu_w$ and $\mu_o$ into the fractional flow curve $f_w(S_w)$, the fraction of flowing volume that is water at each saturation.
3. Module 4 applies one geometric construction to that curve and out fall the front saturation, the breakthrough time in pore volumes, and the displacement efficiency at breakthrough.
4. Module 5 extends past breakthrough, converts pore volumes to days using $PV$ and an injection rate, and closes with the ceiling that the endpoints impose.

Nothing else enters. There is no history to match and no noise to argue with; the fixture is exact by construction, so every difference between your hand result and the engine's is a mistake to find, not a tolerance to shrug at.

## The misconception to avoid

Learners see a tidy table like this one and treat the Corey parameters as measured constants of nature, as if a laboratory instrument read out $n_w = 2.5$ the way a thermometer reads temperature. It did not. What the laboratory measures is a table of relative permeability points on core plugs; the Corey model is a curve FITTED through such points, and the exponents are fit parameters. The Ekene fixture is built the other way around, model first, precisely so that every later calculation has an exact answer. Real field work runs the fit, asks how well the model earns its parameters, and reads confidence intervals before trusting them. That entire discipline is the opening module of the Expert tier; here you get the clean version so the displacement physics can be learned without fog.

## Exercise

Cover the table and write from memory the six numbers that define the Ekene relative permeability set, then check yourself. First, using the endpoints you recalled, verify the mobile window and the movable oil volume of 8964338.21256436 bbl from the pore volume row. Second, the fixture's oil is 1.8 cp against water at 0.5 cp; a heavier crude at 5 cp is coming in module 3. Write one sentence predicting which of the table's nine rows change if the oil is swapped for the heavier one, and one sentence saying why the movable oil volume does not.
