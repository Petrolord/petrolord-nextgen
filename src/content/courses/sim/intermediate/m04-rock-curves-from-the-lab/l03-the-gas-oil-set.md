# The gas-oil set

SWOF came from the SCAL course. SGOF did not, because that course never built one. This lesson is about where the gas-oil table came from and how to treat a table that was designed rather than measured.

## What SGOF holds

Twenty one rows from Sg = 0 to Sg = 0.65, giving gas relative permeability, oil relative permeability in the presence of gas, and a capillary pressure column of zeros.

| position | Sg | krg | krog |
|---|---|---|---|
| no free gas | 0 | 0 | 0.9 |
| maximum gas | 0.65 | 0.8 | 0 |

## Where it came from

A Corey form with three parameters chosen for this deck:

    critical gas saturation   0.05
    gas endpoint mobility     0.8
    gas exponent              2.0

None of those came from a laboratory. They are the deck's own design constants, chosen to be physically ordinary, and they are labelled as such in the fixture.

## Why the SCAL course never built one

Because Ekene never goes below its bubble point, so no free gas exists in the field's history. A gas-oil relative permeability curve describes a displacement that the field has never performed.

The SCAL course did what a good course does with a curve nobody can constrain: it did not invent one.

## Why the deck needs one anyway

The same two reasons the gas PVT table is needed. Near-wellbore pressures fall below the bubble point even when field pressure does not, and a forecast can go anywhere.

So the deck must carry a gas-oil table, and no measurement exists to build it from. The only options are to design one and say so, or to leave a default in place and not notice.

## How to treat a designed table

Three rules.

**Label it.** The deck should say in a comment that the gas-oil set is assumed rather than measured, with its three parameters. A reader who sees a full SGOF block and no such comment will reasonably assume it came from a lab.

**Do not grade anything on it.** No conclusion in this course rests on the gas-oil curve, and no capstone field is computed from it. That is deliberate, and it is the same treatment the waterflood course gave to enhanced recovery screening: taught, never graded.

**Test its influence.** If a forecast turns out to be sensitive to the gas-oil curve, the study has a problem, because the sensitivity is to a table nobody measured. The right response is a sensitivity case, not a tighter number.

## The critical gas saturation

Worth a note on its own. The 0.05 means gas has to build to five percent saturation before it can flow at all. Below that it is present and immobile.

That parameter has a large effect in a solution gas drive, because it decides how much gas the reservoir retains before it starts losing energy through the producers. For Ekene it will barely matter, because the reservoir stays undersaturated, which is precisely why a value could be chosen without argument.

## The misconception to avoid

"Every table in PROPS came from the laboratory." Decks routinely mix measured, correlated and assumed data, and the format shows no difference between them: 21 rows of numbers look identical whatever produced them. The provenance lives in comments and in the study document, and if neither says, the honest answer to "where did this come from" is that nobody knows.

## Exercise

First, verify one interior SGOF row from the three parameters: compute krg at Sg = 0.35 using a critical gas saturation of 0.05, an endpoint of 0.8, an exponent of 2, connate water 0.35 and residual oil 0.25.

Second, list the three rules for treating a designed table and say which one this course applied to its own capstone.
