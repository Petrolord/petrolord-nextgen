# SAND_B and the field view

SAND_A has carried this module so far because the capstone grades it. But a booking is a field decision, and the field has two sands. This lesson books SAND_B with the corrected Rw and reads the result the way an Expert reads it: not as a smaller version of SAND_A, but as a different kind of object with a different sensitivity to parameter quality.

## Booking SAND_B

Same recipe, same corrected $R_w = 0.049910$ ohm.m, zone 2050 to 2080 m:

| Quantity | SAND_A | SAND_B |
| --- | --- | --- |
| Gross thickness | 20.5 m | 30.5 m |
| Net pay | 18.0 m | 5.5 m |
| Net to gross | 0.878 | 0.180 |
| Pay-average porosity | 0.2081 | 0.1417 |
| Pay-average Sw | 0.3609 | 0.5418 |

SAND_B is half again as thick as SAND_A in gross terms and delivers less than a third of its net. Its pay averages are worse on both axes: poorer rock at 0.1417 porosity, wetter at 0.5418 saturation.

## Reading the zone

The numbers describe a thin oil fringe sitting on water. The water leg you calibrated the Pickett fit on, 2075 to 2078 m, is the base of this very zone; SAND_B's lower metres are at or near unity saturation by construction. Above the leg, saturation falls off only slowly, and porosity in the zone means the Archie denominators are small: recall that SAND_B's neutron-density porosity averaged around 0.12 at the Professional tier, and the density porosity behind this booking behaves similarly. The result is a zone where most samples fail one cutoff or another, and the 5.5 m that survive do so without much room to spare, with saturations crowding the 0.6 cutoff from below.

That last clause is the important one. SAND_A's pay is anchored by a core of samples around $S_w = 0.35$, comfortably below the flip band a plausible Rw error creates. SAND_B's pay lives near the cutoff. Apply the previous lesson's logic: the raw-sample error scales every saturation by 1.5113, and its flip band runs from 0.397 to 0.600. Almost all of SAND_B's surviving pay sits inside that band. The same parameter error that trims SAND_A by 8 percent of its net would gut SAND_B nearly completely. Fragility to parameter error is not uniform across a field; it concentrates exactly where net to gross is already low and saturations are already transitional.

## Where sensitivity work earns its keep

This inverts a common instinct. It is tempting to spend validation effort in proportion to a zone's value: SAND_A holds the volume, so SAND_A gets the scrutiny. But SAND_A's booking is robust; its answer barely moves across the plausible Rw range. SAND_B's booking is the one that swings between "modest secondary target" and "not worth perforating" on the strength of the third decimal of Rw. The zones that most need parameter validation are the marginal ones, because cutoff arithmetic amplifies small input errors precisely where the distributions crowd the cutoffs.

The field view then writes itself. SAND_A is the asset: 18.0 m of net at 36 percent water saturation, robust to the parameter range you validated. SAND_B is upside: 5.5 m of thin, wetter, poorer pay whose booked existence depends on the quality of the Rw work you did in this course. A development plan treats the first as bankable and the second as an option whose value is mostly information value; an appraisal well or a pressure test that firms up SAND_B's fluid contacts changes its booking more than any petrophysical refinement of SAND_A would change its own.

## The honest caveat

One caution before you generalise. This analysis held porosity, Vsh and cutoffs fixed while stressing Rw, exactly as the module's design intends. A real marginal zone is usually fragile in several inputs at once, and porosity source or cutoff choice can matter as much as Rw. The Expert habit transfers unchanged: identify which zones sit near cutoffs, and stress those zones across every uncertain input, not only the one this course happens to teach.

## Exercise

Using the 1.5113 scaling factor, estimate the raw-Rw pay-average saturation SAND_B would report if none of its pay flipped, then explain why the actual raw booking of SAND_B cannot look like that. Self-check: $0.5418 \times 1.5113 = 0.819$, far above the 0.6 cutoff; since a pay average above the cutoff is impossible by construction, most SAND_B pay samples must instead flip to non-pay under the raw Rw, leaving at most a sliver of net whose average stays at or under 0.6. State in one sentence what that predicts for SAND_B's raw-Rw net pay relative to its corrected 5.5 m.
