# Where the numbers come from

Typical values, their provenance, and how much they vary.

## The usual table

| condition | typical friction factor |
|---|---|
| cased hole, water-based mud | 0.20 to 0.30 |
| cased hole, oil-based mud | 0.15 to 0.25 |
| open hole, water-based mud | 0.25 to 0.40 |
| open hole, oil-based mud | 0.15 to 0.30 |

This course uses 0.25 cased and 0.35 open hole, which is a water-based mud in a reasonably clean hole.

## Where the table came from

From back-analysis of thousands of wells. Somebody fitted a factor to an observed hookload, recorded it against the mud type and the hole condition, and the ranges above are what those fits cluster around.

That is a perfectly respectable provenance and it is worth knowing it is the provenance. The numbers are not derived from a material property; they are the distribution of a fitted parameter.

## Why oil-based mud is lower

Because the base oil lubricates the contact and because oil-based mud generally makes a thinner, firmer filter cake. The effect is real and large: swapping to oil-based mud can take a fifth off the factor, which is often the difference between a well that can be drilled and one that cannot.

That is why extended reach wells are almost always drilled with oil-based or synthetic mud, and why the environmental cost of that choice is a genuine trade rather than a preference.

## Why open hole is higher than casing

Three reasons, in decreasing order of size.

Casing is smooth steel; open hole is rock with a filter cake, and it is rarely circular. Open hole accumulates cuttings; casing sections are usually above the cuttings-carrying part of the annulus. And open hole can have ledges, washouts and spiral grooves cut by the previous bit.

## The range is wider than the table

A factor of 0.6 in a badly cleaned high-angle hole is not unusual, and neither is 0.12 in a well-lubricated cased section.

So the table is a starting point for a plan, not a prediction. The plan should be run at a range, and the first calibration on the actual well should replace it.

## How much the choice matters

On the build-and-hold well, the pick-up hookload across the range 0.15 to 0.50:

| open-hole factor | pick-up hookload |
|---|---|
| 0.15 | 906096.6898234246 N |
| 0.25 | 984604.8690725992 N |
| 0.35 | 1063113.0483217717 N |
| 0.50 | 1180875.3171955291 N |

That is 274778.6273721045 N across the range, or about 28 tonnes. On a plan, that is the difference between one rig and another.

## Exercise

Using the table above, compute the change in pick-up hookload per 0.01 of friction factor on this well. It is 7850.81792 N, and it is the same at every point in the range.

Then say how large an error in the assumed factor would be needed to change the derrick rating you specify, if ratings come in 200 kN steps.
