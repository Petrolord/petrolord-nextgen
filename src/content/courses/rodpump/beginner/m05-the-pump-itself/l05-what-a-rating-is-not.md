# What a rating is not

Rated displacement is what the pump would make if the barrel filled completely and the plunger travelled the full surface stroke. Neither of those is true of a real well, and neither is checked.

{{panel:pd-string-explorer}}

## The two assumptions, named

| The rating assumes | What actually decides it |
| --- | --- |
| the plunger travels 106.687717 in | the rod string, the load and the speed |
| the barrel fills on every stroke | the inflow, the intake pressure and free gas |

Both are conditions on the well. Neither is an input to the multiplication, so neither can be violated by it.

## The stroke in the product is the wrong stroke

The 106.687717 in comes from a four-bar linkage at the surface. It is the polished rod's travel, and the polished rod sits at the top of a rod string that is a spring. The fluid load the pump itself creates, 4690.299657039 lb for a 1.7500 in plunger against 1950.0 psi, stretches the published taper 17.560655738 in. That stretch is stroke the plunger does not get, and it is there before anything moves.

A rated displacement of 380.874258458 bbl/d was computed on a length the pump never sees.

## The barrel is assumed full, and the engine knows better

The same engine that reports the rating carries a warning code called `incompleteFillage`, which fires when the fillage is below 0.85. A warning exists for exactly the condition the rating denies. The rating simply does not consult it. Fillage is a separate number a caller types in, and rated displacement is computed without it.

## The mistake

Quoting a rating as a deliverability. The number arrives as a plain bbl/d with nothing attached: no flag, no caveat, no statement of the two conditions it stands on. It is quoted in the same unit as a measured rate, and it is the first number anyone writes on a design sheet.

Ask the two questions instead. Does the plunger travel the surface stroke? Does the barrel fill? If either answer is no, the rating is an upper bound, and the size of the gap is not something a rating can tell you.

## What it refuses

It refuses a pump with no differential to lift against, with a message. It does not refuse a rating no well could reach. That asymmetry is the lesson: a hard check on the one condition that makes the arithmetic meaningless, and no check at all on the two that make the answer wrong.

## Exercise

Write the rated displacement of a 1.7500 in plunger at 10 spm on the published stroke, and beside it the static stretch that plunger's own fluid load causes on the published taper.

Then write, in one sentence each, the two things that would have to be true for that rating to be the production.
